import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import useToastAlert from '@/hooks/useToastAlert';

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();
  const { toastAlert } = useToastAlert();

  if (!auth?.user) {
    toastAlert({
      type: 'warning',
      title: 'Alerta',
      message: 'É necessário fazer o login para acessar a página solicitada',
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(auth.user.role)) {
    return <Navigate to="unauthorized" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
