import axios from 'axios';

const lotteryApiClient = axios.create({
  baseURL: 'https://servicebus2.caixa.gov.br/portaldeloterias/api',
});

export default lotteryApiClient;
