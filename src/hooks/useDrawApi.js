import lotteryApiClient from '@/api/lotteryApiClient';
import useAuthApiClient from './useAuthApiClient';

const useDrawApi = () => {
  const authApiClient = useAuthApiClient();

  const fetchDrawResult = async (
    lotteryType = 'megasena',
    contestNumber,
    { prevContest = false } = {}
  ) => {
    if (prevContest) contestNumber = Number(contestNumber) - 1;

    try {
      const response = await lotteryApiClient.get(`/${lotteryType}/${contestNumber}`);
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const fetchDrawsOfUser = async (playerId) => {
    const response = await authApiClient.get(`/draws/users/${playerId}`);
    return response.data;
  };

  const updateDraw = async ({ contestNumber, drawData }) => {
    const response = await authApiClient.put(`/draws/${contestNumber}`, drawData);
    return response.data;
  };

  const deleteDraw = async (id) => {
    const response = await authApiClient.delete(`/draws/${id}`);
    return response.data;
  };

  return { fetchDrawResult, fetchDrawsOfUser, updateDraw, deleteDraw };
};

export default useDrawApi;
