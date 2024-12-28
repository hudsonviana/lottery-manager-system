import { apiClient } from '@/api/apiClient';

const useAppApi = () => {
  const shutdownApp = async (options) => {
    const response = await apiClient.post('/app/shutdown', options);
    return response.data;
  };

  return { shutdownApp };
};

export default useAppApi;
