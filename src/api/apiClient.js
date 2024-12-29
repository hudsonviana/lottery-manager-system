import axios from 'axios';

export const frontendPort = 4173;
export const backendPort = 3333;

const BASE_URL = `http://localhost:${backendPort}/api`;

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
