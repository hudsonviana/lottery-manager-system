import {
  HiOutlineSearch,
  HiOutlineChatAlt,
  HiOutlineBell,
} from 'react-icons/hi';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const { auth } = useAuth();

  return (
    <div className="bg-white h-16 px-4 flex justify-between items-center">
      <div className="relative">
        <HiOutlineSearch
          fontSize={20}
          className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
        />
        <input
          type="text"
          className="text-sm focus:outline-none active:outline-none h-10 w-[24rem] border border-gray-300 rounded-sm pl-11 pr-4"
          placeholder="Search"
        />
      </div>
      <div className="flex items-center gap-2 mr-2">
        <span className="flex items-center">Olá, {auth.user.firstName}</span>
        <HiOutlineChatAlt fontSize={24} />
        <HiOutlineBell fontSize={24} />
      </div>
    </div>
  );
};

export default Header;
