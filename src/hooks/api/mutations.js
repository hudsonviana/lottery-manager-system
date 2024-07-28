import { useMutation } from '@tanstack/react-query';
import { login } from './api';

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials) => login(credentials),
    // onSuccess: (data) => {
    //   console.log('success do mutation:', data);
    // },
    // onSettled: (data) => {
    //   console.log('setteld do mutation:', data);
    // },
  });
};
