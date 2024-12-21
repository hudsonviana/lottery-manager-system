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

  const updateDraw = async ({ contestNumber, drawData }) => {
    const response = await authApiClient.put(`/draws/${contestNumber}`, drawData);
    return response.data;
  };

  return { fetchDrawResult, updateDraw };
};

export default useDrawApi;
