import { useState } from 'react';
import { Link } from 'react-router-dom';
import useLogin from '@/hooks/useLogin.js';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingLabel from '@/components/LoadingLabel';
import useToastAlert from '@/hooks/useToastAlert';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { dismiss } = useToastAlert();
  const signIn = useLogin();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-2.5rem)]">
      <aside className="w-full bg-black">
        <div
          className="bg-muted h-full bg-cover opacity-60"
          style={{
            backgroundImage: 'url(/bolas_mega_sena-transformed.png)',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '125%',
          }}
        ></div>
      </aside>
      <div className="grid place-content-center w-2/4">
        <form className="w-[400px]" onSubmit={(e) => e.preventDefault()}>
          <CardHeader>
            <CardTitle>Acessar Sistema</CardTitle>
            <CardDescription>Entre com o email e senha.</CardDescription>
          </CardHeader>
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
            <Button
              className="w-full"
              onClick={() => {
                dismiss();
                signIn.mutate(credentials);
              }}
              disabled={signIn.isPending}
            >
              {signIn.isPending ? <LoadingLabel label={'Aguarde'} /> : 'Entrar'}
            </Button>
            <CardDescription>
              Não tem cadastro?{' '}
              <Link to={'/register'} className="underline">
                Registre-se
              </Link>
            </CardDescription>
          </CardFooter>
        </form>
      </div>
    </div>
  );
};

export default Login;
