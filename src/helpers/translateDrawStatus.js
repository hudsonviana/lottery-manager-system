import { DRAW_STATUS } from '@/consts/Enums';

const translateDrawStatus = (status) =>
  DRAW_STATUS.find((drawStatus) => drawStatus.value === status)?.label ||
  'Indefinido';

export default translateDrawStatus;
