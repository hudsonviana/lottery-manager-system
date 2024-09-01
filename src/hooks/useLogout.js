import { useMutation } from '@tanstack/react-query';
import useApiPrivate from './useApiPrivate';
import { handleError } from '@/helpers/handleError';
import { useAuth } from './useAuth';

export const useLogout = () => {
  const { auth, setAuth } = useAuth();
  const apiPrivate = useApiPrivate();

  return useMutation({
    mutationFn: async () => {
      const { id } = auth.user;
      const response = await apiPrivate.put('/auth/logout', { id });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.logout) {
        setAuth({});
      }
    },
    onError: (error) => {
      const handledErrorMsg = handleError(error);
      return Promise.reject(handledErrorMsg);
    },
  });
};
