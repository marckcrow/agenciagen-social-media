
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Privacy = () => {
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
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Política de Privacidade
            </h1>
            <p className="text-gray-600">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Como Protegemos Seus Dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 prose max-w-none">
            <section>
              <h3 className="text-lg font-semibold mb-3">1. Informações que Coletamos</h3>
              <p className="text-gray-700 mb-3">
                Coletamos as seguintes informações quando você usa nossos serviços:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Dados de cadastro: nome, sobrenome, email, telefone</li>
                <li>Informações profissionais: segmento de atuação, link do Instagram</li>
                <li>Dados de uso: interações com a plataforma, conteúdo gerado</li>
                <li>Informações técnicas: endereço IP, navegador, dispositivo</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">2. Como Usamos Suas Informações</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Personalizar sua experiência na plataforma</li>
                <li>Comunicar atualizações e novidades</li>
                <li>Processar pagamentos e gerenciar assinaturas</li>
                <li>Oferecer suporte técnico</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">3. Compartilhamento de Dados</h3>
              <p className="text-gray-700">
                Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, 
                exceto quando necessário para:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                <li>Processar pagamentos (através de parceiros seguros como Stripe)</li>
                <li>Integrar com redes sociais (com sua autorização)</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">4. Segurança dos Dados</h3>
              <p className="text-gray-700">
                Implementamos medidas de segurança técnicas e administrativas para proteger 
                suas informações, incluindo criptografia, acesso restrito e monitoramento 
                contínuo de nossa infraestrutura.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">5. Seus Direitos</h3>
              <p className="text-gray-700 mb-3">
                Você tem o direito de:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir informações incorretas</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Revogar consentimentos</li>
                <li>Portabilidade de dados</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">6. Cookies e Tecnologias Similares</h3>
              <p className="text-gray-700">
                Usamos cookies para melhorar sua experiência, personalizar conteúdo e 
                analisar o uso da plataforma. Você pode gerenciar suas preferências de 
                cookies nas configurações do navegador.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">7. Retenção de Dados</h3>
              <p className="text-gray-700">
                Mantemos seus dados pelo tempo necessário para fornecer nossos serviços 
                ou conforme exigido por lei. Dados de contas inativas podem ser removidos 
                após 2 anos.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">8. Contato</h3>
              <p className="text-gray-700">
                Para questões sobre privacidade ou exercer seus direitos, entre em contato 
                pelo WhatsApp (85) 98503-5473 ou através de nossas redes sociais.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
