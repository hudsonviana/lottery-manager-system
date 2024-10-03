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
    return response.data;
  };

  const updateUser = async (id, userData) => {
    const response = await authApiClient.put(`/users/${id}`, userData);
    return response.data;
  };

  const deleteUser = async (id) => {};

  return { fetchUsers, fetchUser, addUser, updateUser, deleteUser };
};

export default useUserApi;
