import useAuthApiClient from './useAuthApiClient';

const useGameApi = () => {
  const authApiClient = useAuthApiClient();

  const fetchGame = async (playerId, id) => {
    const response = await authApiClient.get(`/users/${playerId}/games/${id}`);
    return response.data;
  };

  const addGame = async (playerId, gameData) => {
    const response = await authApiClient.post(`/users/${playerId}/games`, gameData);
    return response.data;
  };

  const deleteGame = async (playerId, id) => {
    const response = await authApiClient.delete(`/users/${playerId}/games/${id}`);
    return response.data;
  };

  return { fetchGame, addGame, deleteGame };
};

export default useGameApi;
