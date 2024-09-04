import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <div>
      <h3>Não autorizado</h3>
      <p>Você não tem autorização para acessar esta página.</p>
      <Button onClick={goBack}>Voltar</Button>
    </div>
  );
};

export default Unauthorized;
