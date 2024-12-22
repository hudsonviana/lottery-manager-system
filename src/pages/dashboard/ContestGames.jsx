import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import LoadingLabel from '@/components/LoadingLabel';
import useUserApi from '@/hooks/useUserApi';
import translateLotteryType from '@/helpers/translateLotteryType';
import formatDate from '@/helpers/formatDate';
import GameDisplay from '@/components/GameDisplay';
import DrawDisplay from '@/components/DrawDisplay';
import PrizeDisplay from '@/components/PrizeDisplay';
import CheckDrawResult from '@/components/CheckDrawResult';

const ContestGames = () => {
  const { drawId } = useParams();
  const { auth } = useAuth();
  const { fetchUserDrawGames } = useUserApi();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['contests', drawId, 'games'],
    queryFn: () => fetchUserDrawGames(auth.user.id, drawId),
    staleTime: 1000 * 60 * 5,
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
      id: '6f37c9d3-79fa-4b25-93fc-67a27c7b9c5e',
      gameNumbers: {
        gameA: ['01', '04', '08', '32', '12', '23', '24', '39', '56'],
        gameB: [],
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
        drawnNumbers: ['07', '03', '11', '35', '46', '57'],
        prize: [],
        accumulated: false,
        createdAt: '2024-10-08T01:12:49.575Z',
        updatedAt: '2024-10-08T01:12:49.575Z',
      },
    },
    {
      id: 'fbf5acaf-fefc-4dba-a6b1-8ff156a77d8e',
      gameNumbers: {
        gameA: ['01', '02', '03', '12', '13', '32'],
        gameB: ['02', '04', '11', '15', '35', '59'],
        gameC: ['02', '13', '24', '35', '46', '57'],
      },
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
        drawnNumbers: ['07', '03', '11', '35', '46', '57'],
        prize: [],
        accumulated: false,
        createdAt: '2024-10-08T01:12:49.575Z',
        updatedAt: '2024-10-08T01:12:49.575Z',
      },
    },
    {
      id: '9f409414-1569-475f-9c24-48df5c171eb0',
      gameNumbers: {
        gameA: ['07', '13', '24', '35', '46', '57'],
        gameB: ['07', '11', '24', '35', '46', '57'],
        gameC: ['07', '03', '11', '35', '46', '57'],
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
        drawnNumbers: ['07', '03', '11', '35', '46', '57'],
        prize: [],
        accumulated: false,
        createdAt: '2024-10-08T01:12:49.575Z',
        updatedAt: '2024-10-08T01:12:49.575Z',
      },
    },
  ];

  const { games } = data;
  // const games = teste;

  return (
    <div className="container mx-auto py-0 w-100">
      <div className="flex gap-5 bg-white border rounded-md p-6 h-[calc(100vh-6rem)]">
        {/* Jogos */}
        <div id="games" className="overflow-auto w-full">
          <h1 className="font-semibold mb-2  bg-white z-10 sticky top-0">
            Relação de jogos da {translateLotteryType(games[0].draw.lotteryType)} -
            Concurso: {games[0].draw.contestNumber}
          </h1>

          {games.map((game, index) => (
            <div key={game.id} className="flex mb-1">
              <div>
                <span className="text-sm mb-0 font-semibold text-gray-500 italic">
                  Jogo {index + 1} - cadastrado em: {formatDate(game.createdAt)}
                </span>
                <GameDisplay gameData={game} />
              </div>
            </div>
          ))}
        </div>

        {/* Resultado */}
        <div
          id="results"
          className="w-9/12 h-auto sticky top-0 ps-5 border-l-2 border-l-gray-300"
        >
          <h1 className="font-semibold mb-2">
            Resultado do sorteio da {translateLotteryType(games[0].draw.lotteryType)} -
            Concurso: {games[0].draw.contestNumber}
          </h1>

          {games[0].draw.drawnNumbers.length > 0 ? (
            <div>
              <span className="text-sm mb-0 font-semibold text-gray-500 italic">
                Sorteio realizado em:{' '}
                {formatDate(games[0].draw.drawDate, { withTime: false })}
              </span>
              <DrawDisplay drawnNumbers={games[0].draw.drawnNumbers} />
              {games[0].draw.accumulated ? (
                <div className="font-semibold text-blue-700 mb-1">Acumulou!</div>
              ) : null}
              <PrizeDisplay prize={games[0].draw.prize} />
            </div>
          ) : (
            <div className="mt-5">
              <CheckDrawResult game={games[0]} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestGames;
