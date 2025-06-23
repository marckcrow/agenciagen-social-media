
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const today = new Date().toISOString().split('T')[0]
    
    // Aggregate user metrics
    const { data: userStats } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('role', 'user')

    // Mock data for demonstration - in real implementation, you'd query actual user data
    const totalUsers = 1250
    const freeUsers = 890
    const proUsers = 280
    const enterpriseUsers = 80
    const mrr = (proUsers * 29.90) + (enterpriseUsers * 99.90)
    
    // Get content generation stats from usage_stats
    const { data: contentStats } = await supabaseClient
      .from('usage_stats')
      .select('posts_generated')
      .gte('date', today)

    const contentGenerated = contentStats?.reduce((sum, stat) => sum + (stat.posts_generated || 0), 0) || 0

    // Calculate trial conversions (mock data)
    const trialConversions = 12
    const churnRate = 2.3

    // Insert or update admin metrics
    const { error } = await supabaseClient
      .from('admin_metrics')
      .upsert({
        date: today,
        total_users: totalUsers,
        free_users: freeUsers,
        pro_users: proUsers,
        enterprise_users: enterpriseUsers,
        mrr: mrr,
        content_generated: contentGenerated,
        trial_conversions: trialConversions,
        churn_rate: churnRate,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'date'
      })

    if (error) {
      console.error('Error updating admin metrics:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to update metrics' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Daily metrics aggregated successfully for', today)

    return new Response(
      JSON.stringify({ 
        message: 'Daily metrics aggregated successfully',
        date: today,
        metrics: {
          total_users: totalUsers,
          mrr: mrr,
          content_generated: contentGenerated
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Daily aggregation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
