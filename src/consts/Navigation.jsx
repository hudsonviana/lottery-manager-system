import {
  HiOutlineViewGrid,
  HiOutlineKey,
  HiOutlineUsers,
  HiOutlineQuestionMarkCircle,
  HiOutlineCog,
  HiOutlineBookmark,
  HiOutlineIdentification,
  HiOutlineTicket,
  HiOutlineStar,
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
    icon: <HiOutlineIdentification />,
  },
  {
    key: 'users',
    label: 'Usuários',
    path: 'users',
    roles: ['ADMIN'],
    icon: <HiOutlineUsers />,
  },
  {
    key: 'games',
    label: 'Jogos',
    path: 'games',
    roles: ['USER', 'ADMIN'],
    icon: <HiOutlineTicket />,
  },
  {
    key: 'contests',
    label: 'Concursos',
    path: 'contests',
    roles: ['USER', 'ADMIN'],
    icon: <HiOutlineStar />,
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
