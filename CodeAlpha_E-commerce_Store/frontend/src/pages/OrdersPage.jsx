import { useEffect, useState } from 'react';
import { fetchOrders } from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const data = await fetchOrders();
      setOrders(data);
      setLoading(false);
    };
    loadOrders();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-card">
        <h1 className="text-3xl font-bold text-slate-900">Your orders</h1>
        <p className="mt-2 text-slate-500">Track order status from pending to delivered.</p>
      </div>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center text-slate-600 shadow-card">No orders found.</div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="rounded-3xl bg-white p-6 shadow-card">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Order #{order._id.slice(-6).toUpperCase()}</h2>
                  <p className="text-sm text-slate-500">Placed: {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">{order.orderStatus}</div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Address</p>
                  <p className="mt-1 text-slate-700">{order.address}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="mt-1 font-semibold text-slate-900">${order.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
