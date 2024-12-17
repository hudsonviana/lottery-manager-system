import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import LoadingLabel from '@/components/LoadingLabel';
import useUserApi from '@/hooks/useUserApi';
import GameDisplay from '@/components/GameDisplay';
import translateLotteryType from '@/helpers/translateLotteryType';
import { formatDate } from 'date-fns';
import translateGameResult from '@/helpers/translateGameResult';

const ContestGames = () => {
  const { drawId } = useParams();
  const { auth } = useAuth();
  const { fetchUserDrawGames } = useUserApi();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['contests', drawId, 'games'],
    queryFn: () => fetchUserDrawGames(auth.user.id, drawId),
    // staleTime: 1000 * 60 * 5,
  });

  if (isPending) {
    return (
      <div className="flex items-center container mx-auto py-0">
        <LoadingLabel label={'Carregando...'} />
      </div>
    );
  }

  if (isError) return <div>Ocorreu um erro: {error.message}</div>;

  const teste = [
    {
      id: 'fbf5acaf-fefc-4dba-a6b1-8ff156a77d8e',
      gameNumbers: { gameA: ['01', '02', '03', '12', '13', '32'], gameB: [], gameC: [] },
      ticketPrice: 5,
      result: 'PENDING',
      playerId: 'e6dc720f-5bae-4540-862a-6d522f0cade9',
      drawId: '8a562367-4581-491a-935c-09dd0da8b2a5',
      createdAt: '2024-11-17T03:09:12.943Z',
      updatedAt: '2024-11-17T03:09:12.943Z',
      draw: {
        id: '8a562367-4581-491a-935c-09dd0da8b2a5',
        lotteryType: 'MEGA_SENA',
        contestNumber: 2784,
        drawDate: '2024-10-08T03:00:00.000Z',
        status: 'PENDING',
        drawnNumbers: ['01', '03', '11', '35', '46', '57'],
        prize: [],
        accumulated: false,
        createdAt: '2024-10-08T01:12:49.575Z',
        updatedAt: '2024-10-08T01:12:49.575Z',
      },
    },
    {
      id: '9f409414-1569-475f-9c24-48df5c171eb0',
      gameNumbers: {
        gameA: ['01', '12', '23', '24', '35', '56'],
        gameB: ['02', '13', '24', '35', '46', '57'],
        gameC: [],
      },
      ticketPrice: 10,
      result: 'PENDING',
      playerId: 'e6dc720f-5bae-4540-862a-6d522f0cade9',
      drawId: '8a562367-4581-491a-935c-09dd0da8b2a5',
      createdAt: '2024-11-20T19:23:38.550Z',
      updatedAt: '2024-11-23T14:14:14.422Z',
      draw: {
        id: '8a562367-4581-491a-935c-09dd0da8b2a5',
        lotteryType: 'MEGA_SENA',
        contestNumber: 2784,
        drawDate: '2024-10-08T03:00:00.000Z',
        status: 'PENDING',
        drawnNumbers: ['01', '03', '11', '35', '46', '57'],
        prize: [],
        accumulated: false,
        createdAt: '2024-10-08T01:12:49.575Z',
        updatedAt: '2024-10-08T01:12:49.575Z',
      },
    },
  ];

  // const { games } = data;
  const games = teste;

  return (
    <div className="container mx-auto py-0">
      <div className="flex gap-5 bg-white border rounded-md p-6 min-h-[calc(100vh-6rem)]">
        <div>
          <h1 className="font-semibold my-0">
            Relação de jogos da {translateLotteryType(games[0].draw.lotteryType)} -
            Concurso: {games[0].draw.contestNumber}
          </h1>

          {games.map((game) => (
            <div key={game.id} className="flex">
              <div className="p-2 my-2 border border-slate-300 rounded-md">
                <GameDisplay
                  isForDraw={true}
                  gameNumbers={game.gameNumbers}
                  drawnNumbers={game.draw.drawnNumbers}
                />
              </div>
              {/* {game.draw.drawnNumbers.length !== 0 ? (
                <div className="p-2 my-2 border rounded-md">
                  <span className="me-2 text-sm font-semibold">Resultado</span>
                </div>
              ) : null} */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestGames;
