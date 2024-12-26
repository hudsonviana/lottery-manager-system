import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useState } from 'react';

const MainLayout = () => {
  const [navbarHovered, setNavbarHovered] = useState(false);

  return (
    <div className={`h-screen overflow-y-scroll ${navbarHovered ? 'hero-hover' : ''}`}>
      <Navbar onHover={setNavbarHovered} />
      <Outlet />
    </div>
  );
};

export default MainLayout;
