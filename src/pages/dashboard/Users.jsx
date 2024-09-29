import { useQuery } from '@tanstack/react-query';
import useApiPrivate from '@/hooks/useApiPrivate';
import formatDate from '@/helpers/formatDate';
import translateRole from '@/helpers/translateRole';
import DataTable from '@/components/DataTable';

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

  const columns = [
    {
      header: 'Nome',
      accessorKey: 'name',
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    },
    { header: 'Email', accessorKey: 'email' },
    {
      header: 'Nível de Acesso',
      accessorKey: 'role',
      cell: (info) => translateRole(info.getValue()),
    },
    {
      header: 'Cadastrado em',
      accessorKey: 'createdAt',
      cell: (info) => formatDate(info.getValue()),
    },
    {
      header: 'Última modificação/acesso',
      accessorKey: 'updatedAt',
      cell: (info) => formatDate(info.getValue()),
    },
  ];

  return (
    <div>
      <DataTable data={users} columns={columns} />
    </div>
  );
};

export default Users;

/**
 * 
 * 
 * import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

 *  <Table>
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
                <Link to={user.id}>
                  {user.firstName} {user.lastName}
                </Link>
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
 */
