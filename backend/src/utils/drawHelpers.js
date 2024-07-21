export const isUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toISOString();
};

export const validateDateFormat = (date) => {
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(date)) {
    return false;
  }
  const [day, month, year] = date.split('/');
  return !isNaN(Date.parse(`${year}-${month}-${day}`));
};
