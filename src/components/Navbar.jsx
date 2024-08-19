import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav id="navbar-menu">
      <div id="nav-logo">
        SGL<p>&nbsp;&nbsp;Sistema de Gerenciamento de Loteria</p>
      </div>
      <div id="nav-links">
        <NavLink to={'/'}>Home</NavLink>
        <NavLink to={'/login'}>Entrar</NavLink>
        <NavLink to={'/register'}>Cadastro</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
