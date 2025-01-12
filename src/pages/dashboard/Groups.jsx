import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { THEME_STYLES } from '@/consts/ThemeStyles';
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
import formatDate from '@/helpers/formatDate';
import translateGroupTheme from '@/helpers/translateGroupTheme';
import { handleError } from '@/helpers/handleError';

const Groups = () => {
  const { toastAlert, dismiss } = useToastAlert();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [groupUpdate, setGroupUpdate] = useState({});
  const [groupDelete, setGroupDelete] = useState({});

  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { fetchGroups, deleteGroup } = useGroupApi();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    // staleTime: 1000 * 60 * 5,
  });

  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: ({ deletedGroup }) => {
      queryClient.invalidateQueries(['groups']);
      toastAlert({
        type: 'success',
        title: 'Grupo deletado com sucesso!',
        message: `O grupo: "${deletedGroup.name}" foi deletado do banco de dados.`,
      });
    },
    onError: (err) => {
      const { error } = handleError(err);
      toastAlert({
        type: 'danger',
        title: 'Erro ao deletar grupo!',
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
      header: (info) => sortingHeader({ label: 'Qtd jogos', column: info.column }),
      accessorKey: '_count.games',
      cell: (info) => <div className="w-full text-center p-0 m-0">{info.getValue()}</div>,
    },
    {
      header: (info) => sortingHeader({ label: 'Tema', column: info.column }),
      accessorKey: 'theme',
      cell: (info) => (
        <span className={`border rounded w-full px-2 ${THEME_STYLES[info.getValue()]}`}>
          {translateGroupTheme(info.getValue())}
        </span>
      ),
    },
    {
      header: (info) => sortingHeader({ label: 'Cadastrado em', column: info.column }),
      accessorKey: 'createdAt',
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
            <AlertDialogTitle>Tem certeza que deseja deletar o grupo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isto vai deletar permanentemente o grupo e
              remover seus dados.
            </AlertDialogDescription>
            <AlertDescription>
              <ul className="border border-neutral-300 rounded-md p-2">
                <li className="flex">
                  <div className="font-medium min-w-20 me-1">Nome:</div>
                  <span>{groupDelete.name}</span>
                </li>
                <li className="flex">
                  <div className="font-medium min-w-20 me-1">Descrição:</div>
                  <span>{groupDelete.description}</span>
                </li>
                <li className="flex">
                  <div className="font-medium min-w-20 me-1">É bolão?</div>
                  <span>{groupDelete.isPool ? 'Sim' : 'Não'}</span>
                </li>
                <li className="flex">
                  <div className="font-medium min-w-20 me-1">Jogos:</div>
                  <span>{groupDelete._count?.games}</span>
                </li>
              </ul>
            </AlertDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteGroupMutation.mutate(groupDelete.id)}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Groups;
