import { apiClient } from '@/api/apiClient';
import { useAuth } from './useAuth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await apiClient.get('/auth/refresh', {
      withCredentials: true,
    });
    const { accessToken } = response.data;
    setAuth((prev) => ({ ...prev, accessToken }));
    return accessToken;
  };
  return refresh;
};

export default useRefreshToken;