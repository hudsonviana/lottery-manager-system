import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import LoadingLabel from '@/components/LoadingLabel';
import GameDisplay from '@/components/GameDisplay';
import DrawDisplay from '@/components/DrawDisplay';
import PrizeDisplay from '@/components/PrizeDisplay';
import CheckDrawResult from '@/components/CheckDrawResult';
import formatDate from '@/helpers/formatDate';
import translateLotteryType from '@/helpers/translateLotteryType';
import { useAuth } from '@/hooks/useAuth';
import useDrawApi from '@/hooks/useDrawApi';

const ContestGames = () => {
  const { drawId } = useParams();
  const { auth } = useAuth();
  const { fetchDrawWithGamesOfUser } = useDrawApi();

  const {
    isPending,
    isError,
    data: draw,
    error,
  } = useQuery({
    queryKey: ['contests', drawId, 'games'],
    queryFn: () => fetchDrawWithGamesOfUser(drawId, auth.user.id),
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

  const { games, ...drawData } = draw;

  return (
    <div className="container mx-auto py-0 w-100">
      <div className="flex gap-5 bg-white border rounded-md p-6 h-[calc(100vh-6rem)]">
        {/* Jogos realizados */}
        <div className="overflow-auto w-full">
          <h1 className="font-semibold mb-2  bg-white z-10 sticky top-0">
            Relação de jogos da {translateLotteryType(draw.lotteryType)} - Concurso:{' '}
            {draw.contestNumber}
          </h1>

          {draw.games.map((game, index) => (
            <div key={game.id} className="flex mb-1">
              <div>
                <div className="">
                  {game.group?.name && (
                    <span className="text-xs text-purple-700 font-medium me-2 px-1 bg-purple-200 border border-purple-400 rounded">
                      {game.group?.name}
                    </span>
                  )}
                  <span className="text-sm mb-0 font-semibold text-gray-500 italic">
                    Jogo {index + 1} - cadastrado em: {formatDate(game.createdAt)}
                  </span>
                </div>
                <GameDisplay
                  gameNumbers={game.gameNumbers}
                  drawnNumbers={draw.drawnNumbers}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Resultado da conferência */}
        <div className="w-9/12 h-auto sticky top-0 ps-5 border-l-2 border-l-gray-300">
          <h1 className="font-semibold mb-2">
            Resultado do sorteio da {translateLotteryType(draw.lotteryType)} - Concurso:{' '}
            {draw.contestNumber}
          </h1>

          {draw.drawnNumbers.length > 0 ? (
            <div>
              <span className="text-sm mb-0 font-semibold text-gray-500 italic">
                Sorteio realizado em: {formatDate(draw.drawDate, { withTime: false })}
              </span>
              <DrawDisplay drawnNumbers={draw.drawnNumbers} />
              {draw.accumulated ? (
                <div className="font-semibold text-blue-700 mb-1">Acumulou!</div>
              ) : null}
              <PrizeDisplay prize={draw.prize} />
            </div>
          ) : (
            <div className="mt-5">
              <CheckDrawResult draw={drawData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestGames;
