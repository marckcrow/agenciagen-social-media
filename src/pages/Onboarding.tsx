
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Building, Users, Mic, MicOff, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OnboardingData {
  businessName: string;
  businessDescription: string;
  targetAudience: string;
  audioDescription: string;
}

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    businessName: "",
    businessDescription: "",
    targetAudience: "",
    audioDescription: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Salvar dados do onboarding no localStorage ou contexto
    localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
    
    toast({
      title: "Onboarding concluído!",
      description: "Suas informações foram salvas. Redirecionando para o dashboard...",
    });
    
    navigate("/thanks");
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Gravação iniciada",
        description: "Descreva seu negócio em detalhes...",
      });
    } else {
      toast({
        title: "Gravação finalizada",
        description: "Sua descrição foi capturada com sucesso!",
      });
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return onboardingData.businessName.trim() !== "";
      case 2:
        return onboardingData.businessDescription.trim() !== "";
      case 3:
        return onboardingData.targetAudience.trim() !== "";
      case 4:
        return true; // Audio é opcional
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="bg-gradient-ai p-3 rounded-lg inline-block mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vamos conhecer seu negócio
          </h1>
          <p className="text-gray-600">
            Essas informações nos ajudarão a personalizar conteúdos incríveis para você
          </p>
        </div>

        <Card className="animate-scale-in shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Etapa {currentStep} de {totalSteps}</CardTitle>
              <span className="text-sm text-gray-500">{Math.round(progress)}% concluído</span>
            </div>
            <Progress value={progress} className="mb-4" />
          </CardHeader>
          
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Building className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                  <h2 className="text-xl font-semibold">Qual o nome do seu negócio?</h2>
                  <p className="text-gray-600">Como sua empresa é conhecida no mercado?</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nome da Empresa</Label>
                  <Input
                    id="businessName"
                    placeholder="Ex: Maria's Boutique, João Consultoria..."
                    value={onboardingData.businessName}
                    onChange={(e) => setOnboardingData({
                      ...onboardingData,
                      businessName: e.target.value
                    })}
                    className="text-center text-lg font-medium"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Building className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                  <h2 className="text-xl font-semibold">Descreva seu negócio</h2>
                  <p className="text-gray-600">O que você faz? Quais produtos ou serviços oferece?</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Descrição do Negócio</Label>
                  <Textarea
                    id="businessDescription"
                    placeholder="Ex: Sou consultora de beleza especializada em maquiagem para noivas. Ofereço cursos online e atendimentos presenciais..."
                    value={onboardingData.businessDescription}
                    onChange={(e) => setOnboardingData({
                      ...onboardingData,
                      businessDescription: e.target.value
                    })}
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Users className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                  <h2 className="text-xl font-semibold">Qual é seu público-alvo?</h2>
                  <p className="text-gray-600">Quem são seus clientes ideais? Idade, interesses, localização...</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Público-Alvo</Label>
                  <Textarea
                    id="targetAudience"
                    placeholder="Ex: Mulheres de 25-35 anos, moradoras de São Paulo, interessadas em beleza e bem-estar, que valorizam qualidade..."
                    value={onboardingData.targetAudience}
                    onChange={(e) => setOnboardingData({
                      ...onboardingData,
                      targetAudience: e.target.value
                    })}
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Mic className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                  <h2 className="text-xl font-semibold">Conte mais sobre seu negócio</h2>
                  <p className="text-gray-600">Grave um áudio ou escreva detalhes extras que a IA deve saber</p>
                </div>
                
                <div className="text-center mb-6">
                  <Button
                    onClick={toggleRecording}
                    className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-ai'} text-white px-8 py-4 text-lg`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="h-5 w-5 mr-2" />
                        Parar Gravação
                      </>
                    ) : (
                      <>
                        <Mic className="h-5 w-5 mr-2" />
                        Gravar Áudio
                      </>
                    )}
                  </Button>
                  {isRecording && (
                    <div className="mt-4">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-pulse bg-red-500 rounded-full h-3 w-3"></div>
                        <span className="text-red-500 font-medium">Gravando...</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center text-gray-500 mb-4">ou</div>

                <div className="space-y-2">
                  <Label htmlFor="audioDescription">Descrição Adicional (opcional)</Label>
                  <Textarea
                    id="audioDescription"
                    placeholder="Ex: Trabalho principalmente com eventos corporativos, meu diferencial é o atendimento personalizado, tenho parceria com fornecedores locais..."
                    value={onboardingData.audioDescription}
                    onChange={(e) => setOnboardingData({
                      ...onboardingData,
                      audioDescription: e.target.value
                    })}
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-gradient-ai text-white"
              >
                {currentStep === totalSteps ? 'Finalizar' : 'Próximo'}
                {currentStep < totalSteps && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
