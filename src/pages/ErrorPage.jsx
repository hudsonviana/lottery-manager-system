import { useRouteError, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FaRegFrown } from 'react-icons/fa';

const ErrorPage = () => {
  const error = useRouteError();
  const location = useLocation();

  return (
    <div className="bg-neutral-100 min-h-screen flex items-center flex-col justify-center pb-20">
      <span className="text-red-600 mb-5">
        <FaRegFrown fontSize={40} />
      </span>
      <h1 className="mb-5">
        <span className="text-lg font-bold">{error.status}.</span> Sinto muito,
        ocorreu um erro.
      </h1>
      {error.status === 404 ? (
        <p>
          A URL <span className="font-mono">{location.pathname}</span> não foi
          encontrada no servidor.
        </p>
      ) : (
        <p className="italic">{error.statusText || error.message}</p>
      )}

      <Button asChild className="mt-5">
        <Link to={'/'}>Página inicial</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
