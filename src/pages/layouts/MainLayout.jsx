import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import './MainLayout.css';

const MainLayout = () => {
  const { auth } = useAuth();

  return (
    <>
      {!auth?.user && <Navbar />}
      <Outlet />
    </>
  );
};

export default MainLayout;
