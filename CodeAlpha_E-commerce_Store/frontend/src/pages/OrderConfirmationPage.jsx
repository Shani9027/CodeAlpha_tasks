import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrder } from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';

function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      const data = await fetchOrder(id);
      setOrder(data);
      setLoading(false);
    };
    loadOrder();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-card">
      <h1 className="text-4xl font-bold text-slate-900">Thank you for your purchase!</h1>
      <p className="mt-4 text-slate-600">Your order has been confirmed and is now being processed.</p>
      <div className="mt-8 space-y-4 rounded-3xl bg-slate-50 p-6">
        <p className="text-sm text-slate-500">Order ID</p>
        <p className="text-lg font-semibold text-slate-900">{order._id}</p>
        <p className="text-sm text-slate-500">Total</p>
        <p className="text-lg font-semibold text-slate-900">${order.totalPrice.toFixed(2)}</p>
        <p className="text-sm text-slate-500">Status</p>
        <p className="text-lg font-semibold text-slate-900">{order.orderStatus}</p>
      </div>
      <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-center">
        <h2 className="text-lg font-semibold text-slate-900">UPI Payment Details</h2>
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=ojha63344-3@okicici&pn=Anish%20Kumar&tn=ShopEase%20Payment"
          alt="UPI QR Code"
          className="mx-auto my-4 h-56 w-56 rounded-3xl border border-slate-200 object-cover"
        />
        <p className="text-sm text-slate-600">UPI ID:</p>
        <p className="font-medium text-slate-900">ojha63344-3@okicici</p>
        <p className="mt-2 text-xs text-slate-500">Scan to pay with any UPI app.</p>
      </div>
      <Link to="/orders" className="mt-6 inline-block rounded-full bg-slate-900 px-6 py-3 text-white hover:bg-slate-700">View orders</Link>
    </div>
  );
}

export default OrderConfirmationPage;
