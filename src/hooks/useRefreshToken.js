import { apiClient } from '@/api/apiClient';
import { useAuth } from './useAuth';
import useToastAlert from './useToastAlert';

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const { toastAlert } = useToastAlert();

  const refresh = async () => {
    try {
      const response = await apiClient.get('/auth/refresh', {
        withCredentials: true,
      });
      const { accessToken, auth } = response.data;
      setAuth({ user: auth, accessToken });
      return accessToken;
    } catch (error) {
      if (error?.response?.data?.error === 'Refresh Token inválido') {
        toastAlert({
          type: 'warning',
          title: 'Sessão expirada!',
          message: 'Sua sessão expirou. Por favor, faça login novamente para continuar.',
        });
      }
    }
  };
  return refresh;
};

export default useRefreshToken;
