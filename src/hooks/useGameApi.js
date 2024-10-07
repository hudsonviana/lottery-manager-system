import useAuthApiClient from './useAuthApiClient';

const useGameApi = () => {
  const authApiClient = useAuthApiClient();

  const addGame = async (playerId, gameData) => {
    const response = await authApiClient.post(
      `/users/${playerId}/games`,
      gameData
    );
    return response.data;
  };

  return { addGame };
};

export default useGameApi;
