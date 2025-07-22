-- Create function to increment usage stats
CREATE OR REPLACE FUNCTION public.increment_usage_stat(
  p_user_id UUID,
  p_date DATE,
  p_stat TEXT,
  p_increment INTEGER DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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