import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRefreshToken from '@/hooks/useRefreshToken';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/pages/dashboard/Dashboard';

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        // console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  return <>{isLoading ? <Dashboard isLoading={true} /> : <Outlet />}</>;
};

export default PersistLogin;
