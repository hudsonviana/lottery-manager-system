import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './useAuth';
import useUserApi from './useUserApi';
import useToastAlert from './useToastAlert';
import { handleError } from '@/helpers/handleError';

const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { toastAlert } = useToastAlert();
  const { signIn } = useUserApi();

  return useMutation({
    mutationFn: (credentials) => signIn(credentials),
    onSuccess: ({ accessToken }) => {
      const { auth } = jwtDecode(accessToken);
      setAuth({ user: auth, accessToken });
      navigate('/dashboard', { replace: true });
    },
    onError: (err) => {
      const { error } = handleError(err);
      toastAlert({ type: 'danger', title: 'Acesso negado!', message: error });
    },
  });
};

export default useLogin;
