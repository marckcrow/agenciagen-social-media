import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Instagram,
  Youtube,
  Sparkles,
  Wand2,
  ImageIcon,
  Copy,
} from "lucide-react";

type Platform = "instagram" | "youtube";

interface Post {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string | null;
  platform: string;
  status: string | null;
  created_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [isGenerating, setIsGenerating] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("id,title,description,content,image_url,platform,status,created_at")
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      console.error("Erro ao carregar posts:", error);
      toast({
        title: "Erro ao carregar conteúdos",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPosts(data ?? []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleGenerate = async () => {
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Preencha os campos",
        description: "Tema e descrição são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { title, description, platform, userId },
      });

      if (error) throw error;

      // Persiste o post gerado
      if (userId) {
        const { error: insertError } = await supabase.from("posts").insert({
          user_id: userId,
          title,
          description,
          content: data?.content ?? "",
          image_url: data?.image ?? null,
          platform,
          status: "generated",
        });
        if (insertError) console.error("Erro ao salvar post:", insertError);
      }

      toast({
        title: "Conteúdo gerado!",
        description: "Seu novo post foi adicionado à lista.",
      });

      setTitle("");
      setDescription("");
      await loadPosts();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Tente novamente em instantes.";
      console.error("Erro ao gerar conteúdo:", err);
      toast({
        title: "Erro ao gerar conteúdo",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copiado!", description: "Texto copiado para a área de transferência." });
    } catch {
      toast({ title: "Falha ao copiar", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Olá, {user?.name ?? "criador"}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Gere um novo conteúdo ou revise os que você já criou.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário de geração */}
          <section className="lg:col-span-1">
            <Card className="lg:sticky lg:top-8 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-purple-600" />
                  Gerar novo conteúdo
                </CardTitle>
                <CardDescription>
                  Escolha o tema e o tipo. A IA cria texto e imagem.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title">Tema</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Dicas de produtividade"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isGenerating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição / contexto</Label>
                  <Textarea
                    id="description"
                    placeholder="Do que se trata o post? Público, tom, chamada de ação..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isGenerating}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Tabs value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="instagram" className="flex items-center gap-2">
                        <Instagram className="h-4 w-4" /> Instagram
                      </TabsTrigger>
                      <TabsTrigger value="youtube" className="flex items-center gap-2">
                        <Youtube className="h-4 w-4" /> YouTube
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-gradient-ai text-white hover:opacity-90"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Gerar conteúdo
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Lista de conteúdos */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Seus conteúdos</h2>
              <Link to="/generate">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Editor completo
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-40 w-full mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <Card className="p-10 text-center">
                <div className="bg-gray-100 rounded-full p-5 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <ImageIcon className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Nenhum conteúdo ainda</h3>
                <p className="text-gray-600 text-sm">
                  Use o formulário ao lado para gerar seu primeiro post.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => {
                  const isInstagram = post.platform === "instagram";
                  return (
                    <Card key={post.id} className="hover:shadow-xl transition-all overflow-hidden">
                      {post.image_url ? (
                        <div className="aspect-video bg-gray-100">
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                          <ImageIcon className="h-10 w-10 text-purple-300" />
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant={isInstagram ? "default" : "secondary"} className="capitalize">
                            {isInstagram ? (
                              <Instagram className="h-3 w-3 mr-1" />
                            ) : (
                              <Youtube className="h-3 w-3 mr-1" />
                            )}
                            {post.platform}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(post.created_at).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <CardTitle className="text-base line-clamp-2">{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-3 whitespace-pre-line">
                          {post.content || post.description}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(post.content || post.description)}
                          className="w-full"
                        >
                          <Copy className="h-3 w-3 mr-2" />
                          Copiar texto
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
