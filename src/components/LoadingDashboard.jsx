// import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const LoadingDashboard = () => {
  return (
    <div className="flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-4">
          {/* <Outlet /> */}
          <p>Carregando...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingDashboard;
