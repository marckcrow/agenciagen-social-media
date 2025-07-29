import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Webhook, Save, TestTube, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const WebhookSettings = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current webhook URL
  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings', 'n8n_webhook_url'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('key', 'n8n_webhook_url')
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (settings?.value) {
      setWebhookUrl(settings.value);
    }
  }, [settings]);

  // Save webhook URL mutation
  const saveWebhookMutation = useMutation({
    mutationFn: async (url: string) => {
      const { error } = await supabase
        .from('admin_settings')
        .update({ value: url })
        .eq('key', 'n8n_webhook_url');
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Configuração salva",
        description: "URL do webhook n8n foi atualizada com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a configuração do webhook.",
        variant: "destructive",
      });
      console.error('Erro ao salvar webhook:', error);
    },
  });

  const handleSaveWebhook = () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "URL obrigatória",
        description: "Por favor, insira a URL do webhook n8n.",
        variant: "destructive",
      });
      return;
    }

    if (!webhookUrl.startsWith('http://') && !webhookUrl.startsWith('https://')) {
      toast({
        title: "URL inválida",
        description: "A URL deve começar com http:// ou https://",
        variant: "destructive",
      });
      return;
    }

    saveWebhookMutation.mutate(webhookUrl);
  };

  const testWebhook = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "URL obrigatória",
        description: "Por favor, insira a URL do webhook para testar.",
        variant: "destructive",
      });
      return;
    }

    setIsTestingWebhook(true);

    try {
      const testPayload = {
        title: "Teste de Webhook",
        caption: "Este é um teste de conexão com o webhook n8n 🚀",
        image_url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=800&fit=crop&q=80",
        platform: "instagram",
        post_id: "test-id",
        user_id: "test-user",
        hashtags: ["#teste", "#webhook", "#n8n"],
        created_at: new Date().toISOString(),
        test: true
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload),
      });

      if (response.ok) {
        toast({
          title: "Teste bem-sucedido!",
          description: "O webhook n8n está funcionando corretamente.",
        });
      } else {
        throw new Error(`Resposta HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro no teste do webhook:', error);
      toast({
        title: "Teste falhou",
        description: "Não foi possível conectar com o webhook. Verifique a URL e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações de Webhook</h2>
        <p className="text-muted-foreground">Configure a integração com n8n para publicação automática</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Webhook className="h-5 w-5" />
            <span>Webhook n8n</span>
          </CardTitle>
          <CardDescription>
            URL do webhook n8n que receberá os dados dos posts gerados para publicação automática nas redes sociais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL do Webhook</Label>
            <Input
              id="webhook-url"
              placeholder="https://seu-n8n.com/webhook/instagram-publisher"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Cole aqui a URL do webhook criado no seu n8n para receber os dados dos posts
            </p>
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={handleSaveWebhook}
              disabled={saveWebhookMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {saveWebhookMutation.isPending ? 'Salvando...' : 'Salvar Configuração'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={testWebhook}
              disabled={isTestingWebhook || !webhookUrl.trim()}
            >
              <TestTube className="mr-2 h-4 w-4" />
              {isTestingWebhook ? 'Testando...' : 'Testar Webhook'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Formato dos Dados Enviados</CardTitle>
          <CardDescription>
            Estrutura JSON que será enviada para o webhook n8n
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            readOnly
            value={`{
  "title": "Título do post",
  "caption": "Legenda completa com emojis e hashtags",
  "image_url": "https://url-da-imagem-gerada.jpg",
  "platform": "instagram",
  "post_id": "uuid-do-post",
  "user_id": "uuid-do-usuario",
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "created_at": "2024-01-01T00:00:00.000Z"
}`}
            className="font-mono text-sm h-48"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status da Integração</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            {webhookUrl ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Webhook configurado</span>
                <Badge variant="secondary">Ativo</Badge>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-600" />
                <span>Webhook não configurado</span>
                <Badge variant="destructive">Inativo</Badge>
              </>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {webhookUrl 
              ? 'Os posts gerados serão automaticamente enviados para o n8n para publicação.' 
              : 'Configure o webhook para ativar a publicação automática.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookSettings;