-- Create admin_settings table for webhook configuration
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin settings
CREATE POLICY "Only admins can view admin settings" 
ON public.admin_settings 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can create admin settings" 
ON public.admin_settings 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update admin settings" 
ON public.admin_settings 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete admin settings" 
ON public.admin_settings 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default webhook URL setting
INSERT INTO public.admin_settings (key, value, description)
VALUES ('n8n_webhook_url', '', 'URL do webhook do n8n para publicação automática em redes sociais');

-- Add webhook_sent column to posts table
ALTER TABLE public.posts 
ADD COLUMN webhook_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN webhook_sent_at TIMESTAMP WITH TIME ZONE;