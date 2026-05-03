import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function CartPage() {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('amazon_clone_cart') || '[]'));
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('amazon_clone_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
  }, [cart]);

  const handleQuantity = (index, delta) => {
    setCart((prev) => {
      const next = [...prev];
      next[index].quantity = Math.max(1, next[index].quantity + delta);
      return next;
    });
  };

  const handleRemove = (index) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Your cart</p>
          <h1 className="text-3xl font-bold text-slate-900">Review your items</h1>
        </div>
        <div className="rounded-full bg-slate-100 px-4 py-3 text-slate-700">{cart.length} items</div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-4">
          {cart.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center shadow-card">
              <p className="text-lg text-slate-700">Your cart is empty.</p>
              <Link to="/products" className="mt-4 inline-block rounded-full bg-slate-900 px-6 py-3 text-sm text-white">Continue shopping</Link>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={item.productId} className="grid gap-4 rounded-3xl bg-white p-5 shadow-card sm:grid-cols-[120px_1fr_190px]">
                <img src={item.image} alt={item.name} className="h-28 w-full rounded-3xl object-cover" />
                <div>
                  <h2 className="font-semibold text-slate-900">{item.name}</h2>
                  <p className="mt-2 text-slate-500">${item.price.toFixed(2)} each</p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-700">
                    <button className="rounded-full border px-3 py-1" onClick={() => handleQuantity(index, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button className="rounded-full border px-3 py-1" onClick={() => handleQuantity(index, 1)}>+</button>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <div className="text-right text-lg font-semibold text-slate-900">${(item.price * item.quantity).toFixed(2)}</div>
                  <button className="text-sm text-rose-600 hover:underline" onClick={() => handleRemove(index)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="space-y-5 rounded-3xl bg-white p-6 shadow-card">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Order summary</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">${subtotal.toFixed(2)}</h2>
          </div>
          <button disabled={!cart.length} onClick={() => navigate('/checkout')} className="w-full rounded-full bg-slate-900 px-5 py-3 text-white disabled:cursor-not-allowed disabled:bg-slate-400">
            Proceed to checkout
          </button>
        </aside>
      </div>
    </div>
  );
}

export default CartPage;
