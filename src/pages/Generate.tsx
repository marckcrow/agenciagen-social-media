
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Wand2, Instagram, Youtube, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const Generate = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o título e a descrição.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Call the real OpenAI API through Supabase edge function
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          title,
          description,
          platform,
          userId: (await supabase.auth.getUser()).data.user?.id
        }
      });

      if (error) throw error;

      setGeneratedContent(data.content);
      setGeneratedImage(data.image);
      
      toast({
        title: "Conteúdo gerado com sucesso!",
        description: "Seu conteúdo está pronto para usar.",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Erro ao gerar conteúdo",
        description: "Tente novamente em alguns momentos.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyContent = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copiado!",
      description: "Conteúdo copiado para a área de transferência.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gerar Novo Conteúdo
          </h1>
          <p className="text-gray-600">
            Use IA para criar conteúdo profissional para suas redes sociais
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wand2 className="h-5 w-5 text-purple-600" />
                <span>Configurações</span>
              </CardTitle>
              <CardDescription>
                Configure os parâmetros para gerar seu conteúdo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Conteúdo</Label>
                <Input
                  id="title"
                  placeholder="Ex: Dicas de Marketing Digital para 2024"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva brevemente sobre o que você quer falar..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Plataforma</Label>
                <Tabs value={platform} onValueChange={setPlatform}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="instagram" className="flex items-center space-x-2">
                      <Instagram className="h-4 w-4" />
                      <span>Instagram</span>
                    </TabsTrigger>
                    <TabsTrigger value="youtube" className="flex items-center space-x-2">
                      <Youtube className="h-4 w-4" />
                      <span>YouTube</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <Button 
                onClick={handleGenerate}
                className="w-full bg-gradient-ai text-white hover:opacity-90"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Gerar Conteúdo
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:sticky lg:top-8">
            <CardHeader>
              <CardTitle>Preview do Conteúdo</CardTitle>
              <CardDescription>
                Visualize o conteúdo gerado antes de usar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedContent ? (
                <div className="space-y-4">
                  {generatedImage && (
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={generatedImage} 
                        alt="Imagem gerada"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Textarea
                        value={generatedContent}
                        readOnly
                        className="min-h-[200px] resize-none border-none bg-transparent"
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button onClick={copyContent} variant="outline" className="flex-1">
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar Texto
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Baixar Imagem
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Sparkles className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Configure os parâmetros e clique em "Gerar Conteúdo" para ver o resultado aqui.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Generate;
