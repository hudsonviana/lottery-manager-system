import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '@/hooks/api/mutations';
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
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errorAlert, setErrorAlert] = useState('');
  const { mutateAsync: login, isPending } = useLogin();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setErrorAlert('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const data = await login(credentials);

    if (data.error) {
      setErrorAlert([data.error]);
    } else if (data.errors) {
      setErrorAlert(data.errors.map((error) => error.message));
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
              Entrar
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
          <AlertTitle>Erro</AlertTitle>
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
