-- Fix security issues by securing the users_with_roles view and updating functions

-- Drop the existing insecure view
DROP VIEW IF EXISTS public.users_with_roles;

-- Create a secure profiles table for storing user information separately from auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  cpf_cnpj TEXT,
  instagram_link TEXT,
  business_segment TEXT,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create a trigger to auto-create profiles when users sign up
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

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update existing functions to use proper search_path for security
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::app_role);
$$;

-- Update admin functions with proper search_path
CREATE OR REPLACE FUNCTION public.admin_set_user_role(target_user_id uuid, new_role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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
  
  -- Log admin action
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

  -- Log admin action
  INSERT INTO public.admin_action_logs (admin_user_id, target_user_id, action_type, action_details)
  VALUES (auth.uid(), target_user_id, 'plan_update', jsonb_build_object(
    'plan_type', new_plan_type,
    'posts_limit', new_posts_limit,
    'ai_requests_limit', new_ai_requests_limit,
    'social_accounts_limit', new_social_accounts_limit
  ));
END;
$$;

-- Create a secure view for user management that only shows necessary data
CREATE VIEW public.user_management_view AS
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

-- Create RLS policy for the management view
CREATE POLICY "Only admins can view user management data"
ON public.user_management_view
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));