import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/apiClient';
import { handleError } from '@/helpers/handleError';
import { useAuth } from './useAuth';

export const useLogout = () => {
  const { auth, setAuth } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const { id } = auth.user;
      const response = await apiClient.put(
        '/auth/logout',
        { id },
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.logout) {
        setAuth({});
      }
    },
    onError: (error) => {
      const handledErrorMsg = handleError(error);
      return Promise.reject(handledErrorMsg);
    },
  });
};
