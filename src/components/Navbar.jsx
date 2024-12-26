import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const linkStyles =
  'flex items-center px-3 h-8 hover:bg-neutral-700 hover:no-underline rounded-sm text-base font-semibold';

// const activeLink = ({ isActive }) =>
//   `${linkStyles} ${isActive ? 'bg-neutral-600 text-white' : 'text-sky-400'}`;

const Navbar = ({ onHover }) => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover(false);
  };

  const isHomePage = location.pathname === '/';

  const activeLink = ({ isActive }) =>
    `${linkStyles} ${isHomePage || isActive ? 'text-white shadow-blue' : 'text-sky-400'} ${
      isActive ? 'bg-neutral-600' : ''
    }`;

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
