import { useRouteError, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FaRegFrown } from 'react-icons/fa';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="bg-neutral-100 min-h-screen flex items-center flex-col justify-center pb-20">
      <span className="text-red-600 mb-5">
        <FaRegFrown fontSize={40} />
      </span>

      <h1 className="mb-5">Sinto muito, ocorreu um erro.</h1>

      {error.status && (
        <span className="text-lg font-bold mb-5">{error.status}</span>
      )}

      {error.status === 404 ? (
        <p>
          A URL <span className="font-mono">{location.pathname}</span> não foi
          encontrada no servidor.
        </p>
      ) : (
        <p className="italic">{error.statusText || error.message}</p>
      )}

      <div className="flex flex-row mt-5 gap-4">
        <Button onClick={() => navigate('/')}>Página inicial</Button>
        <Button onClick={() => navigate(-1)} variant="outline">
          Voltar
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
