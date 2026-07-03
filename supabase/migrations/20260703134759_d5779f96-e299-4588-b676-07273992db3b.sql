-- =====================================================================
-- Schema consolidado AdGen AI para Lovable Cloud
-- FASE 2: Funções, policies, triggers, views e admin inicial
-- =====================================================================

-- =====================================================================
-- Funções de permissão
-- =====================================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::public.app_role);
$$;

-- =====================================================================
-- Função utilitária: atualizar updated_at
-- =====================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =====================================================================
-- Trigger: criar perfil automaticamente no signup
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================================
-- Triggers updated_at
-- =====================================================================
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_plans_updated_at ON public.user_plans;
CREATE TRIGGER update_user_plans_updated_at
  BEFORE UPDATE ON public.user_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_social_accounts_updated_at ON public.social_accounts;
CREATE TRIGGER update_social_accounts_updated_at
  BEFORE UPDATE ON public.social_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_metrics_updated_at ON public.admin_metrics;
CREATE TRIGGER update_admin_metrics_updated_at
  BEFORE UPDATE ON public.admin_metrics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_settings_updated_at ON public.admin_settings;
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================================
-- Policies: profiles
-- =====================================================================
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- =====================================================================
-- Policies: user_roles
-- =====================================================================
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- =====================================================================
-- Policies: user_plans
-- =====================================================================
DROP POLICY IF EXISTS "Users can view their own plan" ON public.user_plans;
CREATE POLICY "Users can view their own plan" ON public.user_plans FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own plan" ON public.user_plans;
CREATE POLICY "Users can update their own plan" ON public.user_plans FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert plans" ON public.user_plans;
CREATE POLICY "System can insert plans" ON public.user_plans FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all plans" ON public.user_plans;
CREATE POLICY "Admins can view all plans" ON public.user_plans FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- =====================================================================
-- Policies: posts
-- =====================================================================
DROP POLICY IF EXISTS "Users can view their own posts" ON public.posts;
CREATE POLICY "Users can view their own posts" ON public.posts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own posts" ON public.posts;
CREATE POLICY "Users can create their own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
CREATE POLICY "Users can update their own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;
CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all posts" ON public.posts;
CREATE POLICY "Admins can view all posts" ON public.posts FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- =====================================================================
-- Policies: social_accounts
-- =====================================================================
DROP POLICY IF EXISTS "Users can view their own social accounts" ON public.social_accounts;
CREATE POLICY "Users can view their own social accounts" ON public.social_accounts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own social accounts" ON public.social_accounts;
CREATE POLICY "Users can create their own social accounts" ON public.social_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own social accounts" ON public.social_accounts;
CREATE POLICY "Users can update their own social accounts" ON public.social_accounts FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own social accounts" ON public.social_accounts;
CREATE POLICY "Users can delete their own social accounts" ON public.social_accounts FOR DELETE USING (auth.uid() = user_id);

-- =====================================================================
-- Policies: social_metrics
-- =====================================================================
DROP POLICY IF EXISTS "Users can view metrics for their posts" ON public.social_metrics;
CREATE POLICY "Users can view metrics for their posts" ON public.social_metrics FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.posts WHERE posts.id = social_metrics.post_id AND posts.user_id = auth.uid())
);

DROP POLICY IF EXISTS "System can insert metrics" ON public.social_metrics;
CREATE POLICY "System can insert metrics" ON public.social_metrics FOR INSERT WITH CHECK (true);

