import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { prompt, platform, userId } = await req.json();
    
    if (!prompt || !platform) {
      throw new Error('Prompt e plataforma são obrigatórios');
    }

    // Create platform-specific system prompts
    const systemPrompts = {
      instagram: `Você é um especialista em marketing digital para Instagram. 
      Crie conteúdo envolvente, visual e otimizado para engajamento no Instagram.
      Use emojis estrategicamente, hashtags relevantes e call-to-actions eficazes.
      O tom deve ser casual, inspirador e adequado ao público brasileiro.
      Mantenha o texto conciso mas impactante.`,
      
      youtube: `Você é um especialista em criação de conteúdo para YouTube.
      Crie títulos chamativos e descrições que otimizem o SEO e engajamento.
      Inclua estrutura clara para o vídeo, call-to-actions para likes, comentários e inscrições.
      O tom deve ser educativo, mas acessível ao público brasileiro.
      Foque em valor e retenção da audiência.`,
      
      facebook: `Você é um especialista em marketing para Facebook.
      Crie posts que gerem conversas e compartilhamentos.
      Use storytelling, perguntas abertas e conteúdo que ressoe com diferentes faixas etárias.
      O tom deve ser amigável, inclusivo e adequado ao público brasileiro.`,
      
      linkedin: `Você é um especialista em marketing profissional para LinkedIn.
      Crie conteúdo que demonstre expertise, gere networking e engajamento profissional.
      Use tom mais formal mas acessível, inclua insights valiosos e call-to-actions profissionais.
      Foque em valor para carreira e negócios do público brasileiro.`
    };

    console.log('Gerando conteúdo para:', platform, 'com prompt:', prompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: systemPrompts[platform as keyof typeof systemPrompts] || systemPrompts.instagram
          },
          { 
            role: 'user', 
            content: `Crie conteúdo sobre: ${prompt}. 
            
            Retorne APENAS um JSON válido no formato:
            {
              "title": "título impactante",
              "content": "conteúdo completo do post",
              "hashtags": ["#tag1", "#tag2", "#tag3"],
              "callToAction": "call to action específico"
            }`
          }
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro na API OpenAI:', error);
      throw new Error(`Erro na API OpenAI: ${error.error?.message || 'Erro desconhecido'}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    console.log('Conteúdo gerado:', generatedText);

    // Try to parse as JSON, fallback to simple format
    let parsedContent;
    try {
      parsedContent = JSON.parse(generatedText);
    } catch (e) {
      // Fallback if AI doesn't return valid JSON
      parsedContent = {
        title: `Conteúdo sobre: ${prompt}`,
        content: generatedText,
        hashtags: [`#${prompt.replace(/\s+/g, '').toLowerCase()}`, '#marketing', '#digital'],
        callToAction: platform === 'youtube' ? 'Se inscreva no canal!' : 'Comenta aí sua opinião!'
      };
    }

    // Update user usage stats if userId provided
    if (userId) {
      try {
        const today = new Date().toISOString().split('T')[0];
        await supabaseClient.rpc('increment_usage_stat', {
          p_user_id: userId,
          p_date: today,
          p_stat: 'ai_requests',
          p_increment: 1
        });
        console.log('Estatísticas de uso atualizadas para o usuário:', userId);
      } catch (error) {
        console.error('Erro ao atualizar estatísticas:', error);
        // Don't fail the main request if stats update fails
      }
    }

    // Generate image suggestion URL (using Unsplash for now)
    const imageKeywords = prompt.split(' ').slice(0, 3).join(',');
    const imageUrl = `https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=800&fit=crop&q=80`;

    return new Response(JSON.stringify({
      ...parsedContent,
      imageUrl,
      metadata: {
        platform,
        createdAt: new Date().toISOString(),
        tokensUsed: data.usage?.total_tokens || 0
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro na função generate-content:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Verifique se a chave da OpenAI está configurada corretamente'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});