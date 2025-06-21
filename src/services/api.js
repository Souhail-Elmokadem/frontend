import axios from 'axios';

const api = axios.create({
  baseURL: 'https://scanlink.laprophan.com/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

export const getCsrfToken = async () => {
  await api.get('/sanctum/csrf-cookie');
};

export const login = async (credentials) => {
  await getCsrfToken();
  return api.post('/sanctum/token', credentials);
};

export const getUsers = async () => {
  await getCsrfToken();
  return api.get('/utilisateurs');
};

export const createUser = async (userData) => {
  await getCsrfToken();
  return api.post('/utilisateurs', userData);
};

export const updateUser = async (id, userData) => {
  await getCsrfToken();
  return api.put(`/utilisateurs/${id}`, userData);
};

export const deleteUser = async (id) => {
  await getCsrfToken();
  return api.delete(`/utilisateurs/${id}`);
};