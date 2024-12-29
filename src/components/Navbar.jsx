import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import * as jose from 'jose';
import { GrClose } from 'react-icons/gr';
import useAppApi from '@/hooks/useAppApi';
import { frontendPort, backendPort } from '@/api/apiClient';
import { handleError } from '@/helpers/handleError';
import useToastAlert from '@/hooks/useToastAlert';
import LoadingLabel from './LoadingLabel';
import useDate from '@/hooks/useDate';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const linkStyles =
  'flex items-center px-3 h-8 hover:bg-neutral-700 hover:no-underline rounded-sm text-base font-semibold';

// const activeLink = ({ isActive }) =>
//   `${linkStyles} ${isActive ? 'bg-neutral-600 text-white' : 'text-sky-400'}`;

const generateRandomString = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const length = 8;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

const Navbar = ({ onHover }) => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const { toastAlert } = useToastAlert();
  const navigate = useNavigate();
  const { writtenOutDate } = useDate();

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover(false);
  };

  const { shutdownApp } = useAppApi();

  const shutdownAppMutation = useMutation({
    mutationFn: (options) => shutdownApp(options),
    onError: async (err) => {
      if (err.code === 'ERR_NETWORK') {
        // const randomKey = generateRandomString();
        // const secretKey = new TextEncoder().encode(randomKey);
        const secretKey = new TextEncoder().encode(writtenOutDate);
        const payload = { frontendPort, backendPort };
        const token = await new jose.SignJWT(payload)
          .setProtectedHeader({ alg: 'HS256' })
          .sign(secretKey);

        // navigate(`/logout/${token}/${randomKey}`, { replace: true });
        navigate(`/logout/${token}`, { replace: true });

        return toastAlert({
          type: 'warning',
          title: 'Aplicação encerrada!',
          message:
            'Para sair do sistema com segurança, feche todas as janelas do seu navegador',
        });
      }

      const { error } = handleError(err);

      toastAlert({
        type: 'danger',
        title: 'Erro ao encerrar a aplicação',
        message: error,
      });
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const isHomePage = location.pathname === '/';

  const activeLink = ({ isActive }) =>
    `${linkStyles} ${
      isHomePage || isActive ? 'text-white shadow-blue' : 'text-sky-400'
    } ${isActive ? 'bg-neutral-600' : ''}`;

  return (
    <nav
      className={`${
        isHomePage ? 'bg-transparent text-white' : 'bg-neutral-900 text-white'
      } h-10 px-4 flex justify-between items-center sticky top-0 z-10 ${
        isHovered ? 'navbar-hover' : ''
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="">
        <span className="text-sky-500 font-semibold italic border-text">SGL</span>
        <span className={`pl-4 ${isHomePage ? 'text-transparent' : ''}`}>
          Sistema de Gerenciamento de Loterias
        </span>
      </div>
      <div className="flex gap-3 items-center">
        <NavLink to={'/'} className={activeLink}>
          Home
        </NavLink>
        <NavLink to={'/login'} className={activeLink}>
          Entrar
        </NavLink>
        <NavLink to={'/register'} className={activeLink}>
          Cadastro
        </NavLink>

        <AlertDialog>
          <AlertDialogTrigger
            variant="ghost"
            className="px-3 h-8 rounded-sm hover:bg-red-500 hover:text-white"
            disabled={shutdownAppMutation.isPending}
          >
            {shutdownAppMutation.isPending ? <LoadingLabel label={null} /> : <GrClose />}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Tem certeza que deseja fechar a aplicação?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Ao confirmar, será necessário iniciar o SGL novamente por meio do
                aplicativo na área de trabalho.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  shutdownAppMutation.mutate({
                    ports: [frontendPort, backendPort],
                    killNode: false,
                  })
                }
              >
                Fechar aplicação
              </AlertDialogAction>
              {/* <AlertDialogAction
                onClick={async () => {
                  const randomKey = generateRandomString();
                  const secretKey = new TextEncoder().encode(randomKey);
                  const payload = { frontendPort, backendPort };
                  const token = await new jose.SignJWT(payload)
                    .setProtectedHeader({ alg: 'HS256' })
                    .sign(secretKey);

                  navigate(`/logout/${token}/${randomKey}`, { replace: true });
                }}
              >
                Teste Fechar
              </AlertDialogAction> */}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </nav>
  );
};

export default Navbar;
