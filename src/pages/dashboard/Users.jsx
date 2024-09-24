import { useQuery } from '@tanstack/react-query';
import useApiPrivate from '@/hooks/useApiPrivate';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

const Users = () => {
  const apiPrivate = useApiPrivate();

  const {
    isPending,
    isError,
    data: users,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await apiPrivate.get('/users')).data?.users,
  });

  if (isPending) return <div>Carregando...</div>;
  if (isError) return <div>Ocorreu um erro: {error.message}</div>;

  // https://www.youtube.com/watch?v=NfNjj-pZV30

  // Função para formatar a data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const translateRole = (role) => {
    const roles = {
      ADMIN: 'Administrador',
      USER: 'Usuário',
    };
    return roles[role] || 'indefinido';
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome do usuário</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Perfil</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead>Atualizado em</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{translateRole(user.role)}</TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
              <TableCell>{formatDate(user.updatedAt)}</TableCell>
              <TableCell>
                <Button variant="ghost" className="ml-auto flex h-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Users;
