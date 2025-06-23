
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserCheck, UserX, Download, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  user_metadata: any;
  role?: string;
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm, statusFilter],
    queryFn: async () => {
      // Note: In a real implementation, you'd fetch user data from a custom users table
      // since auth.users is not directly accessible. For now, we'll simulate the data
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'user1@example.com',
          created_at: '2024-01-15T10:00:00Z',
          last_sign_in_at: '2024-01-20T15:30:00Z',
          user_metadata: { name: 'João Silva', plan: 'pro' },
          role: 'user'
        },
        {
          id: '2',
          email: 'user2@example.com',
          created_at: '2024-01-10T09:00:00Z',
          last_sign_in_at: '2024-01-19T14:20:00Z',
          user_metadata: { name: 'Maria Santos', plan: 'free' },
          role: 'user'
        }
      ];
      
      return mockUsers.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_metadata.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
  });

  const blockUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      // In a real implementation, you'd call a function to block/unblock users
      console.log('Blocking user:', userId);
      throw new Error('Feature not yet implemented in demo');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'Usuário bloqueado',
        description: 'O usuário foi bloqueado com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Não foi possível bloquear o usuário.',
        variant: 'destructive',
      });
    },
  });

  const exportUsers = () => {
    if (!users) return;
    
    const csvContent = [
      ['Email', 'Nome', 'Plano', 'Data de Criação', 'Último Login'].join(','),
      ...users.map(user => [
        user.email,
        user.user_metadata.name,
        user.user_metadata.plan,
        new Date(user.created_at).toLocaleDateString('pt-BR'),
        new Date(user.last_sign_in_at).toLocaleDateString('pt-BR')
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
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="blocked">Bloqueados</SelectItem>
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
                <TableHead>Plano</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.user_metadata.name}</TableCell>
                  <TableCell>
                    <Badge variant={
                      user.user_metadata.plan === 'enterprise' ? 'default' :
                      user.user_metadata.plan === 'pro' ? 'secondary' : 'outline'
                    }>
                      {user.user_metadata.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {new Date(user.last_sign_in_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => console.log('Edit user:', user.id)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => blockUserMutation.mutate(user.id)}
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
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
