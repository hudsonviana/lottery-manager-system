import { useState } from 'react';
import LoadingLabel from '@/components/LoadingLabel';
import { useAuth } from '@/hooks/useAuth';
import useUserApi from '@/hooks/useUserApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DataTable, { sortingHeader } from '@/components/DataTable';
import formatDate from '@/helpers/formatDate';
import translateDrawStatus from '@/helpers/translateDrawStatus';
import DrawActions from '@/components/DrawActions';
import translateLotteryType from '@/helpers/translateLotteryType';
import { useNavigate } from 'react-router-dom';
import DrawnNumbersTableRow from '@/components/DrawnNumbersTableRow';
import useDrawApi from '@/hooks/useDrawApi';
import { BsQuestionCircle } from 'react-icons/bs';
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

const Contests = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { fetchUserDraws } = useUserApi();
  const { deleteDraw } = useDrawApi();
  const [drawToDelete, setDrawToDelete] = useState({});
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toastAlert, dismiss } = useToastAlert();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['contests'],
    queryFn: () => fetchUserDraws(auth.user.id),
    // staleTime: 1000 * 60,
  });

  const deleteDrawMutation = useMutation({
    mutationFn: (id) => deleteDraw(id),
    onSuccess: ({ deletedDraw }) => {
      queryClient.invalidateQueries(['contests']);
      queryClient.invalidateQueries(['games']);
      toastAlert({
        type: 'success',
        title: 'Concurso deletado com sucesso!',
        message: `O sorteio da loteria ${translateLotteryType(
          deletedDraw.lotteryType
        )} (Concurso: ${deletedDraw.contestNumber}) foi deletado do banco de dados.`,
      });
    },
    onError: (err) => {
      const { error } = handleError(err);
      toastAlert({
        type: 'danger',
        title: 'Erro ao deletar concurso!',
        message: error,
      });
    },
  });

  const handleDeleteDrawAction = (draw) => {
    dismiss();
    setDrawToDelete(draw);
    setIsDeleteAlertOpen(true);
  };

  const columns = [
    {
      header: (info) => sortingHeader({ label: 'Loteria', column: info.column }),
      accessorKey: 'lotteryType',
      cell: (info) => translateLotteryType(info.getValue()),
    },
    {
      header: (info) => sortingHeader({ label: 'Concurso', column: info.column }),
      accessorKey: 'contestNumber',
    },
    {
      header: (info) =>
        sortingHeader({
          label: 'Data do sorteio',
          column: info.column,
        }),
      accessorKey: 'drawDate',
      cell: (info) => formatDate(info.getValue(), { withTime: false }),
    },
    {
      header: (info) =>
        sortingHeader({ label: 'Dezenas sorteadas', column: info.column }),
      accessorKey: 'drawnNumbers',
      cell: (info) =>
        info.row.original.status === 'PENDING' ? (
          <BsQuestionCircle size={20} color="gray" />
        ) : (
          <DrawnNumbersTableRow drawnNumbers={info.getValue()} />
        ),
    },
    {
      header: (info) => sortingHeader({ label: 'Acumulou', column: info.column }),
      accessorKey: 'accumulated',
      cell: (info) =>
        info.row.original.status === 'PENDING' ? (
          <BsQuestionCircle size={20} color="gray" />
        ) : info.getValue() ? (
          'Sim'
        ) : (
          'Não'
        ),
    },
    {
      header: (info) => sortingHeader({ label: 'Qtd jogos', column: info.column }),
      accessorKey: 'countGames',
    },
    {
      header: (info) => sortingHeader({ label: 'Resultado', column: info.column }),
      accessorKey: 'status',
      cell: (info) => translateDrawStatus(info.getValue()),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const draw = row.original;

        return (
          <DrawActions
            draw={draw}
            onView={() => navigate(draw.id)}
            onViewGames={() => navigate(`${draw.id}/games`)}
            onDelete={() => handleDeleteDrawAction(draw)}
          />
        );
      },
    },
  ];

  if (isPending) {
    return (
      <div className="flex items-center container mx-auto py-0">
        <LoadingLabel label={'Carregando...'} />
      </div>
    );
  }

  if (isError) return <div>Ocorreu um erro: {error.message}</div>;

  return (
    <div className="container mx-auto py-0">
      <DataTable
        data={data?.userDraws}
        columns={columns}
        defaultSorting={[{ id: 'contestNumber', desc: true }]}
      />

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja deletar este concurso?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Se confirmada, esta ação não poderá ser desfeita.
              <div className="text-red-500">
                OBS: Todos os jogos associados a este concurso também serão deletados.
              </div>
            </AlertDialogDescription>
            <AlertDescription>
              <ul className="border border-neutral-300 rounded-md p-2">
                <li className="flex gap-1">
                  <div className="font-medium min-w-12">Loteria:</div>
                  <span>{translateLotteryType(drawToDelete?.lotteryType)}</span>
                </li>
                <li className="flex gap-1">
                  <div className="font-medium min-w-12">Concurso:</div>
                  <span>{drawToDelete?.contestNumber}</span>
                </li>
                <li className="flex gap-1">
                  <div className="font-medium min-w-12">Data do sorteio:</div>
                  <span>{formatDate(drawToDelete?.drawDate, { withTime: false })}</span>
                </li>
                <li className="flex gap-1">
                  <div className="font-medium min-w-12">Dezenas sorteadas:</div>
                  <span>
                    {drawToDelete?.drawnNumbers?.length > 0 ? (
                      <DrawnNumbersTableRow drawnNumbers={drawToDelete?.drawnNumbers} />
                    ) : (
                      '[sorteio pendente]'
                    )}
                  </span>
                </li>
                <li className="flex gap-1">
                  <div className="font-medium min-w-12">Jogos associados:</div>
                  <span>{drawToDelete?.countGames}</span>
                </li>
              </ul>
            </AlertDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteDrawMutation.mutate(drawToDelete.id)}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Contests;
