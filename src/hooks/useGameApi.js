import useAuthApiClient from './useAuthApiClient';

const useGameApi = () => {
  const authApiClient = useAuthApiClient();

  const fetchGames = async (playerId) => {
    const response = await authApiClient.get(`/games/users/${playerId}`);
    return response.data;
  };

  const fetchGame = async (playerId, id) => {
    const response = await authApiClient.get(`/games/${id}/users/${playerId}`);
    return response.data;
  };

  const addGame = async (playerId, gameData) => {
    const response = await authApiClient.post(`/games/users/${playerId}`, gameData);
    return response.data;
  };

  const updateGame = async (playerId, id, gameData) => {
    const response = await authApiClient.put(`/games/${id}/users/${playerId}`, gameData);
    return response.data;
  };

  const deleteGame = async (playerId, id) => {
    const response = await authApiClient.delete(`/games/${id}/users/${playerId}`);
    return response.data;
  };

  return { fetchGames, fetchGame, addGame, updateGame, deleteGame };
};

export default useGameApi;
