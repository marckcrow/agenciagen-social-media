
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import FormHeader from "./FormHeader";
import PersonalInfoSection from "./PersonalInfoSection";
import ContactInfoSection from "./ContactInfoSection";
import BusinessInfoSection from "./BusinessInfoSection";
import PasswordSection from "./PasswordSection";
import TermsSection from "./TermsSection";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    instagramLink: "",
    businessSegment: ""
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      toast({
        title: "Erro",
        description: "Você deve aceitar os Termos e Condições para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      await register(formData.email, formData.password, fullName, {
        phone: formData.phone,
        instagramLink: formData.instagramLink,
        businessSegment: formData.businessSegment
      });
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Redirecionando para o onboarding...",
      });
      navigate("/onboarding");
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: "Tente novamente ou entre em contato conosco.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <FormHeader />

      <Card className="animate-scale-in shadow-xl">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <PersonalInfoSection
              firstName={formData.firstName}
              lastName={formData.lastName}
              email={formData.email}
              onFirstNameChange={(value) => setFormData({...formData, firstName: value})}
              onLastNameChange={(value) => setFormData({...formData, lastName: value})}
              onEmailChange={(value) => setFormData({...formData, email: value})}
            />

            <ContactInfoSection
              phone={formData.phone}
              instagramLink={formData.instagramLink}
              onPhoneChange={(value) => setFormData({...formData, phone: value})}
              onInstagramLinkChange={(value) => setFormData({...formData, instagramLink: value})}
            />

            <BusinessInfoSection
              businessSegment={formData.businessSegment}
              onBusinessSegmentChange={(value) => setFormData({...formData, businessSegment: value})}
            />
            
            <PasswordSection
              password={formData.password}
              confirmPassword={formData.confirmPassword}
              onPasswordChange={(value) => setFormData({...formData, password: value})}
              onConfirmPasswordChange={(value) => setFormData({...formData, confirmPassword: value})}
            />

            <TermsSection
              termsAccepted={termsAccepted}
              onTermsAcceptedChange={setTermsAccepted}
            />

            <Button 
              type="submit" 
              className="w-full bg-gradient-ai text-white hover:opacity-90" 
              disabled={isLoading}
            >
              {isLoading ? "Criando conta..." : "Comece grátis por 7 dias"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-purple-600 hover:underline font-medium">
                Fazer login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
