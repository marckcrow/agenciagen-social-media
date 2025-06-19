
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { Shield, Users, Crown, Zap, Search, Edit, Trash2, Plus, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  usage: {
    postsGenerated: number;
    postsScheduled: number;
    maxPosts: number;
  };
}

const Admin = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    plan: 'free' as 'free' | 'pro' | 'enterprise'
  });

  useEffect(() => {
    // Mock users data
    const mockUsers: AdminUser[] = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com',
        plan: 'free',
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z',
        usage: { postsGenerated: 8, postsScheduled: 3, maxPosts: 10 }
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@email.com',
        plan: 'pro',
        status: 'active',
        createdAt: '2024-01-10T14:30:00Z',
        usage: { postsGenerated: 45, postsScheduled: 12, maxPosts: 100 }
      },
      {
        id: '3',
        name: 'Pedro Costa',
        email: 'pedro@email.com',
        plan: 'enterprise',
        status: 'active',
        createdAt: '2024-01-05T09:15:00Z',
        usage: { postsGenerated: 150, postsScheduled: 25, maxPosts: Infinity }
      },
      {
        id: '4',
        name: 'Ana Oliveira',
        email: 'ana@email.com',
        plan: 'free',
        status: 'inactive',
        createdAt: '2024-01-20T16:45:00Z',
        usage: { postsGenerated: 2, postsScheduled: 1, maxPosts: 10 }
      }
    ];
    setUsers(mockUsers);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = selectedPlan === 'all' || user.plan === selectedPlan;
    return matchesSearch && matchesPlan;
  });

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome e email do usuário.",
        variant: "destructive",
      });
      return;
    }

    const maxPosts = newUser.plan === 'free' ? 10 : newUser.plan === 'pro' ? 100 : Infinity;
    const createdUser: AdminUser = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      plan: newUser.plan,
      status: 'active',
      createdAt: new Date().toISOString(),
      usage: { postsGenerated: 0, postsScheduled: 0, maxPosts }
    };

    setUsers([createdUser, ...users]);
    setNewUser({ name: '', email: '', plan: 'free' });
    setIsCreateUserDialogOpen(false);

    toast({
      title: "Usuário criado!",
      description: `${createdUser.name} foi adicionado com sucesso.`,
    });
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    toast({
      title: "Usuário removido",
      description: "O usuário foi removido do sistema.",
    });
  };

  const handleUpdateUserPlan = (id: string, newPlan: 'free' | 'pro' | 'enterprise') => {
    setUsers(users.map(user => 
      user.id === id 
        ? { 
            ...user, 
            plan: newPlan,
            usage: {
              ...user.usage,
              maxPosts: newPlan === 'free' ? 10 : newPlan === 'pro' ? 100 : Infinity
            }
          }
        : user
    ));
    toast({
      title: "Plano atualizado",
      description: `Plano do usuário atualizado para ${newPlan}.`,
    });
  };

  const getPlanBadge = (plan: AdminUser['plan']) => {
    const variants = {
      free: { variant: 'secondary' as const, text: 'Gratuito', icon: Zap },
      pro: { variant: 'default' as const, text: 'Pro', icon: Crown },
      enterprise: { variant: 'default' as const, text: 'Enterprise', icon: Crown }
    };
    
    const { variant, text, icon: Icon } = variants[plan];
    return (
      <Badge variant={variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{text}</span>
      </Badge>
    );
  };

  const getStatusBadge = (status: AdminUser['status']) => {
    const variants = {
      active: { variant: 'default' as const, text: 'Ativo' },
      inactive: { variant: 'secondary' as const, text: 'Inativo' },
      suspended: { variant: 'destructive' as const, text: 'Suspenso' }
    };
    
    const { variant, text } = variants[status];
    return <Badge variant={variant}>{text}</Badge>;
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const proUsers = users.filter(u => u.plan === 'pro' || u.plan === 'enterprise').length;
  const totalPosts = users.reduce((sum, u) => sum + u.usage.postsGenerated, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
              <Shield className="h-8 w-8 text-orange-500" />
              <span>Painel Administrativo</span>
            </h1>
            <p className="text-gray-600">
              Gerencie usuários, planos e o uso da plataforma
            </p>
          </div>
          
          <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-ai text-white hover:opacity-90 hover-lift animate-fade-in">
                <Plus className="h-4 w-4 mr-2" />
                Criar Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="animate-scale-in">
              <DialogHeader>
                <DialogTitle>Criar Novo Usuário</DialogTitle>
                <DialogDescription>
                  Adicione um novo usuário à plataforma
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Nome completo"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div>
                  <Select value={newUser.plan} onValueChange={(value: 'free' | 'pro' | 'enterprise') => setNewUser({...newUser, plan: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Plano Gratuito</SelectItem>
                      <SelectItem value="pro">Plano Pro</SelectItem>
                      <SelectItem value="enterprise">Plano Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateUserDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateUser} className="bg-gradient-ai text-white">
                  Criar Usuário
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover-lift animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold">{activeUsers}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários Premium</p>
                  <p className="text-2xl font-bold">{proUsers}</p>
                </div>
                <Crown className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Posts Gerados</p>
                  <p className="text-2xl font-bold">{totalPosts}</p>
                </div>
                <Zap className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Management */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Gerenciamento de Usuários</CardTitle>
            <CardDescription>
              Visualize e gerencie todos os usuários da plataforma
            </CardDescription>
            
            <div className="flex space-x-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os planos</SelectItem>
                  <SelectItem value="free">Gratuito</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uso</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPlanBadge(user.plan)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{user.usage.postsGenerated} posts gerados</div>
                        <div className="text-gray-500">
                          {user.usage.postsScheduled} agendados
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={user.plan}
                          onValueChange={(value: 'free' | 'pro' | 'enterprise') => 
                            handleUpdateUserPlan(user.id, value)
                          }
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Gratuito</SelectItem>
                            <SelectItem value="pro">Pro</SelectItem>
                            <SelectItem value="enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
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
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum usuário encontrado</h3>
                <p className="text-gray-600">
                  Ajuste os filtros ou crie um novo usuário
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
