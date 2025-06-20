
import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/register">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Registro
            </Button>
          </Link>
          
          <div className="text-center">
            <div className="bg-gradient-ai p-3 rounded-lg inline-block mb-4">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Termos e Condições
            </h1>
            <p className="text-gray-600">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Termos de Uso da Agência Generativa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 prose max-w-none">
            <section>
              <h3 className="text-lg font-semibold mb-3">1. Aceite dos Termos</h3>
              <p className="text-gray-700">
                Ao usar a plataforma Agência Generativa, você concorda com estes termos e condições. 
                Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">2. Descrição do Serviço</h3>
              <p className="text-gray-700">
                A Agência Generativa é uma plataforma SaaS que oferece ferramentas de automação de 
                marketing com inteligência artificial, permitindo criação e agendamento de conteúdo 
                para redes sociais.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">3. Período de Teste Gratuito</h3>
              <p className="text-gray-700">
                Oferecemos um período de teste gratuito de 7 dias para novos usuários. Após este 
                período, será necessário assinar um plano pago para continuar usando os serviços.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">4. Responsabilidades do Usuário</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Fornecer informações precisas e atualizadas</li>
                <li>Manter a confidencialidade de suas credenciais de acesso</li>
                <li>Usar o serviço de acordo com as leis aplicáveis</li>
                <li>Não compartilhar conteúdo ofensivo ou ilegal</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">5. Propriedade Intelectual</h3>
              <p className="text-gray-700">
                O conteúdo gerado pela IA pertence ao usuário, mas a plataforma e suas funcionalidades 
                são propriedade da Agência Generativa. É proibida a reprodução não autorizada.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">6. Limitação de Responsabilidade</h3>
              <p className="text-gray-700">
                A Agência Generativa não se responsabiliza por danos indiretos, lucros cessantes ou 
                outros prejuízos decorrentes do uso da plataforma.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">7. Cancelamento</h3>
              <p className="text-gray-700">
                Você pode cancelar sua assinatura a qualquer momento. O acesso permanecerá ativo 
                até o final do período pago.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">8. Contato</h3>
              <p className="text-gray-700">
                Para questões sobre estes termos, entre em contato conosco pelo WhatsApp 
                (85) 98503-5473 ou através das redes sociais.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
