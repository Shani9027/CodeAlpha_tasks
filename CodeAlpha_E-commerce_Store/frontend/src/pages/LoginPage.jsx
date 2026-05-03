import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, login } from '../services/authService';
import { syncCart } from '../services/cartService';

function LoginPage() {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      setUser(data);
      const localCart = JSON.parse(localStorage.getItem('amazon_clone_cart') || '[]');
      if (localCart.length) {
        await syncCart(localCart.map((item) => ({ product: item.productId, quantity: item.quantity })));
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 shadow-card">
      <h1 className="text-3xl font-bold text-slate-900">Login</h1>
      <p className="mt-2 text-slate-500">Access your account and continue shopping.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm" required />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm" required />
        </div>
        {error && <div className="rounded-3xl bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div>}
        <button type="submit" disabled={loading} className="w-full rounded-full bg-slate-900 px-5 py-3 text-white hover:bg-slate-700 disabled:bg-slate-400">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
