import { useQuery } from '@tanstack/react-query';
import useApiPrivate from '@/hooks/useApiPrivate';
import formatDate from '@/helpers/formatDate';
import translateRole from '@/helpers/translateRole';
import DataTable from '@/components/DataTable';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  if (isPending)
    return <div className="container mx-auto py-10">Carregando...</div>;
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
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                Copia ID do usuário
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.firstName)}
              >
                Copiar nome
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.lastName)}
              >
                Copiar sobrenome
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-10">
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
