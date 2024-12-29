// import * as jose from 'jose';
import { useNavigate, useLoaderData } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
// import useDate from '@/hooks/useDate';

// export const checkIsFromShutdown = async ({ params }) => {
//   const { token } = params;
//   const { currentDateTime } = useDate();

//   if (!token) return false;

//   const secretKey = new TextEncoder().encode(currentDateTime);

//   try {
//     await jose.jwtVerify(token, secretKey);
//     return true;
//   } catch (error) {
//     return false;
//   }
// };

const LogoutPage = () => {
  const isFromShutdown = useLoaderData();
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    if (!isFromShutdown) {
      navigate(`${auth.user ? '/dashboard' : '/'}`, { replace: true });
      return;
    }
  }, [isFromShutdown, navigate]);

  if (!isFromShutdown) {
    return <div>{null}</div>;
  }

  return <div className="bg-red-950 text-white">CloseApp</div>;
};

export default LogoutPage;
