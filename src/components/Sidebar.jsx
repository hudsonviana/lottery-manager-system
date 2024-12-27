import { NavLink } from 'react-router-dom';
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
import LoadingLabel from './LoadingLabel';
import { HiOutlineLogout } from 'react-icons/hi';
import { PiCloverFill } from 'react-icons/pi';

const linkStyles =
  'flex items-center gap-2 px-3 py-2 hover:bg-neutral-100 hover:text-blue-900 hover:no-underline rounded-sm font-semibold';

const SidebarLink = ({ item }) => {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `${linkStyles} ${isActive ? 'bg-neutral-300 text-blue-900' : 'text-white'}`
      }
      end
    >
      <span className="text-lg">{item.icon}</span>
      <span className="text-sm">{item.label}</span>
    </NavLink>
  );
};

const Sidebar = () => {
  const { auth } = useAuth();
  const signOut = useLogout();

  return (
    <nav className="flex flex-col bg-gray-800 w-60 p-3 text-white z-10 border-e border-e-slate-200">
      <div className="flex items-center gap-2 px-2">
        <PiCloverFill fontSize={24} className="text-green-500" />
        <span className="text-green-500 font-bold">Sistema de Loterias</span>
      </div>

      <div className="py-6 flex flex-1 flex-col gap-0.5">
        {DASHBOARD_SIDEBAR_LINKS.map((item) => {
          if (item.roles.includes(auth?.user?.role)) {
            return <SidebarLink key={item.key} item={item} />;
          }
        })}
      </div>

      <div className="flex flex-col gap-0.5 pt-2 border-t border-neutral-300">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} />
        ))}

        <AlertDialog>
          <AlertDialogTrigger
            className={`text-red-500 ${linkStyles}`}
            disabled={signOut.isPending}
          >
            <span>
              <HiOutlineLogout />
            </span>
            {signOut.isPending ? <LoadingLabel label={'Saindo'} /> : 'Sair'}
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
              <AlertDialogAction onClick={() => signOut.mutate(auth.user.id)}>
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
