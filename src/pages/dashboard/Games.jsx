import { useQuery } from '@tanstack/react-query';
import useUserApi from '@/hooks/useUserApi';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import DataTable, { sortingHeader } from '@/components/DataTable';
import formatDate from '@/helpers/formatDate';
import translateGameResult from '@/helpers/translateGameResult';
import GameDisplay from '@/components/GameDisplay';
import CreateGameModal from '@/components/CreateGameModal';

const Games = () => {
  const { auth } = useAuth();

  const { fetchUserGames } = useUserApi();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['games', auth.user.id],
    queryFn: () => fetchUserGames(auth.user.id),
    staleTime: 1000 * 60,
  });

  if (isPending) {
    return (
      <div className="flex items-center container mx-auto py-0">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Carregando...
      </div>
    );
  }

  if (isError) return <div>Ocorreu um erro: {error.message}</div>;

  // const games = [
  //   {
  //     id: '8732ea7d-cbf4-4648-81f1-39fc8cfb93e5',
  //     gameNumbers: {
  //       gameA: ['01', '02', '03', '04', '05', '06'],
  //       gameB: ['11', '12', '13', '14', '15', '16'],
  //       gameC: [],
  //     },
  //     ticketPrice: 15,
  //     result: 'PENDING',
  //     createdAt: '2024-07-21T18:49:35.289Z',
  //     updatedAt: '2024-07-21T18:49:35.289Z',
  //     draw: {
  //       id: '3757d0e3-900c-43dc-8b72-10a0393610e3',
  //       lotteryType: 'MEGA_SENA',
  //       contestNumber: 2751,
  //       drawDate: '2024-07-20T03:00:00.000Z',
  //       status: 'DRAWN',
  //       drawnNumbers: ['04', '13', '18', '42', '52', '53'],
  //       prize: [
  //         {
  //           faixa: 1,
  //           valorPremio: 0,
  //           descricaoFaixa: '6 acertos',
  //           numeroDeGanhadores: 0,
  //         },
  //         {
  //           faixa: 2,
  //           valorPremio: 60964.39,
  //           descricaoFaixa: '5 acertos',
  //           numeroDeGanhadores: 60,
  //         },
  //         {
  //           faixa: 3,
  //           valorPremio: 1049.72,
  //           descricaoFaixa: '4 acertos',
  //           numeroDeGanhadores: 4978,
  //         },
  //       ],
  //       accumulated: true,
  //       createdAt: '2024-07-20T21:03:40.605Z',
  //       updatedAt: '2024-07-21T03:19:48.280Z',
  //     },
  //   },
  // ];

  const columns = [
    {
      header: (info) =>
        sortingHeader({ label: 'Concurso', column: info.column }),
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
      header: (info) =>
        sortingHeader({ label: 'Apostas', column: info.column }),
      accessorKey: 'gameNumbers',
      cell: (info) => <GameDisplay gameNumbers={info.getValue()} />,
    },
    {
      header: (info) =>
        sortingHeader({ label: 'Custo do jogo', column: info.column }),
      accessorKey: 'ticketPrice',
      cell: (info) =>
        info.getValue().toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
    },
    {
      header: (info) =>
        sortingHeader({ label: 'Cadastrado em', column: info.column }),
      accessorKey: 'createdAt',
      cell: (info) => formatDate(info.getValue()),
    },
    {
      header: (info) =>
        sortingHeader({ label: 'Resultado', column: info.column }),
      accessorKey: 'result',
      cell: (info) => translateGameResult(info.getValue()),
    },
  ];

  return (
    <div className="container mx-auto py-0">
      <DataTable
        data={data?.userGames?.games}
        columns={columns}
        defaultSorting={[{ id: 'contestNumber', desc: true }]}
        createModal={<CreateGameModal />}
      />
    </div>
  );
};

export default Games;
