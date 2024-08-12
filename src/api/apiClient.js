import axios from 'axios';

const BASE_URL = 'http://localhost:3333/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
});

export const apiClientPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
