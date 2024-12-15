import { apiClient, apiClientPrivate } from '@/api/apiClient';
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

  const fetchUserGames = async (id) => {
    const response = await authApiClient.get(`/users/${id}/games`);
    return response.data;
  };

  const fetchUserDrawGames = async (id, drawId) => {
    const response = await authApiClient.get(`/users/${id}/draws/${drawId}/games`);
    return response.data;
  };

  const fetchUserDraws = async (id) => {
    const response = await authApiClient.get(`/users/${id}/draws`);
    return response.data;
  };

  const changePassword = async (id, passData) => {
    const response = await authApiClient.post(`/auth/${id}/changepassword`, passData);
    return response.data;
  };

  const registerUser = async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  };

  const signIn = async (credentials) => {
    const response = await apiClientPrivate.post('/auth/login', credentials);
    return response.data;
  };

  const signOut = async (id) => {
    const response = await apiClientPrivate.put('/auth/logout', id);
    return response.data;
  };

  return {
    fetchUsers,
    fetchUser,
    addUser,
    updateUser,
    deleteUser,
    fetchUserGames,
    fetchUserDraws,
    fetchUserDrawGames,
    changePassword,
    registerUser,
    signIn,
    signOut,
  };
};

export default useUserApi;
