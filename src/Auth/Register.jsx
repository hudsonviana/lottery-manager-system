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
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="grid place-content-center my-8">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Cadastrar usuário</CardTitle>
          <CardDescription>
            Forneça os dados para criar a conta.
          </CardDescription>
        </CardHeader>
        <form>
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
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Sobrenome</Label>
                  <Input
                    id="last-name"
                    name="lastName"
                    placeholder="Sobrenome"
                    required
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
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <Input
                    type="password"
                    id="confirm-password"
                    name="confirmPassword"
                    placeholder="Confirmar senha"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full">
              Cadastrar
            </Button>
            <CardDescription>
              Já tem cadastro?{' '}
              <Link to={'/login'} className="underline">
                Faça o login
              </Link>
            </CardDescription>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
