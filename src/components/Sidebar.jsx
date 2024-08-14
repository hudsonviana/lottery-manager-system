import { NavLink } from 'react-router-dom';

const Sidebar = ({ user }) => {
  return (
    <>
      <h1>Gerenciador de Apostas</h1>

      <div>Dashboard: Olá, {user?.firstName}!</div>

      <nav>
        <NavLink to={'/dashboard'} end>
          Dashboard
        </NavLink>
        <NavLink to={'/dashboard/profile'}>Perfil</NavLink>
      </nav>
    </>
  );
};

export default Sidebar;
