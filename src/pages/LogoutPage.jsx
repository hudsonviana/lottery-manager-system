import { useNavigate, useLoaderData } from 'react-router-dom';
import { useEffect } from 'react';
import { PiCloverFill } from 'react-icons/pi';
import { Button } from '@/components/ui/button';
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

const LogoutPage = () => {
  const isFromShutdown = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isFromShutdown) {
      navigate('/', { replace: true });
      return;
    }
  }, [isFromShutdown, navigate]);

  if (!isFromShutdown) {
    return <div>{null}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500 text-white">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
        <div className="w-full flex items-center justify-center mb-3">
          <div className="flex items-center gap-2 px-2">
            <PiCloverFill fontSize={30} className="text-green-600" />
            <span className="text-green-600 font-bold text-2xl">SiGALF</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Aplicação encerrada!</h1>
        <p className="mt-4 text-gray-600">
          Obrigado por usar nosso sistema para cadastramento e conferência de apostas na
          loteria federal.
        </p>
        <p className="mt-2 text-gray-600">
          Esperamos vê-lo novamente em breve. Boa sorte em suas apostas!
        </p>
        <p className="mt-2 text-gray-600">
          Para uma maior segurança, feche todas as janelas do seu navegador.
        </p>
      </div>

      <div className="mt-5">
        <small className="text-neutral-100">
          Quer retornar ao sistema?
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="link" className="px-1 py-0 font-normal text-neutral-100">
                Clique aqui
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Como iniciar o SiGALF</AlertDialogTitle>
                <AlertDialogDescription>
                  Na área de trabalho, clique no ícone com a logo do SiGALF.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                {/* <AlertDialogCancel>OK</AlertDialogCancel> */}
                <AlertDialogAction>OK</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          e saiba como.
        </small>
      </div>
    </div>
  );
};

export default LogoutPage;
