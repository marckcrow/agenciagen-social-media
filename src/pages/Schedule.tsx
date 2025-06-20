import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navbar from "@/components/Navbar";
import { Calendar, Clock, Instagram, Youtube, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  platform: 'instagram' | 'youtube';
  scheduledDate: string;
  status: 'scheduled' | 'published' | 'failed';
  imageUrl?: string;
  createdAt: string;
}

const Schedule = () => {
  const { user, updateUserUsage, isLoading } = useAuth();
  const { toast } = useToast();
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    platform: 'instagram' as 'instagram' | 'youtube',
    scheduledDate: '',
    scheduledTime: ''
  });
  const [generatePrompt, setGeneratePrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState({ title: '', content: '', imageUrl: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  // Loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  // Safety check - if user is not available, show loading or redirect
  if (!user || !user.usage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Carregando...</h2>
            <p className="text-gray-600">Verificando informações do usuário</p>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // Mock scheduled posts data
    const mockPosts: ScheduledPost[] = [
      {
        id: '1',
        title: 'Marketing Digital 2024',
        content: '🚀 As principais tendências do marketing digital que você precisa conhecer em 2024...',
        platform: 'instagram',
        scheduledDate: '2024-01-20T14:30:00Z',
        status: 'scheduled',
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        title: 'Tutorial IA para Conteúdo',
        content: 'Como usar inteligência artificial para criar conteúdo de qualidade...',
        platform: 'youtube',
        scheduledDate: '2024-01-22T18:00:00Z',
        status: 'scheduled',
        createdAt: '2024-01-16T09:15:00Z'
      },
      {
        id: '3',
        title: 'Produtividade no Trabalho',
        content: '✨ 5 dicas essenciais para aumentar sua produtividade no trabalho remoto',
        platform: 'instagram',
        scheduledDate: '2024-01-18T16:00:00Z',
        status: 'published',
        imageUrl: 'https://images.unsplash.com/photo-1586880244386-8b3e34394d5b?w=300',
        createdAt: '2024-01-14T11:30:00Z'
      }
    ];
    setScheduledPosts(mockPosts);
  }, []);

  const handleGenerateContent = async () => {
    if (!generatePrompt.trim()) {
      toast({
        title: "Tema obrigatório",
        description: "Digite um tema ou objetivo para gerar o conteúdo.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simular geração de conteúdo com IA
    setTimeout(() => {
      const mockContent = {
        title: `Conteúdo sobre: ${generatePrompt}`,
        content: `🚀 Descubra como ${generatePrompt} pode transformar seu negócio! \n\n✨ Principais benefícios:\n• Maior engajamento\n• Resultados comprovados\n• Estratégia personalizada\n\n#marketing #digital #ia #conteudo`,
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400'
      };
      
      setGeneratedContent(mockContent);
      setNewPost({
        ...newPost,
        title: mockContent.title,
        content: mockContent.content
      });
      setIsGenerating(false);
      setIsGenerateDialogOpen(false);
      setIsCreateDialogOpen(true);
      
      toast({
        title: "Conteúdo gerado!",
        description: "Seu conteúdo foi criado com IA. Revise e agende a publicação.",
      });
    }, 3000);
  };

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content || !newPost.scheduledDate || !newPost.scheduledTime) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para agendar o post.",
        variant: "destructive",
      });
      return;
    }

    // Safety check before accessing user.usage
    if (!user || !user.usage) {
      toast({
        title: "Erro de autenticação",
        description: "Faça login novamente para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (user.usage.postsScheduled >= user.usage.maxPosts) {
      toast({
        title: "Limite atingido",
        description: "Você atingiu o limite de posts agendados do seu plano.",
        variant: "destructive",
      });
      return;
    }

    const scheduledDateTime = `${newPost.scheduledDate}T${newPost.scheduledTime}:00Z`;
    const newScheduledPost: ScheduledPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      platform: newPost.platform,
      scheduledDate: scheduledDateTime,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    setScheduledPosts([newScheduledPost, ...scheduledPosts]);
    updateUserUsage({ postsScheduled: user.usage.postsScheduled + 1 });
    
    setNewPost({
      title: '',
      content: '',
      platform: 'instagram',
      scheduledDate: '',
      scheduledTime: ''
    });
    setIsCreateDialogOpen(false);

    toast({
      title: "Post agendado!",
      description: "Seu post foi agendado com sucesso.",
    });
  };

  const handleDeletePost = (id: string) => {
    setScheduledPosts(scheduledPosts.filter(post => post.id !== id));
    if (user && user.usage) {
      updateUserUsage({ postsScheduled: Math.max(0, user.usage.postsScheduled - 1) });
    }
    toast({
      title: "Post removido",
      description: "O post foi removido da agenda.",
    });
  };

  const getStatusBadge = (status: ScheduledPost['status']) => {
    const variants = {
      scheduled: { variant: 'default' as const, text: 'Agendado' },
      published: { variant: 'secondary' as const, text: 'Publicado' },
      failed: { variant: 'destructive' as const, text: 'Falhou' }
    };
    
    const { variant, text } = variants[status];
    return <Badge variant={variant}>{text}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Agendamentos
            </h1>
            <p className="text-gray-600">
              Gere conteúdo com IA e agende suas publicações nas redes sociais
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-ai text-white hover:opacity-90 hover-lift animate-fade-in">
                  <Plus className="h-4 w-4 mr-2" />
                  Gerar com IA
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg animate-scale-in">
                <DialogHeader>
                  <DialogTitle>Gerar Conteúdo com IA</DialogTitle>
                  <DialogDescription>
                    Digite o tema ou objetivo do seu post para nossa IA criar conteúdo personalizado
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prompt">Tema ou objetivo do post</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Ex: Dicas de marketing digital para pequenos negócios"
                      value={generatePrompt}
                      onChange={(e) => setGeneratePrompt(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleGenerateContent} 
                    className="bg-gradient-ai text-white"
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Gerando..." : "Gerar Conteúdo"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="hover-lift animate-fade-in">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Manualmente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg animate-scale-in">
                <DialogHeader>
                  <DialogTitle>Agendar Nova Publicação</DialogTitle>
                  <DialogDescription>
                    Configure os detalhes da sua publicação agendada
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  {generatedContent.imageUrl && (
                    <div className="text-center">
                      <img 
                        src={generatedContent.imageUrl} 
                        alt="Conteúdo gerado"
                        className="w-full h-40 object-cover rounded-lg mb-2"
                      />
                      <Badge variant="secondary">Imagem gerada por IA</Badge>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      placeholder="Título do post"
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="content">Conteúdo</Label>
                    <Textarea
                      id="content"
                      placeholder="Escreva o conteúdo do seu post..."
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="platform">Plataforma</Label>
                    <Select value={newPost.platform} onValueChange={(value: 'instagram' | 'youtube') => setNewPost({...newPost, platform: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">
                          <div className="flex items-center">
                            <Instagram className="h-4 w-4 mr-2" />
                            Instagram
                          </div>
                        </SelectItem>
                        <SelectItem value="youtube">
                          <div className="flex items-center">
                            <Youtube className="h-4 w-4 mr-2" />
                            YouTube
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newPost.scheduledDate}
                        onChange={(e) => setNewPost({...newPost, scheduledDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Horário</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newPost.scheduledTime}
                        onChange={(e) => setNewPost({...newPost, scheduledTime: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreatePost} className="bg-gradient-ai text-white">
                    Agendar Post
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Usage Stats */}
        <Card className="mb-8 hover-lift animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Uso do Plano</h3>
                <p className="text-gray-600">
                  {user.usage.postsScheduled} de {user.usage.maxPosts === Infinity ? '∞' : user.usage.maxPosts} posts agendados
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  {user.usage.maxPosts === Infinity ? '∞' : user.usage.maxPosts - user.usage.postsScheduled}
                </div>
                <div className="text-sm text-gray-500">restantes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Posts Table */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span>Posts Agendados</span>
            </CardTitle>
            <CardDescription>
              Visualize e gerencie todos os seus posts agendados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Plataforma</TableHead>
                  <TableHead>Data Agendada</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduledPosts.map((post) => (
                  <TableRow key={post.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {post.imageUrl && (
                          <img 
                            src={post.imageUrl} 
                            alt={post.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{post.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {post.content}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {post.platform === 'instagram' ? (
                          <Instagram className="h-4 w-4 mr-2 text-pink-600" />
                        ) : (
                          <Youtube className="h-4 w-4 mr-2 text-red-600" />
                        )}
                        {post.platform === 'instagram' ? 'Instagram' : 'YouTube'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{new Date(post.scheduledDate).toLocaleString('pt-BR')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(post.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="hover-lift">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover-lift">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeletePost(post.id)}
                          className="hover-lift text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {scheduledPosts.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum post agendado</h3>
                <p className="text-gray-600 mb-6">
                  Comece agendando seu primeiro post nas redes sociais
                </p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-gradient-ai text-white hover:opacity-90"
                >
                  Agendar Primeiro Post
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Schedule;
