import { apiClient } from '@/api/apiClient';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const { toast } = useToast();

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
        toast({
          className: 'bg-yellow-200 text-yellow-800 border-yellow-300',
          title: 'Sessão expirada!',
          description: 'Faça o login novamente.',
        });
      }
    }
  };
  return refresh;
};

export default useRefreshToken;
