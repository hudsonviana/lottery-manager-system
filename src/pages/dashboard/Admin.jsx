import useApiPrivate from '@/hooks/useApiPrivate';
import { useEffect, useState } from 'react';

const Admin = () => {
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

        // console.log(response);
        isMounted && setUsers(response.data?.users);
      } catch (error) {
        // console.log('error:', error);
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
      <div>
        {users.map((user) => (
          <p key={user.firstName}>{user.firstName}</p>
        ))}
      </div>
    </div>
  );
};

export default Admin;
