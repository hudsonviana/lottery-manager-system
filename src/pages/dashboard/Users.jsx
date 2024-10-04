import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { useToast } from '@/hooks/use-toast';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertDescription } from '@/components/ui/alert';
import { handleError } from '@/helpers/handleError';

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
  const { toast, dismiss } = useToast();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [userUpdate, setUserUpdate] = useState({});
  const [userDelete, setUserDelete] = useState({});

  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const { fetchUsers, deleteUser } = useUserApi();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: ({ deletedUser }) => {
      queryClient.invalidateQueries(['users']);
      toast({
        className: 'bg-green-200 text-green-800 border-green-300',
        title: 'Usuário deletado com sucesso!',
        description: `O usuário: ${deletedUser.firstName} ${deletedUser.lastName} (Email: ${deletedUser.email}) foi deletado do banco de dados.`,
      });
    },
    onError: (err) => {
      const { error } = handleError(err);
      toast({
        className: 'bg-red-200 text-red-800 border-red-300',
        title: 'Erro ao deletar usuário!',
        description: error.map((err, i) => <p key={i}>{err}</p>),
      });
    },
  });

  if (isPending)
    return <div className="container mx-auto py-0">Carregando...</div>;
  if (isError) return <div>Ocorreu um erro: {error.message}</div>;

  const handleUpdateUserAction = (user) => {
    dismiss();
    setUserUpdate(user);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteUserAction = (user) => {
    dismiss();
    setUserDelete(user);
    setIsDeleteAlertOpen(true);
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
            onDelete={() => handleDeleteUserAction(user)}
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

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja deletar o usuário?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isto vai deletar permanentemente
              o usuário e remover seus dados.
            </AlertDialogDescription>
            <AlertDescription>
              <ul className="border border-neutral-300 rounded-md p-2">
                <li className="flex">
                  <div className="font-medium min-w-12">Nome:</div>
                  <span>
                    {userDelete.firstName} {userDelete.lastName}
                  </span>
                </li>
                <li className="flex">
                  <label className="font-medium min-w-12">Email:</label>
                  <span>{userDelete.email}</span>
                </li>
                <li className="flex">
                  <label className="font-medium min-w-12">Perfil:</label>
                  <span>{translateRole(userDelete.role)}</span>
                </li>
              </ul>
            </AlertDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserMutation.mutate(userDelete.id)}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Users;
