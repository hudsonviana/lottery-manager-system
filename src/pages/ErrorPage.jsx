import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div id="error-page">
      <h1>Ocorreu um erro!</h1>
      <p>Sinto muito, ocorreu um erro inesperado.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
};

export default ErrorPage;
