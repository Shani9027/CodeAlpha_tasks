import { useEffect, useState } from 'react';
import { fetchAdminOrders, fetchAdminStats, fetchAdminUsers } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [statsData, ordersData, usersData] = await Promise.all([fetchAdminStats(), fetchAdminOrders(), fetchAdminUsers()]);
      setStats(statsData);
      setOrders(ordersData);
      setUsers(usersData);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-6 shadow-card">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-2 text-slate-500">Monitor sales, orders, and user activity in one place.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-sm uppercase tracking-[0.35em] text-slate-500">Total sales</h2>
          <p className="mt-4 text-3xl font-semibold text-slate-900">${stats.totalSales.toFixed(2)}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-sm uppercase tracking-[0.35em] text-slate-500">Orders</h2>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{stats.orderCount}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-sm uppercase tracking-[0.35em] text-slate-500">Users</h2>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{stats.userCount}</p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-xl font-semibold text-slate-900">Recent orders</h2>
          {orders.slice(0, 4).map((order) => (
            <div key={order._id} className="rounded-3xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-slate-900">#{order._id.slice(-6).toUpperCase()}</p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{order.orderStatus}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">User: {order.user?.name || 'Unknown'}</p>
              <p className="mt-1 text-sm text-slate-600">Total: ${order.totalPrice.toFixed(2)}</p>
            </div>
          ))}
        </section>
        <section className="space-y-4 rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-xl font-semibold text-slate-900">New users</h2>
          {users.slice(0, 4).map((user) => (
            <div key={user._id} className="rounded-3xl border border-slate-200 p-4">
              <p className="font-semibold text-slate-900">{user.name}</p>
              <p className="mt-1 text-sm text-slate-600">{user.email}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
