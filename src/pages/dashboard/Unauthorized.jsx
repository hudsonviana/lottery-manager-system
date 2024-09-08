import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { HiBan } from 'react-icons/hi';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center flex-col justify-center pb-20">
      <h2 className="flex flex-col items-center text-2xl font-bold">
        <span className="text-red-600 ">
          <HiBan fontSize={40} />
        </span>
        Não autorizado!
      </h2>
      <span className="text-center p-8">
        <p>Você não tem autorização para acessar esta página.</p>
        <p>
          Contate o administrador do sistema e solicite permissão de acesso.
        </p>
      </span>
      <Button asChild>
        <Link to={'/dashboard'}>Voltar</Link>
      </Button>
    </div>
  );
};

export default Unauthorized;
