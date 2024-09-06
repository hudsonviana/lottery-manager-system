import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const Dashboard = ({ isLoading = false }) => {
  return (
    <div className="flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-4">
          {isLoading ? <p>Carregando...</p> : <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
