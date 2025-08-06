
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, DollarSign, FileText, TrendingUp, Activity, Target } from 'lucide-react';
import { HealthCheck } from './HealthCheck';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface AdminMetrics {
  total_users: number;
  free_users: number;
  pro_users: number;
  enterprise_users: number;
  mrr: number;
  content_generated: number;
  trial_conversions: number;
  churn_rate: number;
}

const AdminDashboard = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_metrics')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data as AdminMetrics;
    },
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['recent-webhook-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webhook_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Usuários Totais',
      value: metrics?.total_users || 0,
      icon: Users,
      description: `${metrics?.free_users || 0} gratuitos, ${metrics?.pro_users || 0} pro, ${metrics?.enterprise_users || 0} enterprise`,
      trend: '+12%'
    },
    {
      title: 'MRR',
      value: `R$ ${(metrics?.mrr || 0).toLocaleString('pt-BR')}`,
      icon: DollarSign,
      description: 'Receita recorrente mensal',
      trend: '+8%'
    },
    {
      title: 'Conteúdo Gerado',
      value: metrics?.content_generated || 0,
      icon: FileText,
      description: 'Posts gerados este mês',
      trend: '+25%'
    },
    {
      title: 'Conversões Trial',
      value: `${metrics?.trial_conversions || 0}%`,
      icon: Target,
      description: 'Taxa de conversão de trial',
      trend: '+3%'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>
        <p className="text-muted-foreground">Dashboard administrativo da plataforma</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
              <div className="flex items-center pt-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-600 ml-1">{metric.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="activity">Atividade Recente</TabsTrigger>
          <TabsTrigger value="insights">Social Insights</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="health-check">Checagem Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Gratuito</span>
                    <span>{metrics?.free_users || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pro</span>
                    <span>{metrics?.pro_users || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Enterprise</span>
                    <span>{metrics?.enterprise_users || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taxa de Churn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.churn_rate || 0}%</div>
                <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Eventos Recentes</CardTitle>
              <CardDescription>Últimos webhooks processados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity?.map((event, index) => (
                  <div key={index} className="flex items-center space-x-4 border-b pb-2">
                    <Activity className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="font-medium">{event.event_type}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(event.created_at).toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      event.status === 'processed' ? 'bg-green-100 text-green-800' : 
                      event.status === 'failed' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Insights</CardTitle>
              <CardDescription>Análise de performance das redes sociais</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Dados de social insights serão implementados aqui</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance da Plataforma</CardTitle>
              <CardDescription>Métricas de performance e uso</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Dados de performance serão implementados aqui</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health-check" className="space-y-4">
          <HealthCheck />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
