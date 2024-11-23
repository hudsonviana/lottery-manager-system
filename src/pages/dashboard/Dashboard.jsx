import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import LoadingLabel from '@/components/LoadingLabel';

const Dashboard = ({ isLoading = false }) => {
  return (
    <div className="flex flex-row bg-slate-100 h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <div className="py-4">
          {isLoading ? <LoadingLabel label={'Carregando...'} /> : <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
