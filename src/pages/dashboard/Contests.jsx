import { useAuth } from '@/hooks/useAuth';
import useUserApi from '@/hooks/useUserApi';
import { useQuery } from '@tanstack/react-query';

const Contests = () => {
  const { auth } = useAuth();
  const { fetchUserDraws } = useUserApi();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['contests'],
    queryFn: () => fetchUserDraws(auth.user.id),
    // staleTime: 1000 * 60,
  });

  console.log(data);

  return <div>Contests</div>;
};

export default Contests;
