
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const webhookToken = req.headers.get('x-webhook-token')
    
    if (!webhookToken || webhookToken !== Deno.env.get('WEBHOOK_SECRET_TOKEN')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    const { event_type, user_id, data } = body

    // Validate required fields
    if (!event_type || !data) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: event_type, data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Store webhook event
    const { error: webhookError } = await supabaseClient
      .from('webhook_events')
      .insert({
        event_type,
        user_id,
        data,
        status: 'received'
      })

    if (webhookError) {
      console.error('Error storing webhook event:', webhookError)
      return new Response(
        JSON.stringify({ error: 'Failed to store event' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Process different event types
    switch (event_type) {
      case 'user.signup':
        await processUserSignup(supabaseClient, user_id, data)
        break
      case 'plan.upgrade':
        await processPlanUpgrade(supabaseClient, user_id, data)
        break
      case 'content.generated':
        await processContentGenerated(supabaseClient, user_id, data)
        break
      case 'trial.expired':
        await processTrialExpired(supabaseClient, user_id, data)
        break
    }

    return new Response(
      JSON.stringify({ message: 'Event processed successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function processUserSignup(supabase: any, userId: string, data: any) {
  // Create notification for user
  await supabase.from('notifications').insert({
    user_id: userId,
    type: 'welcome',
    title: 'Bem-vindo à Agência Generativa!',
    message: 'Sua conta foi criada com sucesso. Comece a gerar conteúdo agora!',
    data: { signup_date: new Date().toISOString() }
  })

  // Initialize usage stats
  await supabase.from('usage_stats').insert({
    user_id: userId,
    date: new Date().toISOString().split('T')[0],
    posts_generated: 0,
    posts_scheduled: 0,
    ai_requests: 0,
    social_accounts_connected: 0
  })

  console.log('User signup processed:', userId)
}

async function processPlanUpgrade(supabase: any, userId: string, data: any) {
  await supabase.from('notifications').insert({
    user_id: userId,
    type: 'plan_upgrade',
    title: 'Plano Atualizado!',
    message: `Seu plano foi atualizado para ${data.new_plan}. Aproveite os novos recursos!`,
    data: { old_plan: data.old_plan, new_plan: data.new_plan, upgrade_date: new Date().toISOString() }
  })

  console.log('Plan upgrade processed:', userId, data.new_plan)
}

async function processContentGenerated(supabase: any, userId: string, data: any) {
  const today = new Date().toISOString().split('T')[0]
  
  // Update usage stats
  await supabase.rpc('increment_usage_stat', {
    p_user_id: userId,
    p_date: today,
    p_stat: 'posts_generated',
    p_increment: 1
  })

  console.log('Content generation tracked:', userId)
}

async function processTrialExpired(supabase: any, userId: string, data: any) {
  await supabase.from('notifications').insert({
    user_id: userId,
    type: 'trial_expired',
    title: 'Trial Expirado',
    message: 'Seu período de teste expirou. Faça upgrade para continuar usando todos os recursos.',
    data: { expired_date: new Date().toISOString() }
  })

  console.log('Trial expiry processed:', userId)
}
