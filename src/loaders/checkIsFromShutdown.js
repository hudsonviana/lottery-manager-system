import * as jose from 'jose';
import useDate from '@/hooks/useDate';

export const checkIsFromShutdown = async ({ params }) => {
  const { token } = params;
  const { currentDateTime } = useDate();

  if (!token) return false;

  const secretKey = new TextEncoder().encode(currentDateTime);

  try {
    await jose.jwtVerify(token, secretKey);
    return true;
  } catch (error) {
    return false;
  }
};
