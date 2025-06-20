
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, User, CreditCard, Bell, Shield, Link2, Crown, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import ProfileImageUpload from "@/components/ProfileImageUpload";

const Settings = () => {
  const { user, logout, updateUser } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    cpfCnpj: user?.cpfCnpj || "",
    instagramLink: user?.instagramLink || "",
    businessSegment: user?.businessSegment || ""
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const handleUpgradePlan = (plan: 'pro' | 'enterprise') => {
    // Simular upgrade de plano
    updateUser({ plan });
    toast({
      title: "Plano atualizado!",
      description: `Seu plano foi alterado para ${plan === 'pro' ? 'Pro' : 'Enterprise'} com sucesso.`,
    });
  };

  const handleImageUpdate = (imageUrl: string) => {
    updateUser({ profileImage: imageUrl });
  };

  const businessSegments = [
    "E-commerce",
    "Saúde e Bem-estar",
    "Educação",
    "Tecnologia",
    "Alimentação",
    "Moda e Beleza",
    "Imobiliário",
    "Serviços Financeiros",
    "Turismo e Hospitalidade",
    "Outro"
  ];

  // Mock social connections data
  const socialConnections = [
    { platform: 'Instagram', username: '@meuinstagram', connected: true, status: 'Conectado' },
    { platform: 'YouTube', username: 'Meu Canal', connected: false, status: 'Desconectado' },
    { platform: 'Facebook', username: '', connected: false, status: 'Desconectado' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
          <p className="text-gray-600">Gerencie sua conta e preferências</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Assinatura</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center space-x-2">
              <Link2 className="h-4 w-4" />
              <span className="hidden sm:inline">Redes Sociais</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Segurança</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais e foto de perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <ProfileImageUpload
                    currentImage={user?.profileImage}
                    userName={user?.name || "Usuário"}
                    onImageUpdate={handleImageUpdate}
                  />
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        placeholder="(11) 99999-9999"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cpfCnpj">CPF ou CNPJ *</Label>
                      <Input
                        id="cpfCnpj"
                        placeholder="000.000.000-00"
                        value={formData.cpfCnpj}
                        onChange={(e) => setFormData({...formData, cpfCnpj: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagramLink">Link do Instagram</Label>
                    <Input
                      id="instagramLink"
                      placeholder="https://instagram.com/seu_perfil"
                      value={formData.instagramLink}
                      onChange={(e) => setFormData({...formData, instagramLink: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessSegment">Segmento de Atuação</Label>
                    <Select value={formData.businessSegment} onValueChange={(value) => setFormData({...formData, businessSegment: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione seu segmento" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessSegments.map((segment) => (
                          <SelectItem key={segment} value={segment}>
                            {segment}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <Button type="submit" className="bg-gradient-ai text-white">
                      Salvar Alterações
                    </Button>
                    <Button variant="outline" onClick={logout}>
                      Sair da Conta
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Plano Atual</CardTitle>
                <CardDescription>
                  Gerencie sua assinatura e upgrade seu plano
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center space-x-2">
                      {user?.plan === 'free' && <Zap className="h-5 w-5 text-gray-500" />}
                      {user?.plan === 'pro' && <Crown className="h-5 w-5 text-purple-600" />}
                      {user?.plan === 'enterprise' && <Crown className="h-5 w-5 text-blue-600" />}
                      <span>
                        {user?.plan === 'free' ? 'Plano Gratuito' : 
                         user?.plan === 'pro' ? 'Plano Pro' : 'Plano Enterprise'}
                      </span>
                    </h3>
                    <p className="text-gray-600">
                      {user?.plan === 'free' ? '5 gerações por mês' :
                       user?.plan === 'pro' ? '100 gerações por mês' : 'Gerações ilimitadas'}
                    </p>
                  </div>
                  <Badge variant={user?.plan === 'free' ? 'secondary' : 'default'}>Atual</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Plano Pro</CardTitle>
                      <CardDescription>
                        <span className="text-2xl font-bold">R$ 29,90</span>/mês
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• 100 gerações por mês</li>
                        <li>• Imagens em alta resolução</li>
                        <li>• Suporte prioritário</li>
                        <li>• Templates exclusivos</li>
                        <li>• Até 5 redes sociais conectadas</li>
                      </ul>
                      <Button 
                        className="w-full mt-4 bg-gradient-ai text-white"
                        onClick={() => handleUpgradePlan('pro')}
                        disabled={user?.plan !== 'free'}
                      >
                        {user?.plan === 'pro' ? 'Plano Atual' : 'Fazer Upgrade'}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Plano Enterprise</CardTitle>
                      <CardDescription>
                        <span className="text-2xl font-bold">R$ 99,90</span>/mês
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Gerações ilimitadas</li>
                        <li>• API personalizada</li>
                        <li>• Suporte 24/7 via WhatsApp</li>
                        <li>• Múltiplos perfis sociais</li>
                        <li>• Agendamento em massa</li>
                        <li>• Relatórios exportáveis</li>
                        <li>• IA com prioridade</li>
                      </ul>
                      <Button 
                        className="w-full mt-4 bg-gradient-ai text-white"
                        onClick={() => handleUpgradeP lan('enterprise')}
                        disabled={user?.plan === 'enterprise'}
                      >
                        {user?.plan === 'enterprise' ? 'Plano Atual' : 'Fazer Upgrade'}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Redes Sociais Conectadas</CardTitle>
                <CardDescription>
                  Gerencie suas conexões com redes sociais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {socialConnections.map((connection) => (
                    <div key={connection.platform} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-ai rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {connection.platform.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium">{connection.platform}</h4>
                          <p className="text-sm text-gray-600">
                            {connection.connected ? connection.username : 'Não conectado'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={connection.connected ? 'default' : 'secondary'}>
                          {connection.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          {connection.connected ? 'Desconectar' : 'Conectar'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>
                  Mantenha sua conta segura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Alterar Senha
                </Button>
                
                <Button variant="outline" className="w-full">
                  Ativar Autenticação 2FA
                </Button>
                
                <Button variant="destructive" className="w-full">
                  Excluir Conta
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
