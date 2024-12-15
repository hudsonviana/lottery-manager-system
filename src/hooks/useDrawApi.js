import lotteryApiClient from '@/api/lotteryApiClient';
import useAuthApiClient from './useAuthApiClient';

const useDrawApi = () => {
  // const authApiClient = useAuthApiClient();

  const fetchDrawResult = async (
    lotteryType = 'megasena',
    contestNumber,
    { prevContest = false } = {}
  ) => {
    if (prevContest === true) contestNumber = Number(contestNumber) - 1;

    try {
      const response = await lotteryApiClient.get(`/${lotteryType}/${contestNumber}`);
      return response.data;
    } catch (error) {
      return error.response;
    }
  };

  const fetchDrawGames = async () => {};

  return { fetchDrawResult, fetchDrawGames };
};

export default useDrawApi;
