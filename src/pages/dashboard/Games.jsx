import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useUserApi from '@/hooks/useUserApi';
import useGameApi from '@/hooks/useGameApi';
import { useAuth } from '@/hooks/useAuth';
import DataTable, { sortingHeader } from '@/components/DataTable';
import formatDate from '@/helpers/formatDate';
import translateGameResult from '@/helpers/translateGameResult';
import translateLotteryType from '@/helpers/translateLotteryType';
import CreateGameModal from '@/components/CreateGameModal';
import GameActions from '@/components/GameActions';
import GameNumbersTableRow from '@/components/GameNumbersTableRow';

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
import LoadingLabel from '@/components/LoadingLabel';
import UpdateGameModal from '@/components/UpdateGameModal';
import useToastAlert from '@/hooks/useToastAlert';

const Games = () => {
  const { toastAlert, dismiss } = useToastAlert();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [gameDelete, setGameDelete] = useState({});
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [gameUpdate, setGameUpdate] = useState({});

  const { fetchUserGames } = useUserApi();
  const { deleteGame } = useGameApi();

  const queryClient = useQueryClient();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['games'],
    queryFn: () => fetchUserGames(auth.user.id),
    staleTime: 1000 * 60,
  });

  const deleteGameMutation = useMutation({
    mutationFn: ({ playerId, id }) => deleteGame(playerId, id),
    onSuccess: () => {
      console.log(gameDelete);
      queryClient.invalidateQueries(['games']);
      toastAlert({
        type: 'success',
        title: 'Jogo deletado com sucesso!',
        message: `Jogo da loteria ${translateLotteryType(
          gameDelete?.draw?.lotteryType
        )} (Concurso: ${
          gameDelete?.draw?.contestNumber
        }) foi deletado do banco de dados.`,
      });
    },
    onError: (err) => {
      const { error } = handleError(err);
      toastAlert({
        type: 'danger',
        title: 'Erro ao deletar jogo!',
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

  const handleDeleteGameAction = (game) => {
    dismiss();
    setGameDelete(game);
    setIsDeleteAlertOpen(true);
  };

  const handleUpdateGameAction = (game) => {
    dismiss();

    const { contestNumber, drawDate, lotteryType } = game.draw;

    const gameUpdateFiltered = {
      ...game,
      contestNumber,
      drawDate: formatDate(drawDate, { withTime: false }),
      lotteryType,
    };

    const { result, createdAt, updatedAt, draw, ...gameDataToUpdate } =
      gameUpdateFiltered;

    setGameUpdate(gameDataToUpdate);
    setIsUpdateModalOpen(true);
  };

  const columns = [
    {
      header: (info) => sortingHeader({ label: 'Concurso', column: info.column }),
      accessorKey: 'draw.contestNumber',
      id: 'contestNumber',
    },
    {
      header: (info) =>
        sortingHeader({
          label: 'Data do sorteio',
          column: info.column,
        }),
      accessorKey: 'draw.drawDate',
      cell: (info) => formatDate(info.getValue(), { withTime: false }),
    },
    {
      header: (info) => sortingHeader({ label: 'Apostas', column: info.column }),
      accessorKey: 'gameNumbers',
      cell: (info) => <GameNumbersTableRow gameNumbers={info.getValue()} />,
    },
    {
      header: (info) => sortingHeader({ label: 'Custo do jogo', column: info.column }),
      accessorKey: 'ticketPrice',
      cell: (info) =>
        info.getValue().toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
    },
    {
      header: (info) => sortingHeader({ label: 'Cadastrado em', column: info.column }),
      accessorKey: 'createdAt',
      cell: (info) => formatDate(info.getValue()),
    },
    {
      header: (info) => sortingHeader({ label: 'Resultado', column: info.column }),
      accessorKey: 'result',
      cell: (info) => translateGameResult(info.getValue()),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const game = row.original;

        return (
          <GameActions
            game={game}
            onView={() => navigate(game.id)}
            onUpdate={() => handleUpdateGameAction(game)}
            onDelete={() => handleDeleteGameAction(game)}
          />
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-0">
      {isUpdateModalOpen && (
        <UpdateGameModal
          game={gameUpdate}
          isUpdateModalOpen={isUpdateModalOpen}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
        />
      )}

      <DataTable
        data={data?.userGames?.games}
        columns={columns}
        defaultSorting={[{ id: 'contestNumber', desc: true }]}
        createModal={<CreateGameModal />}
      />

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja deletar o jogo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
            <AlertDescription>
              <ul className="border border-neutral-300 rounded-md p-2">
                <li className="flex gap-1">
                  <div className="font-medium min-w-12">Jogo cadastrado em:</div>
                  <span>{formatDate(gameDelete?.createdAt)}</span>
                </li>
                <li className="flex gap-1">
                  <div className="font-medium min-w-12">Loteria:</div>
                  <span>{translateLotteryType(gameDelete?.draw?.lotteryType)}</span>
                </li>
                <li className="flex gap-1">
                  <div className="font-medium min-w-12">Concurso:</div>
                  <span>{gameDelete?.draw?.contestNumber}</span>
                </li>
                <li className="flex gap-1">
                  <div className="font-medium min-w-12">Apostas:</div>
                  <span>
                    {<GameNumbersTableRow gameNumbers={gameDelete?.gameNumbers} />}
                  </span>
                </li>
              </ul>
            </AlertDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteGameMutation.mutate({ playerId: auth.user.id, id: gameDelete.id })
              }
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Games;
