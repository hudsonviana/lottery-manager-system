import useAuthApiClient from './useAuthApiClient';

const useUserApi = () => {
  const authApiClient = useAuthApiClient();

  const fetchUsers = async () => {
    const response = await authApiClient.get('/users');
    return response.data?.users;
  };

  const fetchUser = async (id) => {
    const response = await authApiClient.get(`/users/${id}`);
    return response.data?.user;
  };

  const addUser = async (userData) => {
    const response = await authApiClient.post('/users', userData);
    console.log('Usuário criado:', response.data);
    return response.data;
  };

  return { fetchUsers, fetchUser, addUser };
};

export default useUserApi;
