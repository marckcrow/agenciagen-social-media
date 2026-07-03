-- =====================================================================
-- Schema consolidado AdGen AI para Lovable Cloud
-- FASE 1: Enum + tabelas
-- =====================================================================

-- Criar enum de roles se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'service');
    END IF;
END $$;

-- =====================================================================
-- Tabela: user_roles
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- Tabela: profiles
-- =====================================================================
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

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- Tabela: user_plans
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.user_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  posts_limit INTEGER NOT NULL DEFAULT 10,
  ai_requests_limit INTEGER NOT NULL DEFAULT 50,
  social_accounts_limit INTEGER NOT NULL DEFAULT 2,
  is_active BOOLEAN DEFAULT true,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

GRANT SELECT, INSERT, UPDATE ON public.user_plans TO authenticated;
GRANT ALL ON public.user_plans TO service_role;
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- Tabela: posts
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  platform TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed', 'ready', 'processing')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  webhook_sent BOOLEAN DEFAULT FALSE,
  webhook_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- Tabela: social_accounts
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.social_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  platform TEXT NOT NULL,
  platform_user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, platform, platform_user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_accounts TO authenticated;
GRANT ALL ON public.social_accounts TO service_role;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- Tabela: social_metrics
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.social_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  platform_post_id TEXT,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  collected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.social_metrics TO authenticated;
GRANT ALL ON public.social_metrics TO service_role;
ALTER TABLE public.social_metrics ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- Tabela: usage_stats
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.usage_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  posts_generated INTEGER DEFAULT 0,
  posts_scheduled INTEGER DEFAULT 0,
  ai_requests INTEGER DEFAULT 0,
  social_accounts_connected INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

GRANT SELECT, INSERT, UPDATE ON public.usage_stats TO authenticated;
GRANT ALL ON public.usage_stats TO service_role;
ALTER TABLE public.usage_stats ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- Tabela: admin_metrics
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.admin_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  total_users INTEGER DEFAULT 0,
  free_users INTEGER DEFAULT 0,
  pro_users INTEGER DEFAULT 0,
  enterprise_users INTEGER DEFAULT 0,
  mrr DECIMAL(10,2) DEFAULT 0,
  content_generated INTEGER DEFAULT 0,
  trial_conversions INTEGER DEFAULT 0,
  churn_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.admin_metrics TO authenticated;
GRANT ALL ON public.admin_metrics TO service_role;
ALTER TABLE public.admin_metrics ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- Tabela: notifications
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- Tabela: webhook_events
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  data JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.webhook_events TO authenticated;
GRANT ALL ON public.webhook_events TO service_role;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- Tabela: admin_settings
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_settings TO authenticated;
GRANT ALL ON public.admin_settings TO service_role;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

INSERT INTO public.admin_settings (key, value, description)
VALUES ('n8n_webhook_url', '', 'URL do webhook do n8n para publicação automática em redes sociais')
ON CONFLICT (key) DO NOTHING;

-- =====================================================================
-- Tabela: admin_action_logs
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.admin_action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL,
  target_user_id UUID,
  action_type TEXT NOT NULL,
  action_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.admin_action_logs TO authenticated;
GRANT ALL ON public.admin_action_logs TO service_role;
ALTER TABLE public.admin_action_logs ENABLE ROW LEVEL SECURITY;
