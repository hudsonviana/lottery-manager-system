import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useAuth } from './hooks/useAuth';

const Dashboard = () => {
  const { auth } = useAuth();

  return (
    <>
      <div id="sidebar">
        <Sidebar user={auth?.user} />
      </div>

      <div className="detail">
        <Outlet />
      </div>
    </>
  );
};

export default Dashboard;
