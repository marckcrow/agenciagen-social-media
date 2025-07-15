-- Create admin_metrics table for storing aggregated metrics
CREATE TABLE public.admin_metrics (
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

-- Create usage_stats table for user activity tracking
CREATE TABLE public.usage_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  posts_generated INTEGER DEFAULT 0,
  posts_scheduled INTEGER DEFAULT 0,
  ai_requests INTEGER DEFAULT 0,
  social_accounts_connected INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create notifications table for system notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create webhook_events table for event tracking
CREATE TABLE public.webhook_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES auth.users,
  data JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for admin access control
CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'service');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.admin_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for admin_metrics (admin only)
CREATE POLICY "Admins can view all admin metrics" ON public.admin_metrics
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert admin metrics" ON public.admin_metrics
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update admin metrics" ON public.admin_metrics
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for usage_stats
CREATE POLICY "Users can view their own usage stats" ON public.usage_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all usage stats" ON public.usage_stats
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service can insert usage stats" ON public.usage_stats
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'service') OR auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all notifications" ON public.notifications
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'service'));

-- RLS Policies for webhook_events
CREATE POLICY "Admins can view all webhook events" ON public.webhook_events
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service can manage webhook events" ON public.webhook_events
  FOR ALL USING (public.has_role(auth.uid(), 'service'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_admin_metrics_date ON public.admin_metrics(date);
CREATE INDEX idx_usage_stats_user_date ON public.usage_stats(user_id, date);
CREATE INDEX idx_notifications_user_read ON public.notifications(user_id, read);
CREATE INDEX idx_webhook_events_type_status ON public.webhook_events(event_type, status);
CREATE INDEX idx_user_roles_user_role ON public.user_roles(user_id, role);