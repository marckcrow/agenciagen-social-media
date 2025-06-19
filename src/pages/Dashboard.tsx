
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Instagram, 
  Youtube, 
  Calendar, 
  TrendingUp, 
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Crown,
  Zap
} from "lucide-react";

interface GeneratedContent {
  id: string;
  type: 'instagram' | 'youtube';
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

const Dashboard = () => {
  const { user } = useAuth();
  const [contents, setContents] = useState<GeneratedContent[]>([]);

  useEffect(() => {
    // Mock data - em produção, buscar do backend
    const mockContents: GeneratedContent[] = [
      {
        id: '1',
        type: 'instagram',
        title: 'Marketing Digital em 2024',
        content: 'As principais tendências do marketing digital que você precisa conhecer...',
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
        createdAt: '2024-01-15T10:30:00Z',
        stats: { views: 1250, likes: 89, comments: 12, shares: 15 }
      },
      {
        id: '2',
        type: 'youtube',
        title: 'Como Usar IA para Criar Conteúdo',
        content: 'Tutorial completo sobre ferramentas de IA para criadores de conteúdo...',
        imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
        createdAt: '2024-01-14T15:45:00Z',
        stats: { views: 3420, likes: 156, comments: 28, shares: 45 }
      },
      {
        id: '3',
        type: 'instagram',
        title: 'Dicas de Produtividade',
        content: '5 dicas essenciais para ser mais produtivo no trabalho remoto...',
        imageUrl: 'https://images.unsplash.com/photo-1586880244386-8b3e34394d5b?w=400',
        createdAt: '2024-01-13T09:15:00Z',
        stats: { views: 890, likes: 67, comments: 8, shares: 11 }
      }
    ];
    setContents(mockContents);
  }, []);

  const totalStats = contents.reduce((acc, content) => ({
    views: acc.views + content.stats.views,
    likes: acc.likes + content.stats.likes,
    comments: acc.comments + content.stats.comments,
    shares: acc.shares + content.stats.shares
  }), { views: 0, likes: 0, comments: 0, shares: 0 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Olá, {user?.name}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Aqui está o resumo do seu conteúdo gerado
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={user?.plan === 'free' ? 'secondary' : 'default'} className="text-sm">
                {user?.plan === 'free' ? (
                  <>
                    <Zap className="h-3 w-3 mr-1" />
                    Plano Gratuito
                  </>
                ) : (
                  <>
                    <Crown className="h-3 w-3 mr-1" />
                    Plano Pro
                  </>
                )}
              </Badge>
              <Link to="/generate">
                <Button className="bg-gradient-ai text-white hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  Gerar Conteúdo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Visualizações</p>
                  <p className="text-2xl font-bold">{totalStats.views.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Curtidas</p>
                  <p className="text-2xl font-bold">{totalStats.likes.toLocaleString()}</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Comentários</p>
                  <p className="text-2xl font-bold">{totalStats.comments.toLocaleString()}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compartilhamentos</p>
                  <p className="text-2xl font-bold">{totalStats.shares.toLocaleString()}</p>
                </div>
                <Share2 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade Card - Only for free users */}
        {user?.plan === 'free' && (
          <Card className="mb-8 bg-gradient-ai text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Desbloqueie todo o potencial</h3>
                  <p className="text-purple-100">
                    Gere conteúdo ilimitado, acesse templates premium e muito mais
                  </p>
                </div>
                <Button className="bg-white text-purple-600 hover:bg-gray-100">
                  <Crown className="h-4 w-4 mr-2" />
                  Fazer Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Seus Conteúdos</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Filtrar por data
              </Button>
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Ordenar por performance
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((content) => (
              <Card key={content.id} className="hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={content.type === 'instagram' ? 'default' : 'secondary'}>
                      {content.type === 'instagram' ? (
                        <Instagram className="h-3 w-3 mr-1" />
                      ) : (
                        <Youtube className="h-3 w-3 mr-1" />
                      )}
                      {content.type === 'instagram' ? 'Instagram' : 'YouTube'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(content.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{content.title}</CardTitle>
                </CardHeader>
                
                {content.imageUrl && (
                  <div className="px-6 pb-3">
                    <img 
                      src={content.imageUrl} 
                      alt={content.title}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <CardContent>
                  <CardDescription className="mb-4 line-clamp-2">
                    {content.content}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {content.stats.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {content.stats.likes}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Ver detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {contents.length === 0 && (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <Plus className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Nenhum conteúdo ainda</h3>
                <p className="text-gray-600 mb-6">
                  Comece gerando seu primeiro conteúdo com inteligência artificial
                </p>
                <Link to="/generate">
                  <Button className="bg-gradient-ai text-white hover:opacity-90">
                    Gerar Primeiro Conteúdo
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
