
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import { Instagram, Youtube, Facebook, Link2, CheckCircle, AlertCircle, Unlink, Music2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Platform = 'instagram' | 'youtube' | 'facebook' | 'tiktok';

interface SocialConnection {
  platform: Platform;
  connected: boolean;
  username?: string;
  lastSync?: string;
}

const SocialConnections = () => {
  const { toast } = useToast();
  const [connections, setConnections] = useState<SocialConnection[]>([
    { platform: 'instagram', connected: false },
    { platform: 'youtube', connected: false },
    { platform: 'facebook', connected: false },
    { platform: 'tiktok', connected: false }
  ]);

  const platformConfig: Record<Platform, { name: string; icon: typeof Instagram; color: string; bgColor: string; description: string }> = {
    instagram: {
      name: 'Instagram',
      icon: Instagram,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: 'Publique fotos e stories automaticamente'
    },
    youtube: {
      name: 'YouTube',
      icon: Youtube,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Agende uploads de vídeos e shorts'
    },
    facebook: {
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Publique posts e atualize sua página'
    },
    tiktok: {
      name: 'TikTok',
      icon: Music2,
      color: 'text-gray-900',
      bgColor: 'bg-gray-100',
      description: 'Publique vídeos curtos e alcance a geração Z'
    }
  };


  const handleConnect = (platform: 'instagram' | 'youtube' | 'facebook') => {
    // Simular processo de OAuth
    toast({
      title: "Redirecionando...",
      description: `Conectando com ${platformConfig[platform].name}. Aguarde...`,
    });

    // Simular conexão após 2 segundos
    setTimeout(() => {
      setConnections(prev => prev.map(conn => 
        conn.platform === platform 
          ? { 
              ...conn, 
              connected: true, 
              username: `@usuario_${platform}`,
              lastSync: new Date().toISOString()
            }
          : conn
      ));

      toast({
        title: "Conectado com sucesso!",
        description: `Sua conta do ${platformConfig[platform].name} foi conectada.`,
      });
    }, 2000);
  };

  const handleDisconnect = (platform: 'instagram' | 'youtube' | 'facebook') => {
    setConnections(prev => prev.map(conn => 
      conn.platform === platform 
        ? { ...conn, connected: false, username: undefined, lastSync: undefined }
        : conn
    ));

    toast({
      title: "Desconectado",
      description: `Conta do ${platformConfig[platform].name} foi desconectada.`,
    });
  };

  const connectedCount = connections.filter(conn => conn.connected).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
            <Link2 className="h-8 w-8 text-purple-600" />
            <span>Minhas Redes Sociais</span>
          </h1>
          <p className="text-gray-600">
            Conecte suas redes sociais para publicação automática de conteúdo
          </p>
        </div>

        {/* Status Overview */}
        <Card className="mb-8 hover-lift animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Status das Conexões</h3>
                <p className="text-gray-600">
                  {connectedCount} de {connections.length} redes sociais conectadas
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  {connectedCount}/{connections.length}
                </div>
                <div className="text-sm text-gray-500">conectadas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {connections.map((connection) => {
            const config = platformConfig[connection.platform];
            const Icon = config.icon;

            return (
              <Card key={connection.platform} className="hover-lift animate-fade-in">
                <CardHeader className="text-center">
                  <div className={`${config.bgColor} p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                    <Icon className={`h-8 w-8 ${config.color}`} />
                  </div>
                  <CardTitle className="flex items-center justify-center space-x-2">
                    <span>{config.name}</span>
                    {connection.connected && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </CardTitle>
                  <CardDescription>{config.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="text-center space-y-4">
                  {connection.connected ? (
                    <div className="space-y-3">
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Conectado
                      </Badge>
                      
                      {connection.username && (
                        <p className="text-sm text-gray-600">
                          <strong>Conta:</strong> {connection.username}
                        </p>
                      )}
                      
                      {connection.lastSync && (
                        <p className="text-xs text-gray-500">
                          Última sincronização: {new Date(connection.lastSync).toLocaleString('pt-BR')}
                        </p>
                      )}
                      
                      <Button
                        variant="outline"
                        onClick={() => handleDisconnect(connection.platform)}
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Unlink className="h-4 w-4 mr-2" />
                        Desconectar
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Badge variant="secondary">
                        Não conectado
                      </Badge>
                      
                      <Button
                        onClick={() => handleConnect(connection.platform)}
                        className="w-full bg-gradient-ai text-white hover:opacity-90"
                      >
                        <Link2 className="h-4 w-4 mr-2" />
                        Conectar {config.name}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Instructions */}
        <Alert className="animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Como funciona:</strong> Ao conectar suas redes sociais, você autoriza a Agência Generativa a publicar 
            conteúdo automaticamente em seu nome. Você pode revogar essas permissões a qualquer momento desconectando 
            a conta. Suas credenciais não são armazenadas - utilizamos OAuth2 para máxima segurança.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default SocialConnections;
