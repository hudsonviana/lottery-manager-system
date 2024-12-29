import { useNavigate, useLoaderData } from 'react-router-dom';
import * as jose from 'jose';
import { useEffect } from 'react';
import useDate from '@/hooks/useDate';

export const checkIsFromShutdown = async ({ params }) => {
  // const { token, key } = params;
  const { token } = params;
  const { writtenOutDate } = useDate();

  // if (!token || !key) return false;
  if (!token) return false;

  // const secretKey = new TextEncoder().encode(key);s
  const secretKey = new TextEncoder().encode(writtenOutDate);

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
