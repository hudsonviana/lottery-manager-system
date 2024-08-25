import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const MainLayout = () => {
  return (
    <div className="h-screen overflow-y-scroll">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
