import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import useUserApi from './useUserApi';
import useToastAlert from './useToastAlert';
import { handleError } from '@/helpers/handleError';

export const useLogout = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const { toastAlert } = useToastAlert();
  const { signOut } = useUserApi();

  return useMutation({
    mutationFn: (id) => signOut({ id }),
    onSuccess: ({ logout }) => {
      setAuth({});
      localStorage.clear();
      navigate('/login', { replace: true });
      toastAlert({ type: 'success', title: 'Até breve!', message: logout });
    },
    onError: (err) => {
      const { error } = handleError(err);
      toastAlert({ type: 'danger', title: 'Erro ao sair da aplicação!', message: error });
    },
  });
};
