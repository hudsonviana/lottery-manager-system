import { useQuery } from '@tanstack/react-query';
import useApiPrivate from '@/hooks/useApiPrivate';
import formatDate from '@/helpers/formatDate';
import translateRole from '@/helpers/translateRole';
import DataTable from '@/components/DataTable';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const sortingHeader = ({ label, column }) => {
  return (
    <Button
      className="ms-0 px-0"
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

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
    return <div className="container mx-auto py-0">Carregando...</div>;
  if (isError) return <div>Ocorreu um erro: {error.message}</div>;

  const columns = [
    {
      header: (info) => sortingHeader({ label: 'Nome', column: info.column }),
      accessorKey: 'name',
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    },
    {
      header: (info) => sortingHeader({ label: 'Email', column: info.column }),
      accessorKey: 'email',
    },
    {
      header: (info) =>
        sortingHeader({ label: 'Nível de acesso', column: info.column }),
      accessorKey: 'role',
      cell: (info) => translateRole(info.getValue()),
    },
    {
      header: (info) =>
        sortingHeader({ label: 'Cadastrado em', column: info.column }),
      accessorKey: 'createdAt',
      cell: (info) => formatDate(info.getValue()),
    },
    {
      header: (info) =>
        sortingHeader({
          label: 'Última autlização',
          column: info.column,
        }),
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
    <div className="container mx-auto py-0">
      <DataTable data={users} columns={columns} />
    </div>
  );
};

export default Users;
