import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useGameApi from '@/hooks/useGameApi';
import { useAuth } from '@/hooks/useAuth';
import LoadingLabel from '@/components/LoadingLabel';

const Game = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const { fetchGame } = useGameApi();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['games', id],
    queryFn: () => fetchGame(auth.user.id, id),
    staleTime: 1000 * 60 * 2,
  });

  if (isPending) {
    return (
      <div className="flex items-center container mx-auto py-0">
        <LoadingLabel label={'Carregando...'} />
      </div>
    );
  }

  if (isError) return <div>Ocorreu um erro: {error.message}</div>;

  return (
    <div>
      <h1>Dados do Jogo:</h1>
      {JSON.stringify(data)}
    </div>
  );
};

export default Game;
