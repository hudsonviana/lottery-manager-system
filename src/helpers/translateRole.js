import { USER_ROLES } from '@/consts/Roles';

const translateRole = (role) =>
  USER_ROLES.find((userRole) => userRole.value === role)?.label || 'Indefinido';

export default translateRole;
