import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { apiClientPrivate } from '@/api/apiClient';
import { handleError } from '@/helpers/handleError';
import { useToast } from './use-toast';
import { useAuth } from './useAuth';

const useLogin = () => {
  const { setAuth } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
      toast({
        className: 'bg-red-200 text-red-800 border-red-300',
        title: 'Acesso negado!',
        description: error.map((errMsg, index) =>
          React.createElement('p', { key: index }, errMsg)
        ),
      });
    },
  });
};

export default useLogin;
