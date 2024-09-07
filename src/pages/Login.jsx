import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import { useToast } from '@/hooks/use-toast';
import ToastAlert from '@/components/ToastAlert';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { mutateAsync: signIn, isPending } = useLogin();

  const { toast, dismiss } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const showToast = () => {
      if (location.state?.data?.message) {
        toast({
          description: (
            <ToastAlert
              data={location.state?.data.message}
              type="info"
              title="Mensagem!"
            />
          ),
        });
      }
    };
    showToast();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    try {
      await signIn({ email, password });
      dismiss();
      navigate('/dashboard');
    } catch ({ error }) {
      toast({
        description: (
          <ToastAlert data={error} type="error" title="Acesso negado!" />
        ),
      });
    }
  };

  return (
    <div className="grid place-content-center">
      <Card className="w-[400px]">
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
    </div>
  );
};

export default Login;
