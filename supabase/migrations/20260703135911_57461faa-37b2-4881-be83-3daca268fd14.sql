-- Recriar views com security_invoker para eliminar erro de Security Definer View
DROP VIEW IF EXISTS public.users_with_roles;
CREATE OR REPLACE VIEW public.users_with_roles
WITH (security_invoker = true)
AS
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
CREATE OR REPLACE VIEW public.user_management_view
WITH (security_invoker = true)
AS
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
