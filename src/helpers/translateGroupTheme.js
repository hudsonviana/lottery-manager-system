import { GROUP_THEME } from '@/consts/Enums';

const translateGroupTheme = (theme) =>
  GROUP_THEME.find((groupTheme) => groupTheme.value === theme)?.label || 'Indefinido';

export default translateGroupTheme;
