import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const RequireGuest = () => {
  const { auth } = useAuth();
  const location = useLocation();

  return !auth?.user ? (
    <Outlet />
  ) : (
    <Navigate
      to={'/dashboard'}
      state={{
        from: location,
        data: {
          message: 'Usuário já está logado.',
        },
      }}
      replace
    />
  );
};

export default RequireGuest;
