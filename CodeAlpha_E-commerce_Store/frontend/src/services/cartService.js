import api from './api';

export const fetchCart = async () => {
  const { data } = await api.get('/cart');
  return data;
};

export const updateCart = async (items) => {
  const { data } = await api.put('/cart', { items });
  return data;
};

export const syncCart = async (items) => {
  const { data } = await api.put('/cart', { items });
  return data;
};

export const clearCart = async () => {
  const { data } = await api.delete('/cart');
  return data;
};
