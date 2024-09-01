import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiCubeTransparent, HiOutlineLogout } from 'react-icons/hi';
import {
  DASHBOARD_SIDEBAR_LINKS,
  DASHBOARD_SIDEBAR_BOTTOM_LINKS,
} from '@/consts/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/hooks/useLogout';

const linkClass =
  'flex items-center gap-2 px-3 py-2 hover:bg-neutral-700 hover:no-underline rounded-sm text-base';

const SidebarLink = ({ item }) => {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `${linkClass} ${
          isActive ? 'bg-neutral-600 text-white' : 'text-sky-400'
        }`
      }
      end
    >
      <span className="text-xl">{item.icon}</span>
      {item.label}
    </NavLink>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const [errorAlert, setErrorAlert] = useState('');
  const { auth } = useAuth();
  const { mutateAsync: signOut, isPending } = useLogout();

  const handleSignOutClick = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch ({ error }) {
      setErrorAlert(error);
    }
  };

  return (
    <nav className="flex flex-col bg-neutral-900 w-60 p-3 text-white">
      <div className="flex items-center gap-2 px-1 py-3">
        <HiCubeTransparent fontSize={24} color="green" />
        <span className="text-neutral-100 text-lg">Gerenciador</span>
      </div>

      <div className="py-8 flex flex-1 flex-col gap-0.5">
        {DASHBOARD_SIDEBAR_LINKS.map((item) => {
          if (item.roles.includes(auth.user.role)) {
            return <SidebarLink key={item.key} item={item} />;
          }
        })}
      </div>

      <div className="flex flex-col gap-0.5 pt-2 border-t border-neutral-700">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} />
        ))}

        <div className={`text-red-500 ${linkClass}`}>
          <button
            onClick={handleSignOutClick}
            className="flex items-center gap-2"
          >
            <span className="text-xl">
              <HiOutlineLogout />
            </span>
            {isPending ? 'Saindo...' : 'Sair'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
