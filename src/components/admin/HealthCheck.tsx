import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Play, CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";

interface HealthCheckResult {
  step: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

interface HealthReport {
  timestamp: string;
  summary: {
    total_steps: number;
    success: number;
    errors: number;
    warnings: number;
    success_rate: string;
  };
  overall_status: 'healthy' | 'stable' | 'critical' | 'failed';
  details: HealthCheckResult[];
  recommendations: string[];
  webhook_status?: 'sent' | 'failed' | 'not_configured';
  webhook_error?: string;
}

export function HealthCheck() {
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<HealthReport | null>(null);
  const { toast } = useToast();

  const runHealthCheck = async () => {
    setIsRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-health-check');
      
      if (error) {
        throw error;
      }
      
      setReport(data);
      
      toast({
        title: "Checagem Concluída",
        description: `Status: ${data.overall_status} - ${data.summary.success_rate} de sucesso`,
        variant: data.overall_status === 'critical' ? 'destructive' : 'default',
      });
      
    } catch (error) {
      console.error('Health check failed:', error);
      toast({
        title: "Erro na Checagem",
        description: "Falha ao executar checagem do sistema",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'healthy': 'default',
      'stable': 'secondary',
      'critical': 'destructive',
      'failed': 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Checagem do Sistema Administrativo
        </CardTitle>
        <CardDescription>
          Verifica todas as funcionalidades administrativas e envia relatório via webhook n8n
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runHealthCheck} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Executando Checagem...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Iniciar Checagem
            </>
          )}
        </Button>

        {report && (
          <div className="space-y-4">
            <Separator />
            
            {/* Resumo */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Status Geral</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(report.timestamp).toLocaleString('pt-BR')}
                </p>
              </div>
              {getStatusBadge(report.overall_status)}
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{report.summary.success}</div>
                <div className="text-xs text-muted-foreground">Sucessos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{report.summary.errors}</div>
                <div className="text-xs text-muted-foreground">Erros</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{report.summary.warnings}</div>
                <div className="text-xs text-muted-foreground">Avisos</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{report.summary.success_rate}</div>
                <div className="text-xs text-muted-foreground">Taxa Sucesso</div>
              </div>
            </div>

            {/* Status do Webhook */}
            {report.webhook_status && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Webhook n8n:</span>
                <Badge variant={report.webhook_status === 'sent' ? 'default' : 'destructive'}>
                  {report.webhook_status}
                </Badge>
                {report.webhook_error && (
                  <span className="text-xs text-red-500">({report.webhook_error})</span>
                )}
              </div>
            )}

            {/* Detalhes das Etapas */}
            <div className="space-y-2">
              <h4 className="font-medium">Detalhes das Verificações:</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {report.details.map((result, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 border rounded">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="font-medium text-sm">{result.step}</div>
                      <div className="text-xs text-muted-foreground">{result.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recomendações */}
            {report.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Recomendações:</h4>
                <ul className="space-y-1">
                  {report.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}