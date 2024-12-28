import { format, getYear } from 'date-fns';
import { pt } from 'date-fns/locale';

const useDate = () => {
  const currentDate = new Date();
  const currentYear = getYear(currentDate);

  const writtenOutDate = format(currentDate, "eeee, dd 'de' MMMM 'de' yyyy", {
    locale: pt,
  });

  return { currentYear, writtenOutDate };
};

export default useDate;
