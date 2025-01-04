import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import formatDate from '@/helpers/formatDate';
import { handleError } from '@/helpers/handleError';
import translateRole from '@/helpers/translateRole';
import DataTable, { sortingHeader } from '@/components/DataTable';
import LoadingLabel from '@/components/LoadingLabel';
import CreateGroupModal from '@/components/CreateGroupModal';
import UpdateGroupModal from '@/components/UpdateGroupModal';
import GroupActions from '@/components/GroupActions';
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
import useToastAlert from '@/hooks/useToastAlert';
import useGroupApi from '@/hooks/useGroupApi';

const Groups = () => {
  const { toastAlert, dismiss } = useToastAlert();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [groupUpdate, setGroupUpdate] = useState({});
  const [userDelete, setUserDelete] = useState({});

  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { fetchGroups, deleteGroup } = useGroupApi();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    // staleTime: 1000 * 60 * 5,
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: ({ deletedUser }) => {
      queryClient.invalidateQueries(['users']);
      toastAlert({
        type: 'success',
        title: 'Usuário deletado com sucesso!',
        message: `O usuário: ${deletedUser.firstName} ${deletedUser.lastName} (Email: ${deletedUser.email}) foi deletado do banco de dados.`,
      });
    },
    onError: (err) => {
      const { error } = handleError(err);
      toastAlert({
        type: 'danger',
        title: 'Erro ao deletar usuário!',
        message: error,
      });
    },
  });

  if (isPending) {
    return (
      <div className="flex items-center container mx-auto py-0">
        <LoadingLabel label={'Carregando...'} />
      </div>
    );
  }

  if (isError) return <div>Ocorreu um erro: {error.message}</div>;

  const handleUpdateGroupAction = (group) => {
    dismiss();
    setGroupUpdate(group);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteGroupAction = (group) => {
    dismiss();
    setGroupDelete(group);
    setIsDeleteAlertOpen(true);
  };

  const columns = [
    {
      header: (info) => sortingHeader({ label: 'Nome', column: info.column }),
      accessorKey: 'name',
    },
    {
      header: (info) => sortingHeader({ label: 'Descrição', column: info.column }),
      accessorKey: 'description',
    },
    {
      header: (info) => sortingHeader({ label: 'É bolão?', column: info.column }),
      accessorKey: 'isPool',
      cell: (info) => (info.getValue() ? 'Sim' : 'Não'),
    },
    {
      header: (info) => sortingHeader({ label: 'Criador', column: info.column }),
      accessorKey: 'creator.firstName',
    },
    {
      header: (info) => sortingHeader({ label: 'Cadastrado em', column: info.column }),
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
        const group = row.original;

        return (
          <GroupActions
            group={group}
            onView={() => navigate(group.id)}
            onUpdate={() => handleUpdateGroupAction(group)}
            onDelete={() => handleDeleteGroupAction(group)}
          />
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-0">
      <UpdateGroupModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        group={groupUpdate}
      />
      <DataTable
        data={data}
        columns={columns}
        createModal={<CreateGroupModal />}
        defaultSorting={[{ id: 'createdAt', desc: true }]} // Add this line for default sorting
      />

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja deletar o usuário?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isto vai deletar permanentemente o usuário
              e remover seus dados.
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
            <AlertDialogAction onClick={() => deleteUserMutation.mutate(userDelete.id)}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Groups;
