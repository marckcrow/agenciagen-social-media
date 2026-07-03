-- =====================================================================
-- Correções de segurança: sincronizar dados de auth.users para profiles,
-- recriar view segura, e revogar EXECUTE de anon em funções SECURITY DEFINER
-- =====================================================================

-- =====================================================================
-- 1. Adicionar colunas espelhadas em profiles
-- =====================================================================
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_sign_in_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS raw_user_meta_data JSONB;

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- =====================================================================
-- 2. Atualizar função de criação de perfil para incluir novos campos
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, last_sign_in_at, raw_user_meta_data)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.last_sign_in_at,
    NEW.raw_user_meta_data
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    last_sign_in_at = EXCLUDED.last_sign_in_at,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data;
  RETURN NEW;
END;
$$;

-- =====================================================================
-- 3. Trigger para sincronizar atualizações de auth.users em profiles
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.profiles SET
    email = NEW.email,
    last_sign_in_at = NEW.last_sign_in_at,
    raw_user_meta_data = NEW.raw_user_meta_data,
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', public.profiles.full_name)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- =====================================================================
-- 4. Sincronizar dados existentes de auth.users para profiles
-- =====================================================================
INSERT INTO public.profiles (id, email, full_name, last_sign_in_at, raw_user_meta_data)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', ''),
  last_sign_in_at,
  raw_user_meta_data
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
  last_sign_in_at = EXCLUDED.last_sign_in_at,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data;

-- =====================================================================
-- 5. Recriar views para não expor auth.users diretamente
-- =====================================================================
DROP VIEW IF EXISTS public.users_with_roles;
CREATE OR REPLACE VIEW public.users_with_roles AS
SELECT
  p.id,
  p.email,
  p.created_at,
  p.last_sign_in_at,
  p.raw_user_meta_data,
  COALESCE(
    (SELECT array_agg(ur.role::text)
     FROM public.user_roles ur
     WHERE ur.user_id = p.id),
    ARRAY['user']
  ) as roles
FROM public.profiles p;

GRANT SELECT ON public.users_with_roles TO authenticated;

DROP VIEW IF EXISTS public.user_management_view;
CREATE OR REPLACE VIEW public.user_management_view AS
SELECT
  p.id,
  p.email,
  p.full_name,
  p.created_at,
  ARRAY_AGG(ur.role) FILTER (WHERE ur.role IS NOT NULL) as roles,
  up.plan_type,
  up.is_active as plan_active
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
LEFT JOIN public.user_plans up ON p.id = up.user_id
GROUP BY p.id, p.email, p.full_name, p.created_at, up.plan_type, up.is_active;

GRANT SELECT ON public.user_management_view TO authenticated;

-- =====================================================================
-- 6. Revogar EXECUTE de anon em funções SECURITY DEFINER
-- =====================================================================
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_current_user_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.increment_usage_stat(uuid, date, text, integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_set_user_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_update_user_plan(uuid, text, integer, integer, integer, timestamp with time zone) FROM anon;
REVOKE EXECUTE ON FUNCTION public.log_admin_action(text, uuid, jsonb) FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_user_update() FROM anon;

-- Conceder EXECUTE explicitamente para authenticated nas funções que o frontend precisa
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_usage_stat(uuid, date, text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_user_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_user_plan(uuid, text, integer, integer, integer, timestamp with time zone) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_admin_action(text, uuid, jsonb) TO authenticated;
