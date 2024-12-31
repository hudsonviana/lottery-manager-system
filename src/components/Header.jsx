import { useAuth } from '@/hooks/useAuth';
import Breadcrumb from './Breadcrumb';

const Header = () => {
  const { auth } = useAuth();

  return (
    <div className="bg-white h-11 px-4 flex justify-between items-center shadow-sm sticky top-0">
      <div className="relative">
        <span>
          <Breadcrumb />
        </span>
      </div>
      <div className="flex items-center gap-2 mr-2">
        <span className="flex items-center">Olá, {auth?.user?.firstName}!</span>
      </div>
    </div>
  );
};

export default Header;
