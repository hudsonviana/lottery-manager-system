import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { apiClient } from '@/api/apiClient';
import { handleError } from '@/helpers/handleError';
import { useAuth } from './useAuth';

export const useLogin = () => {
  const { setAuth } = useAuth();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await apiClient.post(
        '/auth/login',
        { email, password },
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (data) => {
      const { accessToken } = data;
      const { auth } = jwtDecode(accessToken);
      setAuth({ user: auth, accessToken });
    },
    onError: (error) => {
      const handledErrorMsg = handleError(error);
      return Promise.reject(handledErrorMsg);
    },
  });
};
