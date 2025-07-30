-- Inserir role de admin para o usuário especificado
-- Primeiro vamos verificar se o usuário existe na tabela auth.users e então adicionar a role

-- Inserir a role de admin para o usuário marcondesjr.ti@gmail.com
-- Nota: O user_id será obtido da tabela auth.users baseado no email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'marcondesjr.ti@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Criar uma view para facilitar consultas de usuários com roles
CREATE OR REPLACE VIEW public.users_with_roles AS
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.last_sign_in_at,
  u.raw_user_meta_data,
  COALESCE(
    (SELECT array_agg(ur.role::text) 
     FROM public.user_roles ur 
     WHERE ur.user_id = u.id), 
    ARRAY['user']
  ) as roles
FROM auth.users u;

-- Criar função para verificar se o usuário atual é admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::app_role);
$$;

-- Adicionar política para permitir que admins vejam todos os usuários
CREATE POLICY "Admins can view all user roles and info" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Criar função para admins gerenciarem roles de usuários
CREATE OR REPLACE FUNCTION public.admin_set_user_role(target_user_id uuid, new_role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Acesso negado: apenas admins podem alterar roles';
  END IF;

  -- Remover roles existentes do usuário
  DELETE FROM public.user_roles WHERE user_id = target_user_id;
  
  -- Adicionar nova role
  INSERT INTO public.user_roles (user_id, role) VALUES (target_user_id, new_role);
END;
$$;

-- Criar função para admins gerenciarem planos de usuários
CREATE OR REPLACE FUNCTION public.admin_update_user_plan(
  target_user_id uuid, 
  new_plan_type text,
  new_posts_limit integer DEFAULT 10,
  new_ai_requests_limit integer DEFAULT 50,
  new_social_accounts_limit integer DEFAULT 2,
  expires_at_param timestamp with time zone DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Acesso negado: apenas admins podem alterar planos';
  END IF;

  -- Atualizar ou inserir plano do usuário
  INSERT INTO public.user_plans (
    user_id, 
    plan_type, 
    posts_limit, 
    ai_requests_limit, 
    social_accounts_limit,
    expires_at,
    is_active,
    started_at
  ) VALUES (
    target_user_id,
    new_plan_type,
    new_posts_limit,
    new_ai_requests_limit,
    new_social_accounts_limit,
    expires_at_param,
    true,
    now()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    plan_type = EXCLUDED.plan_type,
    posts_limit = EXCLUDED.posts_limit,
    ai_requests_limit = EXCLUDED.ai_requests_limit,
    social_accounts_limit = EXCLUDED.social_accounts_limit,
    expires_at = EXCLUDED.expires_at,
    is_active = EXCLUDED.is_active,
    started_at = EXCLUDED.started_at,
    updated_at = now();
END;
$$;

-- Criar tabela para logs de ações administrativas
CREATE TABLE public.admin_action_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL,
  target_user_id uuid,
  action_type text NOT NULL,
  action_details jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela de logs
ALTER TABLE public.admin_action_logs ENABLE ROW LEVEL SECURITY;

-- Política para que apenas admins vejam os logs
CREATE POLICY "Only admins can view action logs" 
ON public.admin_action_logs 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Política para inserir logs (sistema pode inserir)
CREATE POLICY "System can insert action logs" 
ON public.admin_action_logs 
FOR INSERT 
WITH CHECK (true);

-- Função para registrar ações administrativas
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_type_param text,
  target_user_id_param uuid DEFAULT NULL,
  action_details_param jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.admin_action_logs (
    admin_user_id,
    target_user_id,
    action_type,
    action_details
  ) VALUES (
    auth.uid(),
    target_user_id_param,
    action_type_param,
    action_details_param
  );
END;
$$;