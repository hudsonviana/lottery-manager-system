const translateRole = (role) => {
  const roles = {
    ADMIN: 'Administrador',
    USER: 'Usuário',
  };
  return roles[role] || 'Indefinido';
};

export default translateRole;
