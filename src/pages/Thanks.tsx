
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Heart, Rocket, ArrowRight } from "lucide-react";

const Thanks = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect after 10 seconds
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        <Card className="animate-scale-in shadow-xl overflow-hidden">
          <div className="bg-gradient-ai p-8 text-white">
            <div className="animate-bounce mb-6">
              <Rocket className="h-16 w-16 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold mb-4">
              Parabéns! 🎉
            </h1>
            <p className="text-xl opacity-90">
              Você deu o primeiro passo rumo ao sucesso!
            </p>
          </div>
          
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-purple-600">
                <Heart className="h-5 w-5" />
                <span className="font-medium">Sua jornada começa agora</span>
                <Heart className="h-5 w-5" />
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Em minutos, nossa inteligência artificial vai transformar o marketing da sua empresa. 
                Prepare-se para resultados incríveis!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Conteúdo Inteligente</h3>
                  <p className="text-sm text-gray-600">IA personalizada para seu negócio</p>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Rocket className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Automação Total</h3>
                  <p className="text-sm text-gray-600">Publique sem esforço</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Heart className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Resultados Reais</h3>
                  <p className="text-sm text-gray-600">Mais engajamento e vendas</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-gradient-ai text-white text-lg py-6 hover:opacity-90"
              >
                Começar a Criar Conteúdo
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              
              <p className="text-sm text-gray-500">
                Redirecionamento automático em 10 segundos...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Thanks;
