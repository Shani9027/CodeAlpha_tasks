import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const client = axios.create({ baseURL: API_BASE, withCredentials: false });

client.interceptors.request.use((config) => {
  const stored = localStorage.getItem('amazon_clone_user');
  if (stored) {
    const user = JSON.parse(stored);
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default client;
