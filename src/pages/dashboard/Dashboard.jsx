import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  DASHBOARD_SIDEBAR_LINKS,
  DASHBOARD_SIDEBAR_BOTTOM_LINKS,
} from '@/consts/Navigation';

const Dashboard = ({ isLoading = false }) => {
  const location = useLocation();

  // Function to find the label based on the current path
  const getCurrentLabel = () => {
    const allLinks = [
      ...DASHBOARD_SIDEBAR_LINKS,
      ...DASHBOARD_SIDEBAR_BOTTOM_LINKS,
    ];
    const currentLink = allLinks.find(
      (link) => link.path === location.pathname.replace('/dashboard/', '')
    );
    return currentLink ? currentLink.label : 'Dashboard';
  };

  return (
    <div className="flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1">
        <Header label={getCurrentLabel()} />
        <div className="p-4">
          {isLoading ? <p>Carregando...</p> : <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
