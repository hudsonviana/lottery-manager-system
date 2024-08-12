import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { login } from './apiFunctions';
import { useAuth } from '../useAuth';

export const useLogin = () => {
  const { setAuth } = useAuth();

  return useMutation({
    mutationFn: ({ email, password }) => login({ email, password }),
    onSuccess: (data) => {
      if (!data.error) {
        const { accessToken, refreshToken } = data;
        const decoded = jwtDecode(accessToken);
        const user = decoded.auth;

        setAuth({ user, accessToken });
        localStorage.setItem('refreshToken', refreshToken);
      } else {
        localStorage.removeItem('refreshToken');
      }
    },
    onSettled: (data) => {},
  });
};
