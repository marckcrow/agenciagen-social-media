-- Add missing RLS policies for all tables

-- Policies for user_roles table
CREATE POLICY "Users can view own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles" 
ON public.user_roles 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles" 
ON public.user_roles 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Policies for usage_stats table
CREATE POLICY "Users can view own stats" 
ON public.usage_stats 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all stats" 
ON public.usage_stats 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own stats" 
ON public.usage_stats 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can insert stats" 
ON public.usage_stats 
FOR INSERT 
WITH CHECK (auth.uid() IS NULL OR user_id = auth.uid());

CREATE POLICY "Users can update own stats" 
ON public.usage_stats 
FOR UPDATE 
USING (user_id = auth.uid());

-- Policies for notifications table
CREATE POLICY "Users can view own notifications" 
ON public.notifications 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all notifications" 
ON public.notifications 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own notifications" 
ON public.notifications 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Policies for webhook_events table
CREATE POLICY "Admins can view all webhook events" 
ON public.webhook_events 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert webhook events" 
ON public.webhook_events 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update webhook events" 
ON public.webhook_events 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));