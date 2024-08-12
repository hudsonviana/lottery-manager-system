import axios from 'axios';

export const handleError = (error) => {
  if (!axios.isAxiosError(error)) {
    console.log('Erro desconhecido:', error);
    return { error: ['Erro desconhecido', error] };
  }

  const errorsMsg = [];
  const errors = error.response?.data?.errors;

  if (Array.isArray(errors)) {
    errors.forEach(({ message }) => errorsMsg.push(message));
  } else if (typeof errors === 'object') {
    Object.values(errors).forEach((errArray) => errorsMsg.push(errArray[0]));
  } else if (error.response?.data) {
    errorsMsg.push(error.response.data.error);
  }

  return { error: errorsMsg };
};