-- =====================================================================
-- Policies: usage_stats
-- =====================================================================
DROP POLICY IF EXISTS "Users can view own stats" ON public.usage_stats;
CREATE POLICY "Users can view own stats" ON public.usage_stats FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all stats" ON public.usage_stats;
CREATE POLICY "Admins can view all stats" ON public.usage_stats FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Users can insert own stats" ON public.usage_stats;
CREATE POLICY "Users can insert own stats" ON public.usage_stats FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "System can insert stats" ON public.usage_stats;
CREATE POLICY "System can insert stats" ON public.usage_stats FOR INSERT WITH CHECK (auth.uid() IS NULL OR user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own stats" ON public.usage_stats;
CREATE POLICY "Users can update own stats" ON public.usage_stats FOR UPDATE USING (user_id = auth.uid());

-- =====================================================================
-- Policies: admin_metrics
-- =====================================================================
DROP POLICY IF EXISTS "Admins can view all admin metrics" ON public.admin_metrics;
CREATE POLICY "Admins can view all admin metrics" ON public.admin_metrics FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can insert admin metrics" ON public.admin_metrics;
CREATE POLICY "Admins can insert admin metrics" ON public.admin_metrics FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can update admin metrics" ON public.admin_metrics;
CREATE POLICY "Admins can update admin metrics" ON public.admin_metrics FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- =====================================================================
-- Policies: notifications
-- =====================================================================
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.notifications;
CREATE POLICY "Admins can manage all notifications" ON public.notifications FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- =====================================================================
-- Policies: webhook_events
-- =====================================================================
DROP POLICY IF EXISTS "Admins can view all webhook events" ON public.webhook_events;
CREATE POLICY "Admins can view all webhook events" ON public.webhook_events FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "System can manage webhook events" ON public.webhook_events;
CREATE POLICY "System can manage webhook events" ON public.webhook_events FOR ALL USING (true);

-- =====================================================================
-- Policies: admin_settings
-- =====================================================================
DROP POLICY IF EXISTS "Only admins can view admin settings" ON public.admin_settings;
CREATE POLICY "Only admins can view admin settings" ON public.admin_settings FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Only admins can create admin settings" ON public.admin_settings;
CREATE POLICY "Only admins can create admin settings" ON public.admin_settings FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Only admins can update admin settings" ON public.admin_settings;
CREATE POLICY "Only admins can update admin settings" ON public.admin_settings FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Only admins can delete admin settings" ON public.admin_settings;
CREATE POLICY "Only admins can delete admin settings" ON public.admin_settings FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- =====================================================================
-- Policies: admin_action_logs
-- =====================================================================
DROP POLICY IF EXISTS "Only admins can view action logs" ON public.admin_action_logs;
CREATE POLICY "Only admins can view action logs" ON public.admin_action_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "System can insert action logs" ON public.admin_action_logs;
CREATE POLICY "System can insert action logs" ON public.admin_action_logs FOR INSERT WITH CHECK (true);

-- =====================================================================
-- Funções administrativas
-- =====================================================================
CREATE OR REPLACE FUNCTION public.increment_usage_stat(
  p_user_id UUID,
  p_date DATE,
  p_stat TEXT,
  p_increment INTEGER DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.usage_stats (user_id, date, posts_generated, posts_scheduled, ai_requests, social_accounts_connected)
  VALUES (
    p_user_id,
    p_date,
    CASE WHEN p_stat = 'posts_generated' THEN p_increment ELSE 0 END,
    CASE WHEN p_stat = 'posts_scheduled' THEN p_increment ELSE 0 END,
    CASE WHEN p_stat = 'ai_requests' THEN p_increment ELSE 0 END,
    CASE WHEN p_stat = 'social_accounts_connected' THEN p_increment ELSE 0 END
  )
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    posts_generated = usage_stats.posts_generated + CASE WHEN p_stat = 'posts_generated' THEN p_increment ELSE 0 END,
    posts_scheduled = usage_stats.posts_scheduled + CASE WHEN p_stat = 'posts_scheduled' THEN p_increment ELSE 0 END,
    ai_requests = usage_stats.ai_requests + CASE WHEN p_stat = 'ai_requests' THEN p_increment ELSE 0 END,
    social_accounts_connected = usage_stats.social_accounts_connected + CASE WHEN p_stat = 'social_accounts_connected' THEN p_increment ELSE 0 END;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_user_role(target_user_id uuid, new_role public.app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Acesso negado: apenas admins podem alterar roles';
  END IF;

  DELETE FROM public.user_roles WHERE user_id = target_user_id;
  INSERT INTO public.user_roles (user_id, role) VALUES (target_user_id, new_role);

  INSERT INTO public.admin_action_logs (admin_user_id, target_user_id, action_type, action_details)
  VALUES (auth.uid(), target_user_id, 'role_change', jsonb_build_object('new_role', new_role));
END;
$$;

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
SET search_path = ''
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Acesso negado: apenas admins podem alterar planos';
  END IF;

  INSERT INTO public.user_plans (
    user_id, plan_type, posts_limit, ai_requests_limit, social_accounts_limit,
    expires_at, is_active, started_at
  ) VALUES (
    target_user_id, new_plan_type, new_posts_limit, new_ai_requests_limit,
    new_social_accounts_limit, expires_at_param, true, now()
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

  INSERT INTO public.admin_action_logs (admin_user_id, target_user_id, action_type, action_details)
  VALUES (auth.uid(), target_user_id, 'plan_update', jsonb_build_object(
    'plan_type', new_plan_type,
    'posts_limit', new_posts_limit,
    'ai_requests_limit', new_ai_requests_limit,
    'social_accounts_limit', new_social_accounts_limit
  ));
END;
$$;

CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_type_param text,
  target_user_id_param uuid DEFAULT NULL,
  action_details_param jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.admin_action_logs (
    admin_user_id, target_user_id, action_type, action_details
  ) VALUES (
    auth.uid(), target_user_id_param, action_type_param, action_details_param
  );
END;
$$;

-- =====================================================================
-- Views
-- =====================================================================
DROP VIEW IF EXISTS public.users_with_roles;
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
-- Admin inicial: marcondesjr.ti@gmail.com
-- =====================================================================
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'marcondesjr.ti@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_plans (user_id, plan_type, posts_limit, ai_requests_limit, social_accounts_limit)
SELECT id, 'enterprise', 999999, 999999, 999999
FROM auth.users
WHERE email = 'marcondesjr.ti@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
  plan_type = 'enterprise',
  posts_limit = 999999,
  ai_requests_limit = 999999,
  social_accounts_limit = 999999,
  updated_at = now();