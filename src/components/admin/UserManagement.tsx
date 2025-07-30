import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserCheck, UserX, Download, Filter, Crown, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  raw_user_meta_data: any;
  roles: string[];
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm, statusFilter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users_with_roles')
        .select('*');
      
      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }

      // Apply search filter
      const filteredUsers = data.filter(user => {
        const userData = user.raw_user_meta_data as any;
        return user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               (userData?.name && String(userData.name).toLowerCase().includes(searchTerm.toLowerCase()));
      });

      return filteredUsers;
    },
  });

  // Mutation to change user role
  const changeRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string, newRole: 'admin' | 'user' }) => {
      const { error } = await supabase.rpc('admin_set_user_role', {
        target_user_id: userId,
        new_role: newRole
      });

      if (error) throw error;

      // Log the action
      await supabase.rpc('log_admin_action', {
        action_type_param: 'role_change',
        target_user_id_param: userId,
        action_details_param: { new_role: newRole }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Role alterada",
        description: "A role do usuário foi alterada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao alterar role do usuário. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  // Mutation to update user plan
  const updatePlanMutation = useMutation({
    mutationFn: async ({ 
      userId, 
      planType, 
      postsLimit, 
      aiRequestsLimit, 
      socialAccountsLimit 
    }: { 
      userId: string, 
      planType: string,
      postsLimit: number,
      aiRequestsLimit: number,
      socialAccountsLimit: number
    }) => {
      const { error } = await supabase.rpc('admin_update_user_plan', {
        target_user_id: userId,
        new_plan_type: planType,
        new_posts_limit: postsLimit,
        new_ai_requests_limit: aiRequestsLimit,
        new_social_accounts_limit: socialAccountsLimit
      });

      if (error) throw error;

      // Log the action
      await supabase.rpc('log_admin_action', {
        action_type_param: 'plan_update',
        target_user_id_param: userId,
        action_details_param: { new_plan: planType }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Plano atualizado",
        description: "O plano do usuário foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar plano do usuário. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const exportUsers = () => {
    if (!users) return;
    
    const csvContent = [
      ['Email', 'Nome', 'Roles', 'Data de Criação', 'Último Login'].join(','),
      ...users.map(user => [
        user.email,
        (user.raw_user_meta_data as any)?.name || '',
        user.roles.join(';'),
        new Date(user.created_at).toLocaleDateString('pt-BR'),
        user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR') : 'Nunca'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRoleChange = (userId: string, currentRoles: string[]) => {
    const isCurrentlyAdmin = currentRoles.includes('admin');
    const newRole = isCurrentlyAdmin ? 'user' : 'admin';
    changeRoleMutation.mutate({ userId, newRole });
  };

  const handlePlanUpgrade = (userId: string, planType: 'free' | 'pro' | 'enterprise') => {
    const planLimits = {
      free: { posts: 10, aiRequests: 50, socialAccounts: 2 },
      pro: { posts: 100, aiRequests: 500, socialAccounts: 5 },
      enterprise: { posts: 999999, aiRequests: 999999, socialAccounts: 999999 }
    };

    const limits = planLimits[planType];
    updatePlanMutation.mutate({
      userId,
      planType,
      postsLimit: limits.posts,
      aiRequestsLimit: limits.aiRequests,
      socialAccountsLimit: limits.socialAccounts
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h2>
          <p className="text-muted-foreground">Gerencie todos os usuários da plataforma</p>
        </div>
        <Button onClick={exportUsers} className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Exportar CSV</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre e pesquise usuários</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por email ou nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="user">Usuários</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuários ({users?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{(user.raw_user_meta_data as any)?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {user.roles.map((role) => (
                        <Badge 
                          key={role}
                          variant={role === 'admin' ? 'default' : 'secondary'}
                          className={role === 'admin' ? 'bg-orange-500' : ''}
                        >
                          {role === 'admin' && <Crown className="w-3 h-3 mr-1" />}
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {user.last_sign_in_at 
                      ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR')
                      : 'Nunca'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRoleChange(user.id, user.roles)}
                        disabled={changeRoleMutation.isPending}
                      >
                        {user.roles.includes('admin') ? (
                          <>
                            <UserX className="h-4 w-4 mr-1" />
                            Remover Admin
                          </>
                        ) : (
                          <>
                            <Crown className="h-4 w-4 mr-1" />
                            Tornar Admin
                          </>
                        )}
                      </Button>
                      
                      <Select onValueChange={(value) => handlePlanUpgrade(user.id, value as any)}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Plano" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;