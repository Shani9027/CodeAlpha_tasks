import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/orderService';

function CheckoutPage() {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const cart = useMemo(() => JSON.parse(localStorage.getItem('amazon_clone_cart') || '[]'), []);
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!address || !phone || cart.length === 0) {
      setError('Please complete your address, phone, and cart items.');
      return;
    }
    setLoading(true);
    try {
      const order = await placeOrder({
        address,
        paymentMethod: 'stripe',
        paymentStatus: 'Paid',
        items: cart.map((item) => ({ product: item.productId, quantity: item.quantity })),
      });
      localStorage.setItem('amazon_clone_cart', JSON.stringify([]));
      navigate(`/order-confirmation/${order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not complete checkout.');
    }
    setLoading(false);
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
      <div className="rounded-3xl bg-white p-6 shadow-card">
        <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Shipping Address</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm" rows="4" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Phone Number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm" required />
          </div>
          {error && <div className="rounded-3xl bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div>}
          <button type="submit" disabled={loading} className="w-full rounded-full bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400">
            {loading ? 'Processing…' : 'Place Order'}
          </button>
        </form>
      </div>
      <aside className="space-y-6 rounded-3xl bg-white p-6 shadow-card">
        <h2 className="text-xl font-semibold text-slate-900">Review</h2>
        <div className="space-y-4 text-sm text-slate-600">
          <p><span className="font-semibold text-slate-900">Items:</span> {cart.length}</p>
          <p><span className="font-semibold text-slate-900">Total:</span> ${total.toFixed(2)}</p>
          <p className="rounded-3xl bg-slate-50 px-4 py-3">Payment method: Stripe (test mode)</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5 text-center">
          <h3 className="text-lg font-semibold text-slate-900">Pay via UPI</h3>
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=ojha63344-3@okicici&pn=Anish%20Kumar&tn=ShopEase%20Payment"
            alt="UPI QR Code"
            className="mx-auto my-4 h-56 w-56 rounded-3xl border border-slate-200 object-cover"
          />
          <p className="text-sm text-slate-600">UPI ID:</p>
          <p className="font-medium text-slate-900">ojha63344-3@okicici</p>
          <p className="mt-2 text-xs text-slate-500">Scan to pay with any UPI app</p>
        </div>
      </aside>
    </div>
  );
}

export default CheckoutPage;
