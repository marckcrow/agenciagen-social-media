import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Edit, Eye, Share2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

interface Post {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string;
  platform: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  created_at: string;
  scheduled_at?: string;
  published_at?: string;
}

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts((data || []) as Post[]);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast({
        title: "Erro ao carregar posts",
        description: "Tente novamente em alguns momentos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'scheduled': return 'secondary';
      case 'draft': return 'outline';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado';
      case 'scheduled': return 'Agendado';
      case 'draft': return 'Rascunho';
      case 'failed': return 'Falhou';
      default: return status;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'bg-pink-500';
      case 'facebook': return 'bg-blue-600';
      case 'linkedin': return 'bg-blue-700';
      case 'youtube': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'all') return true;
    return post.status === activeTab;
  });

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copiado!",
      description: "Conteúdo copiado para a área de transferência.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Seus Posts
          </h1>
          <p className="text-gray-600">
            Gerencie todo o conteúdo criado com IA
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Todos ({posts.length})</TabsTrigger>
            <TabsTrigger value="draft">
              Rascunhos ({posts.filter(p => p.status === 'draft').length})
            </TabsTrigger>
            <TabsTrigger value="scheduled">
              Agendados ({posts.filter(p => p.status === 'scheduled').length})
            </TabsTrigger>
            <TabsTrigger value="published">
              Publicados ({posts.filter(p => p.status === 'published').length})
            </TabsTrigger>
            <TabsTrigger value="failed">
              Falharam ({posts.filter(p => p.status === 'failed').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Edit className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum post encontrado
                </h3>
                <p className="text-gray-500">
                  {activeTab === 'all' 
                    ? 'Comece criando seu primeiro post com IA!' 
                    : `Não há posts com status "${getStatusText(activeTab)}".`
                  }
                </p>
                <Button className="mt-4" onClick={() => window.location.href = '/generate'}>
                  Criar Primeiro Post
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <div className="aspect-video bg-gray-100 relative">
                      {post.image_url && (
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-2 left-2">
                        <div className={`w-3 h-3 rounded-full ${getPlatformColor(post.platform)}`}></div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant={getStatusBadgeVariant(post.status)}>
                          {getStatusText(post.status)}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="text-xs line-clamp-1">
                        {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(post.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => copyContent(post.content)}>
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-3 w-3 mr-1" />
                          Agendar
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Posts;