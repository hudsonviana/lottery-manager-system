import useAuthApiClient from './useAuthApiClient';

const useUserApi = () => {
  const authApiClient = useAuthApiClient();

  const fetchUsers = async () => {
    const response = await authApiClient.get('/users');
    return response.data.users;
  };

  const fetchUser = async (id) => {
    const response = await authApiClient.get(`/users/${id}`);
    return response.data.user;
  };

  const addUser = async (userData) => {
    const response = await authApiClient.post('/users', userData);
    return response.data;
  };

  const updateUser = async (id, userData) => {
    const response = await authApiClient.put(`/users/${id}`, userData);
    return response.data;
  };

  const deleteUser = async (id) => {
    const response = await authApiClient.delete(`/users/${id}`);
    return response.data;
  };

  const changePassword = async (id, passData) => {
    const response = await authApiClient.post(
      `/auth/${id}/changepassword`,
      passData
    );
    return response.data;
  };

  // const registerUser = async (userData) => {};

  return {
    fetchUsers,
    fetchUser,
    addUser,
    updateUser,
    deleteUser,
    changePassword,
  };
};

export default useUserApi;
