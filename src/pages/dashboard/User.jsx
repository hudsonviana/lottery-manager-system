import useApiPrivate from '@/hooks/useApiPrivate';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import translateRole from '@/helpers/translateRole';

const User = () => {
  const { id } = useParams();

  const apiPrivate = useApiPrivate();

  const {
    isPending,
    isError,
    data: user,
    error,
  } = useQuery({
    queryKey: ['users', id],
    queryFn: async () => (await apiPrivate.get(`/users/${id}`)).data?.user,
  });

  if (isPending) return <div>Carregando...</div>;
  if (isError) return <div>Ocorreu um erro: {error.message}</div>;

  return (
    <div>
      <div className="flex flex-row">
        <h4 className="mr-1">Nome completo:</h4>{' '}
        <span>
          {user.firstName} {user.firstName}
        </span>
      </div>
      <div className="flex flex-row">
        <h4 className="mr-1">Email:</h4> <span>{user.email}</span>
      </div>
      <div className="flex flex-row">
        <h4 className="mr-1">Perfil:</h4>{' '}
        <span>{translateRole(user.role)}</span>
      </div>
    </div>
  );
};

export default User;
