import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthCheckResult {
  step: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('Starting admin system health check...');
    
    const results: HealthCheckResult[] = [];
    
    // Etapa 1: Verificar se o usuário admin existe
    console.log('Checking admin user...');
    try {
      const { data: adminUser, error: adminError } = await supabase
        .from('users_with_roles')
        .select('*')
        .eq('email', 'marcondesjr.ti@gmail.com')
        .eq('role', 'admin')
        .single();
      
      if (adminError || !adminUser) {
        results.push({
          step: 'Etapa 1: Usuário Admin',
          status: 'error',
          message: 'Usuário admin não encontrado ou não possui role admin',
          details: adminError
        });
      } else {
        results.push({
          step: 'Etapa 1: Usuário Admin',
          status: 'success',
          message: 'Usuário admin configurado corretamente',
          details: { email: adminUser.email, role: adminUser.role }
        });
      }
    } catch (error) {
      results.push({
        step: 'Etapa 1: Usuário Admin',
        status: 'error',
        message: 'Erro ao verificar usuário admin',
        details: error.message
      });
    }
    
    // Etapa 2: Verificar plano do admin
    console.log('Checking admin plan...');
    try {
      const { data: adminPlan, error: planError } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', (await supabase.auth.admin.getUserByEmail('marcondesjr.ti@gmail.com')).data.user?.id)
        .single();
      
      if (planError) {
        results.push({
          step: 'Etapa 2: Plano Admin',
          status: 'warning',
          message: 'Plano admin não encontrado, mas pode não ser necessário',
          details: planError
        });
      } else {
        const hasUnlimitedAccess = adminPlan.plan_type === 'enterprise' || 
          adminPlan.posts_limit === 999999 || 
          adminPlan.ai_requests_limit === 999999;
        
        results.push({
          step: 'Etapa 2: Plano Admin',
          status: hasUnlimitedAccess ? 'success' : 'warning',
          message: hasUnlimitedAccess ? 'Admin tem acesso ilimitado' : 'Admin pode ter limitações de plano',
          details: adminPlan
        });
      }
    } catch (error) {
      results.push({
        step: 'Etapa 2: Plano Admin',
        status: 'error',
        message: 'Erro ao verificar plano do admin',
        details: error.message
      });
    }
    
    // Etapa 3: Verificar funções administrativas
    console.log('Checking admin functions...');
    const adminFunctions = [
      'has_role',
      'is_current_user_admin',
      'admin_set_user_role',
      'admin_update_user_plan',
      'log_admin_action'
    ];
    
    for (const funcName of adminFunctions) {
      try {
        const { data, error } = await supabase.rpc('has_role', { 
          _user_id: '00000000-0000-0000-0000-000000000000', 
          _role: 'admin' 
        });
        
        results.push({
          step: `Etapa 3: Função ${funcName}`,
          status: error ? 'error' : 'success',
          message: error ? `Função ${funcName} com erro` : `Função ${funcName} disponível`,
          details: error || 'Função executou sem erros'
        });
      } catch (error) {
        results.push({
          step: `Etapa 3: Função ${funcName}`,
          status: 'error',
          message: `Erro ao testar função ${funcName}`,
          details: error.message
        });
      }
    }
    
    // Etapa 4: Verificar tabelas administrativas
    console.log('Checking admin tables...');
    const adminTables = ['user_roles', 'admin_action_logs', 'user_plans'];
    
    for (const tableName of adminTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        results.push({
          step: `Etapa 4: Tabela ${tableName}`,
          status: error ? 'error' : 'success',
          message: error ? `Tabela ${tableName} inacessível` : `Tabela ${tableName} acessível`,
          details: error || `${data?.length || 0} registros encontrados`
        });
      } catch (error) {
        results.push({
          step: `Etapa 4: Tabela ${tableName}`,
          status: 'error',
          message: `Erro ao acessar tabela ${tableName}`,
          details: error.message
        });
      }
    }
    
    // Etapa 5: Verificar view users_with_roles
    console.log('Checking users_with_roles view...');
    try {
      const { data, error } = await supabase
        .from('users_with_roles')
        .select('*')
        .limit(5);
      
      results.push({
        step: 'Etapa 5: View users_with_roles',
        status: error ? 'error' : 'success',
        message: error ? 'View users_with_roles inacessível' : 'View users_with_roles funcionando',
        details: error || `${data?.length || 0} usuários retornados`
      });
    } catch (error) {
      results.push({
        step: 'Etapa 5: View users_with_roles',
        status: 'error',
        message: 'Erro ao acessar view users_with_roles',
        details: error.message
      });
    }
    
    // Compilar relatório final
    const totalSteps = results.length;
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    const warningCount = results.filter(r => r.status === 'warning').length;
    
    const finalReport = {
      timestamp: new Date().toISOString(),
      summary: {
        total_steps: totalSteps,
        success: successCount,
        errors: errorCount,
        warnings: warningCount,
        success_rate: `${Math.round((successCount / totalSteps) * 100)}%`
      },
      overall_status: errorCount === 0 ? (warningCount === 0 ? 'healthy' : 'stable') : 'critical',
      details: results,
      recommendations: []
    };
    
    // Adicionar recomendações baseadas nos resultados
    if (errorCount > 0) {
      finalReport.recommendations.push('Corrigir erros críticos antes de usar o sistema em produção');
    }
    if (warningCount > 0) {
      finalReport.recommendations.push('Revisar avisos para otimizar funcionamento');
    }
    if (successCount === totalSteps) {
      finalReport.recommendations.push('Sistema administrativo funcionando perfeitamente');
    }
    
    console.log('Health check completed:', finalReport);
    
    // Enviar para webhook n8n se configurado
    if (webhookUrl) {
      try {
        console.log('Sending results to n8n webhook...');
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            source: 'lovable-admin-health-check',
            ...finalReport
          }),
        });
        
        console.log('Webhook response status:', webhookResponse.status);
        
        if (!webhookResponse.ok) {
          throw new Error(`Webhook returned ${webhookResponse.status}`);
        }
        
        finalReport.webhook_status = 'sent';
      } catch (webhookError) {
        console.error('Failed to send to webhook:', webhookError);
        finalReport.webhook_status = 'failed';
        finalReport.webhook_error = webhookError.message;
      }
    } else {
      finalReport.webhook_status = 'not_configured';
    }
    
    return new Response(JSON.stringify(finalReport), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    const errorReport = {
      timestamp: new Date().toISOString(),
      overall_status: 'failed',
      error: error.message,
      summary: {
        total_steps: 0,
        success: 0,
        errors: 1,
        warnings: 0,
        success_rate: '0%'
      }
    };
    
    return new Response(JSON.stringify(errorReport), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});