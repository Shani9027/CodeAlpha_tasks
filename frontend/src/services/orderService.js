import api from './api';

export const placeOrder = async (payload) => {
  const { data } = await api.post('/orders', payload);
  return data;
};

export const fetchOrders = async () => {
  const { data } = await api.get('/orders');
  return data;
};

export const fetchOrder = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

export const createPaymentIntent = async (amount) => {
  const { data } = await api.post('/payments/create-intent', { amount });
  return data;
};
