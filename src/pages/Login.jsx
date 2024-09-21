import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from '@/hooks/useLogin';
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
import { useToast } from '@/hooks/use-toast';

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
          className: 'bg-blue-200 text-blue-800 border-blue-300',
          title: 'Mensagem!',
          description: location.state?.data?.message,
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
        className: 'bg-red-200 text-red-800 border-red-300',
        title: 'Acesso negado!',
        description: error.map((err, i) => <p key={i}>{err}</p>),
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-2.5rem)]">
      <aside
        className="md:w-2/4 w-full"
        // style={{ backgroundImage: 'url(/login.jpg)' }}
      >
        <img
          src="/login.jpg"
          alt="Minha Figura"
          className="w-full h-full object-cover"
        />
      </aside>
      <div className="grid place-content-center w-2/4">
        <form className="w-[400px]" onSubmit={handleFormSubmit}>
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
      </div>
    </div>
  );
};

export default Login;
