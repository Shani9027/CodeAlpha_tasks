import api from './api';
import { createContext } from 'react';

export const AuthContext = createContext({ user: null, setUser: () => {} });

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const register = async (name, email, password) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data;
};

export const fetchProfile = async () => {
  const { data } = await api.get('/auth/profile');
  return data;
};

export const updateProfile = async (profile) => {
  const { data } = await api.put('/auth/profile', profile);
  return data;
};
