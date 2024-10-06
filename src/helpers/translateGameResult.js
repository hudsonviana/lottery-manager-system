import { GAME_RESULT } from '@/consts/Enums';

const translateGameResult = (result) =>
  GAME_RESULT.find((gameResult) => gameResult.value === result)?.label ||
  'Indefinido';

export default translateGameResult;
