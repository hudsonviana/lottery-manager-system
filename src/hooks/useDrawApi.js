import axios from 'axios';
// import useAuthApiClient from './useAuthApiClient';

const useDrawApi = () => {
  // const authApiClient = useAuthApiClient();

  const fetchDrawResult = async (lotteryType = 'megasena', contestNumber) => {
    try {
      const response = await axios.get(
        `https://servicebus2.caixa.gov.br/portaldeloterias/api/${lotteryType}/${contestNumber}`
      );
      return response.data;
    } catch (error) {
      return error.response;
    }
  };

  return { fetchDrawResult };
};

export default useDrawApi;
