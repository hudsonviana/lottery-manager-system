import { LOTTERY_TYPE } from '@/consts/Enums';

const translateLotteryType = (lottery) =>
  LOTTERY_TYPE.find((lotteryType) => lotteryType.value === lottery)?.label ||
  'Indefinido';

export default translateLotteryType;
