import { NavLink } from 'react-router-dom';

const linkClass =
  'flex items-center px-3 h-8 hover:bg-neutral-700 hover:no-underline rounded-sm text-base';

const activeLink = ({ isActive }) =>
  `${linkClass} ${isActive ? 'bg-neutral-600 text-white' : 'text-sky-400'}`;

const Navbar = () => {
  return (
    <nav className="bg-neutral-900 text-white h-10 px-4 flex justify-between items-center">
      <div>
        <span className="text-sky-500 font-semibold italic">SGL</span>
        <span className="pl-4">Sistema de Gerenciamento de Loteria</span>
      </div>
      <div className="flex gap-1">
        <NavLink to={'/'} className={activeLink}>
          Home
        </NavLink>
        <NavLink to={'/login'} className={activeLink}>
          Entrar
        </NavLink>
        <NavLink to={'/register'} className={activeLink}>
          Cadastro
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
