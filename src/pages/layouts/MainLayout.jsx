import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="px-0 py-0">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
