import { useEffect } from 'react';
import { apiClientPrivate } from '@/api/apiClient';
import useRefreshToken from './useRefreshToken';
import { useAuth } from './useAuth';

const useApiPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = apiClientPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = apiClientPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return apiClientPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiClientPrivate.interceptors.request.eject(requestIntercept);
      apiClientPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return apiClientPrivate;
};

export default useApiPrivate;
