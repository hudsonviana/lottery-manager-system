import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="bg-neutral-100 min-h-screen flex items-center flex-col justify-center pb-20">
      <h1 className="text-red-600 text-2xl font-bold">
        Erro <span>{error.status}</span>
      </h1>
      <h2 className="flex flex-col items-center">
        Sinto muito, ocorreu um erro inesperado.
      </h2>
      <p className="italic">{error.statusText || error.message}</p>
    </div>
  );
};

export default ErrorPage;
