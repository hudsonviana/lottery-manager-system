import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
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
import { Link } from 'react-router-dom';
import { handleError } from '@/helpers/handleError';
import useUserApi from '@/hooks/useUserApi';
import LoadingLabel from '@/components/LoadingLabel';
import useLogin from '@/hooks/useLogin';
import useToastAlert from '@/hooks/useToastAlert';

const Register = () => {
  const { registerUser } = useUserApi();
  const { toastAlert } = useToastAlert();
  const signIn = useLogin();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const registerUserMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: ({ userRegistered }) => {
      const { email, password } = formData;
      signIn.mutate({ email, password });
      toastAlert({
        type: 'success',
        title: 'Novo usuário registrado!',
        message: `Seja bem-vindo (ou vinda), ${userRegistered.firstName}!`,
      });
    },
    onError: (err) => {
      const { error } = handleError(err);
      toastAlert({
        type: 'danger',
        title: 'Erro ao registrar usuário!',
        message: error,
      });
    },
  });

  return (
    <div className="flex min-h-[calc(100vh-2.5rem)]">
      <aside
        className="grid place-content-center bg-sky-600 w-2/4 bg-cover bg-center"
        style={{ backgroundImage: 'url(/register4.jpg)' }}
      ></aside>

      <div className="grid place-content-center w-2/4">
        <form className="w-[400px]" onSubmit={(e) => e.preventDefault()}>
          <CardHeader>
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>Forneça os dados para criar a conta.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">Nome</Label>
                  <Input
                    id="first-name"
                    name="firstName"
                    placeholder="Nome"
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Sobrenome</Label>
                  <Input
                    id="last-name"
                    name="lastName"
                    placeholder="Sobrenome"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Senha"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <Input
                    type="password"
                    id="confirm-password"
                    name="confirmPassword"
                    placeholder="Confirmar senha"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              className="w-full"
              onClick={() => registerUserMutation.mutate(formData)}
              disabled={registerUserMutation.isPending}
            >
              {registerUserMutation.isPending ? (
                <LoadingLabel label={'Aguarde'} />
              ) : (
                'Registrar'
              )}
            </Button>
            <CardDescription>
              Já tem cadastro?{' '}
              <Link to={'/login'} className="underline">
                Faça o login
              </Link>
            </CardDescription>
          </CardFooter>
        </form>
      </div>
    </div>
  );
};

export default Register;
