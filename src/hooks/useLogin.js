import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { apiClient } from '@/api/apiClient';
import { handleError } from '@/helpers/handleError';
import { useAuth } from './useAuth';

export const useLogin = () => {
  const { setAuth } = useAuth();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    },
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data;
      const { auth } = jwtDecode(accessToken);
      setAuth({ user: auth, accessToken });
      localStorage.setItem('refreshToken', refreshToken);
    },
    onError: (error) => {
      localStorage.removeItem('refreshToken');
      const handledErrorMsg = handleError(error);
      return Promise.reject(handledErrorMsg);
    },
  });
};
