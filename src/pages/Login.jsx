import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '@/hooks/useLogin';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorAlert, setErrorAlert] = useState('');
  const { mutateAsync: signIn, isPending } = useLogin();

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorAlert('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    try {
      await signIn({ email, password });
      navigate('/dashboard');
    } catch ({ error }) {
      setErrorAlert(error);
    }
  };

  return (
    <div className="grid place-content-center my-8">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Acessar Sistema</CardTitle>
          <CardDescription>Entre com o email e senha.</CardDescription>
        </CardHeader>
        <form onSubmit={handleFormSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Senha"
                  autoComplete="current-password"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Aguarde...' : 'Entrar'}
            </Button>
            <CardDescription>
              Não tem cadastro?{' '}
              <Link to={'/register'} className="underline">
                Registre-se
              </Link>
            </CardDescription>
          </CardFooter>
        </form>
      </Card>

      {errorAlert && (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acesso negado</AlertTitle>
          <AlertDescription>
            {errorAlert.map((errorMsg, index) => (
              <p key={index}>• {errorMsg}</p>
            ))}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default Login;
