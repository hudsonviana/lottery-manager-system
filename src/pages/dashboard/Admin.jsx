import useApiPrivate from '@/hooks/useApiPrivate';
import { useState } from 'react';

const Admin = async () => {
  const [users, setUsers] = useState([]);
  const apiPrivate = useApiPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await apiPrivate.get('/users', {
          signal: controller.signal,
        });

        console.log(response);
        isMounted && setUsers(response.data?.users);
      } catch (error) {
        console.log('error:', error);
        // navigate('/login', { state: { from: location }, replace: true });
      }
    };

    getUsers();

    return () => {
      controller.abort();
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <h1>Página do Administrador do Sistema</h1>
      <h2>Lista de Usuários</h2>
    </div>
  );
};

export default Admin;
