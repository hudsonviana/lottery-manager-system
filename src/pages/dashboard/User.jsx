import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import translateRole from '@/helpers/translateRole';
import { Button } from '@/components/ui/button';
import useUserApi from '@/hooks/useUserApi';

const User = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { fetchUser } = useUserApi();

  const {
    isPending,
    isError,
    data: user,
    error,
  } = useQuery({
    queryKey: ['users', id],
    queryFn: () => fetchUser(id),
  });

  if (isPending) return <div>Carregando...</div>;
  if (isError) return <div>Ocorreu um erro: {error.message}</div>;

  return (
    <div>
      <div className="flex flex-row">
        <h4 className="mr-1">Nome completo:</h4>{' '}
        <span>
          {user.firstName} {user.lastName}
        </span>
      </div>
      <div className="flex flex-row">
        <h4 className="mr-1">Email:</h4> <span>{user.email}</span>
      </div>
      <div className="flex flex-row">
        <h4 className="mr-1">Perfil:</h4>{' '}
        <span>{translateRole(user.role)}</span>
      </div>

      <Button onClick={() => navigate(-1)}>Voltar</Button>
    </div>
  );
};

export default User;
