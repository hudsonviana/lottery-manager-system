import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useGameApi from '@/hooks/useGameApi';
import { useAuth } from '@/hooks/useAuth';
import LoadingLabel from '@/components/LoadingLabel';
import GameDisplay from '@/components/GameDisplay';
import translateLotteryType from '@/helpers/translateLotteryType';
import translateGameResult from '@/helpers/translateGameResult';
import formatDate from '@/helpers/formatDate';

const Game = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const { fetchGame } = useGameApi();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['games', id],
    queryFn: () => fetchGame(auth.user.id, id),
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

  const { game } = data;

  return (
    <div className="container mx-auto py-0">
      <div className="flex gap-0 bg-white border rounded-md p-6 min-h-[calc(100vh-6rem)]">
        <div className="w-2/3">
          <h1 className="text-xl font-semibold my-0">
            {translateLotteryType(game.draw.lotteryType)} - Concurso:{' '}
            {game.draw.contestNumber}
          </h1>
          <div className="text-sm mb-2">
            Aposta cadastrada em: <span>{formatDate(game.createdAt)}</span>
          </div>
          <div className="w-fit">
            <GameDisplay
              gameNumbers={game.gameNumbers}
              drawnNumbers={game.draw.drawnNumbers}
            />
            <div className="mt-4">
              <ul>
                {/* <li>
                Data do sorteio:{' '}
                <span>{formatDate(game.draw.drawDate, { withTime: false })}</span>
              </li>
              <li>
                Apuração do sorteio: <span>{game.draw.status}</span>
              </li> */}
                <li>
                  Valor do jogo:{' '}
                  <span>
                    {game.ticketPrice.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </li>
                <li>
                  Resultado: <span>{translateGameResult(game.result)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full">
          <h1 className="text-xl font-semibold my-0">Apuração</h1>
          <div className="text-sm mb-2">
            Data do sorteio:{' '}
            <span>{formatDate(game.draw.drawDate, { withTime: false })}</span>
          </div>
          <div className="border rounded-md w-full p-4">
            teste
            {/* {JSON.stringify(game)} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
