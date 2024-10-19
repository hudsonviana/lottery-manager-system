import { NavLink, useNavigate } from 'react-router-dom';
import {
  DASHBOARD_SIDEBAR_LINKS,
  DASHBOARD_SIDEBAR_BOTTOM_LINKS,
} from '@/consts/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/hooks/useLogout';
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
import { useToast } from '@/hooks/use-toast';
import LoadingLabel from './LoadingLabel';
import { HiOutlineLogout } from 'react-icons/hi';
import { PiCloverFill } from 'react-icons/pi';

const linkClass =
  'flex items-center gap-2 px-3 py-2 hover:bg-neutral-700 hover:no-underline rounded-sm text-base';

const SidebarLink = ({ item }) => {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `${linkClass} ${isActive ? 'bg-neutral-600 text-sky-300' : 'text-white'}`
      }
      end
    >
      <span>{item.icon}</span>
      {item.label}
    </NavLink>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { mutateAsync: signOut, isPending } = useLogout();
  const { toast } = useToast();

  const handleSignOutClick = async () => {
    try {
      const data = await signOut();
      navigate('/login', { state: { data } });
    } catch ({ error }) {
      toast({
        className: 'bg-red-200 text-red-800 border-red-300',
        title: 'Algo deu errado!',
        description: error.map((err, i) => <p key={i}>{err}</p>),
      });
    }
  };

  return (
    <nav className="flex flex-col bg-neutral-900 w-60 p-3 text-white">
      <div className="flex items-center gap-2 px-2 py-3">
        <PiCloverFill fontSize={24} color="green" />
        <span className="text-green-300 text-lg">Gerenciador</span>
      </div>

      <div className="py-6 flex flex-1 flex-col gap-0.5">
        {DASHBOARD_SIDEBAR_LINKS.map((item) => {
          if (item.roles.includes(auth?.user?.role)) {
            return <SidebarLink key={item.key} item={item} />;
          }
        })}
      </div>

      <div className="flex flex-col gap-0.5 pt-2 border-t border-neutral-700">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} />
        ))}

        <AlertDialog>
          <AlertDialogTrigger
            className={`text-red-500 ${linkClass}`}
            disabled={isPending}
          >
            <span>
              <HiOutlineLogout />
            </span>
            {isPending ? <LoadingLabel label={'Saindo'} /> : 'Sair'}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza que deseja sair?</AlertDialogTitle>
              <AlertDialogDescription>
                Ao sair, será necessário fazer o login novamente para acessar o sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleSignOutClick}>
                Sair do sistema
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </nav>
  );
};

export default Sidebar;
