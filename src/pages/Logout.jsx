import { useNavigate, useLoaderData } from 'react-router-dom';
import * as jose from 'jose';
import { useEffect } from 'react';

export const checkIsFromShutdown = async ({ params, location }) => {
  const { token } = params;
  const key = location.state?.key;

  if (!token || !key) {
    return false;
  }

  const secretKey = new TextEncoder().encode(key);

  try {
    await jose.jwtVerify(token, secretKey);
    return true;
  } catch (error) {
    return false;
  }
};

const Logout = () => {
  const isFromShutdown = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isFromShutdown) {
      navigate('/', { replace: true });
      return;
    }
  }, [isFromShutdown, navigate]);

  if (!isFromShutdown) return null;

  return <div className="bg-red-900">CloseApp</div>;
};

export default Logout;
