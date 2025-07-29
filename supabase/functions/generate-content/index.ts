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

    const { title, description, platform, userId } = await req.json();
    
    if (!title || !description || !platform) {
      throw new Error('Título, descrição e plataforma são obrigatórios');
    }

    console.log('Gerando conteúdo:', { title, description, platform, userId });

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

    // Generate content with GPT
    const contentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { 
            role: 'system', 
            content: systemPrompts[platform as keyof typeof systemPrompts] || systemPrompts.instagram
          },
          { 
            role: 'user', 
            content: `Crie um post sobre "${title}". 
            
            Contexto: ${description}
            
            Retorne APENAS um JSON válido no formato:
            {
              "content": "conteúdo completo do post com emojis e formatação",
              "hashtags": ["#tag1", "#tag2", "#tag3"]
            }`
          }
        ],
        temperature: 0.8,
        max_tokens: 800,
      }),
    });

    if (!contentResponse.ok) {
      const error = await contentResponse.json();
      console.error('Erro na API OpenAI (conteúdo):', error);
      throw new Error(`Erro ao gerar conteúdo: ${error.error?.message || 'Erro desconhecido'}`);
    }

    const contentData = await contentResponse.json();
    let parsedContent;
    
    try {
      parsedContent = JSON.parse(contentData.choices[0].message.content);
    } catch (e) {
      // Fallback if AI doesn't return valid JSON
      parsedContent = {
        content: contentData.choices[0].message.content,
        hashtags: [`#${title.replace(/\s+/g, '').toLowerCase()}`, '#marketing', '#digital']
      };
    }

    // Generate image with DALL-E
    console.log('Gerando imagem com DALL-E...');
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: `Create a professional, eye-catching image for social media about "${title}". ${description}. Modern, colorful, engaging style suitable for ${platform}.`,
        n: 1,
        size: '1024x1024',
        quality: 'high',
        output_format: 'png'
      }),
    });

    let imageUrl = 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=800&fit=crop&q=80';
    
    if (imageResponse.ok) {
      const imageData = await imageResponse.json();
      if (imageData.data && imageData.data[0]) {
        // For gpt-image-1, the response comes as base64
        const base64Image = imageData.data[0].b64_json;
        if (base64Image) {
          imageUrl = `data:image/png;base64,${base64Image}`;
        }
      }
      console.log('Imagem gerada com sucesso');
    } else {
      console.error('Erro ao gerar imagem, usando fallback');
    }

    // Save to posts table
    let postId = null;
    if (userId) {
      try {
        const { data: postData, error: postError } = await supabaseClient
          .from('posts')
          .insert({
            user_id: userId,
            title,
            description,
            content: parsedContent.content,
            image_url: imageUrl,
            platform,
            status: 'ready',
            webhook_sent: false
          })
          .select()
          .single();

        if (postError) {
          console.error('Erro ao salvar post:', postError);
        } else {
          console.log('Post salvo com sucesso:', postData.id);
          postId = postData.id;
        }

        // Update usage stats
        const today = new Date().toISOString().split('T')[0];
        await supabaseClient.rpc('increment_usage_stat', {
          p_user_id: userId,
          p_date: today,
          p_stat: 'ai_requests',
          p_increment: 1
        });
        
        await supabaseClient.rpc('increment_usage_stat', {
          p_user_id: userId,
          p_date: today,
          p_stat: 'posts_generated',
          p_increment: 1
        });

        console.log('Estatísticas atualizadas para usuário:', userId);
      } catch (error) {
        console.error('Erro ao salvar dados:', error);
        // Don't fail the main request
      }
    }

    // Send webhook to n8n for automatic publishing
    try {
      // Get webhook URL from admin settings
      const { data: webhookSetting, error: webhookError } = await supabaseClient
        .from('admin_settings')
        .select('value')
        .eq('key', 'n8n_webhook_url')
        .single();

      if (!webhookError && webhookSetting?.value) {
        const webhookUrl = webhookSetting.value;
        console.log('Disparando webhook para:', webhookUrl);

        const webhookPayload = {
          title,
          caption: parsedContent.content,
          image_url: imageUrl,
          platform,
          post_id: postId,
          user_id: userId,
          hashtags: parsedContent.hashtags,
          created_at: new Date().toISOString()
        };

        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
        });

        if (webhookResponse.ok) {
          console.log('Webhook enviado com sucesso');
          
          // Update post to mark webhook as sent
          if (postId) {
            await supabaseClient
              .from('posts')
              .update({ 
                webhook_sent: true, 
                webhook_sent_at: new Date().toISOString(),
                status: 'processing'
              })
              .eq('id', postId);
          }
        } else {
          console.error('Erro ao enviar webhook:', webhookResponse.status);
        }
      } else {
        console.log('Webhook URL não configurada - pulando envio automático');
      }
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      // Don't fail the main request
    }

    return new Response(JSON.stringify({
      content: parsedContent.content,
      image: imageUrl,
      hashtags: parsedContent.hashtags,
      metadata: {
        platform,
        title,
        description,
        createdAt: new Date().toISOString()
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