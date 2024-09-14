import {
  HiOutlineViewGrid,
  HiOutlineKey,
  HiOutlineUser,
  HiOutlineUsers,
  HiOutlineQuestionMarkCircle,
  HiOutlineCog,
} from 'react-icons/hi';

export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    roles: ['USER', 'ADMIN'],
    icon: <HiOutlineViewGrid />,
  },
  {
    key: 'profile',
    label: 'Perfil',
    path: 'profile',
    roles: ['USER', 'ADMIN'],
    icon: <HiOutlineUser />,
  },
  {
    key: 'users',
    label: 'Gerenciar usuários',
    path: 'users',
    roles: ['ADMIN'],
    icon: <HiOutlineUsers />,
  },
  {
    key: 'admin',
    label: 'Admin',
    path: 'admin',
    roles: ['ADMIN'],
    icon: <HiOutlineKey />,
  },
];

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  {
    key: 'settings',
    label: 'Configurações',
    path: 'settings',
    icon: <HiOutlineCog />,
  },
  {
    key: 'support',
    label: 'Ajuda',
    path: 'support',
    icon: <HiOutlineQuestionMarkCircle />,
  },
];
