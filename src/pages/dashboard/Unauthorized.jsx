import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { HiBan } from 'react-icons/hi';

const Unauthorized = () => {
  const navigate = useNavigate();
  // const location = useLocation();

  // const from = location.state?.from?.pathname || '/dashboard';

  return (
    <div className="min-h-screen flex items-center flex-col justify-center pb-20">
      <h2 className="flex flex-col items-center text-2xl font-bold">
        <span className="text-red-600">
          <HiBan fontSize={40} />
        </span>
        Não autorizado!
      </h2>
      <span className="text-center p-8">
        <p>Você não tem autorização para acessar esta página.</p>
        <p>Contate o administrador do sistema e solicite permissão de acesso.</p>
      </span>

      <div className="flex flex-row mt-5 gap-4">
        <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
        {/* <Button onClick={() => navigate(from, { replace: true })} variant="outline">
          Voltar
        </Button> */}
      </div>
    </div>
  );
};

export default Unauthorized;
