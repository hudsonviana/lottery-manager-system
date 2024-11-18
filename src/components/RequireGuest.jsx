import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import useToastAlert from '@/hooks/useToastAlert';

const RequireGuest = () => {
  const { auth } = useAuth();
  const { toastAlert } = useToastAlert();

  if (auth?.user) {
    toastAlert({
      type: 'warning',
      title: 'Alerta',
      message: 'Usuário logado. Saia da aplicação para acessar a página solicitada.',
    });
    return <Navigate to={'/dashboard'} replace />;
  }

  return <Outlet />;
};

export default RequireGuest;
