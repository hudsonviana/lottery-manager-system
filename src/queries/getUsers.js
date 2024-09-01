import { useQuery } from '@tanstack/react-query';
import useApiPrivate from '@/hooks/useApiPrivate';

export const getUsers = () => {
  const apiPrivate = useApiPrivate();

  return useQuery({
    queryFn: async () => {
      const response = await apiPrivate.get('/users');
      return response.data;
    },
    queryKey: ['getAllUsers'],
  });
};
