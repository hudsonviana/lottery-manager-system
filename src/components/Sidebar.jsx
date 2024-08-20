import { NavLink } from 'react-router-dom';
import { HiOutlineLogout } from 'react-icons/hi';
import { FcApproval } from 'react-icons/fc';
import {
  DASHBOARD_SIDEBAR_LINKS,
  DASHBOARD_SIDEBAR_BOTTOM_LINKS,
} from '@/consts/Navigation';
import { useAuth } from '@/hooks/useAuth';

const linkClass =
  'flex items-center gap-2 px-3 py-2 hover:bg-neutral-700 hover:no-underline rounded-sm text-base';

const Sidebar = () => {
  const { auth } = useAuth();

  return (
    <nav className="flex flex-col bg-neutral-900 w-60 p-3 text-white">
      <div className="flex items-center gap-2 px-1 py-3">
        <FcApproval fontSize={24} />
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
        <div className={`text-red-500 cursor-pointer ${linkClass}`}>
          <span className="text-xl">
            <HiOutlineLogout />
          </span>
          Sair
        </div>
      </div>
    </nav>
  );
};

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

export default Sidebar;
