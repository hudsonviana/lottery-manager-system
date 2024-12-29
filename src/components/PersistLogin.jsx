import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRefreshToken from '@/hooks/useRefreshToken';
import { useAuth } from '@/hooks/useAuth';
import LoadingLabel from './LoadingLabel';

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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingLabel label={''} loaderIconSize="h-12 w-12" />
      </div>
    );
  }

  return <Outlet />;
};

export default PersistLogin;
