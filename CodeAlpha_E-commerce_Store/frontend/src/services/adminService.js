import api from './api';

export const fetchAdminStats = async () => {
  const { data } = await api.get('/admin/stats');
  return data;
};

export const fetchAdminOrders = async () => {
  const { data } = await api.get('/admin/orders');
  return data;
};

export const fetchAdminUsers = async () => {
  const { data } = await api.get('/admin/users');
  return data;
};
