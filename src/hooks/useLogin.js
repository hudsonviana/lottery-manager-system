import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { apiClientPrivate } from '@/api/apiClient';
import { handleError } from '@/helpers/handleError';
import { useAuth } from './useAuth';
import useToastAlert from './useToastAlert';

const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { toastAlert } = useToastAlert();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await apiClientPrivate.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      const { accessToken } = data;
      const { auth } = jwtDecode(accessToken);
      setAuth({ user: auth, accessToken });
      navigate('/dashboard');
    },
    onError: (err) => {
      const { error } = handleError(err);
      toastAlert({ type: 'danger', title: 'Acesso negado!', message: error });
    },
  });
};

export default useLogin;
