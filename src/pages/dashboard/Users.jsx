import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import formatDate from '@/helpers/formatDate';
import translateRole from '@/helpers/translateRole';
import DataTable from '@/components/DataTable';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreateUserModal from '@/components/CreateUserModal';
import UpdateUserModal from '@/components/UpdateUserModal';
import useUserApi from '@/hooks/useUserApi';
import { useState } from 'react';
import UserActions from '@/components/UserActions';

// import generateRandomUsers from '@/mock/generateRandomUsers';
// const users = generateRandomUsers(89);

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
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [userUpdate, setUserUpdate] = useState({});

  const navigate = useNavigate();
  const { fetchUsers } = useUserApi();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
  });

  if (isPending)
    return <div className="container mx-auto py-0">Carregando...</div>;
  if (isError) return <div>Ocorreu um erro: {error.message}</div>;

  const handleUpdateUserAction = (user) => {
    setUserUpdate(user);
    setIsUpdateModalOpen(true);
  };

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
          <UserActions
            user={user}
            onView={() => navigate(user.id)}
            onUpdate={() => handleUpdateUserAction(user)}
            onDelete={() => console.log(`Deletar usuário:`, user)}
          />
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-0">
      <UpdateUserModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        user={userUpdate}
      />
      <DataTable
        data={data}
        columns={columns}
        createModal={<CreateUserModal />}
      />
    </div>
  );
};

export default Users;
