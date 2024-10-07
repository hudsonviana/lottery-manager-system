const formatDate = (dateString, { withTime = true } = {}) => {
  const date = new Date(dateString);

  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  if (withTime === true) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return date.toLocaleString('pt-BR', options).replace(',', '');
};

export default formatDate;
