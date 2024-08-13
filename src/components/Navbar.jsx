import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav id="navbar-menu">
      <NavLink to={'/'}>Home</NavLink>
      <NavLink to={'/login'}>Entrar</NavLink>
      <NavLink to={'/register'}>Cadastro</NavLink>
    </nav>
  );
};

export default Navbar;
