import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { Sparkles, Instagram, Youtube, Zap, Clock, TrendingUp, CheckCircle, ArrowRight, Wand2, Image, FileText } from "lucide-react";
const Landing = () => {
  return <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-200">
              ✨ Powered by AI
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-fade-in">
              Conteúdo que
              <br />
              <span className="text-pink-500">Converte</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in">
              Gere automaticamente posts profissionais para Instagram e YouTube usando inteligência artificial. 
              Economize horas e multiplique seu engajamento.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-ai text-white hover:opacity-90 text-lg px-8 py-4">
                  Começar Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                Ver Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Tudo que você precisa para criar</h2>
            <p className="text-xl text-gray-600">Ferramentas poderosas em uma única plataforma</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="bg-gradient-ai p-3 rounded-lg w-fit">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Textos Inteligentes</CardTitle>
                <CardDescription>
                  IA cria captions, hashtags e descrições otimizadas para cada plataforma
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="bg-gradient-social p-3 rounded-lg w-fit">
                  <Image className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Imagens Únicas</CardTitle>
                <CardDescription>
                  Gere imagens personalizadas que combinam perfeitamente com seu conteúdo
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="bg-gradient-to-r from-green-400 to-blue-500 p-3 rounded-lg w-fit">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Multi-Plataforma</CardTitle>
                <CardDescription>
                  Conteúdo otimizado para Instagram, YouTube e outras redes sociais
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Economize tempo,
                <br />
                <span className="text-purple-600">multiplique resultados</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Nossa IA foi treinada especificamente para criar conteúdo que gera engajamento 
                e conversões nas redes sociais.
              </p>
              
              <div className="space-y-4">
                {[{
                icon: Clock,
                text: "90% menos tempo criando conteúdo"
              }, {
                icon: TrendingUp,
                text: "3x mais engajamento médio"
              }, {
                icon: CheckCircle,
                text: "Conteúdo consistente todos os dias"
              }].map((item, index) => <div key={index} className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <item.icon className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-lg">{item.text}</span>
                  </div>)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <CardContent className="p-6">
                  <Instagram className="h-8 w-8 mb-4" />
                  <h3 className="font-bold text-lg mb-2">Instagram</h3>
                  <p className="text-purple-100">Posts, Stories e Reels otimizados</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-pink-500 text-white">
                <CardContent className="p-6">
                  <Youtube className="h-8 w-8 mb-4" />
                  <h3 className="font-bold text-lg mb-2">YouTube</h3>
                  <p className="text-red-100">Títulos e thumbnails que convertem</p>
                </CardContent>
              </Card>

              <Card className="col-span-2 bg-gradient-ai text-white">
                <CardContent className="p-6">
                  <Wand2 className="h-8 w-8 mb-4" />
                  <h3 className="font-bold text-lg mb-2">IA Personalizada</h3>
                  <p className="text-purple-100">Aprende com sua marca e audiência para resultados únicos</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-ai text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para revolucionar seu conteúdo?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Junte-se a milhares de criadores que já estão usando IA para crescer nas redes sociais
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4">
              Começar Agora - É Grátis
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="bg-gradient-ai p-2 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">Agencia Generativa</span>
          </div>
          <p className="text-center text-gray-400">© 2025 Agencia Generativa. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>;
};
export default Landing;