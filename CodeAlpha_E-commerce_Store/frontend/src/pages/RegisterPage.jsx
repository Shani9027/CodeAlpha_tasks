import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, register } from '../services/authService';
import { syncCart } from '../services/cartService';

function RegisterPage() {
  const { setUser } = useContext(AuthContext);
  const [name, setName] = useState('');
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
      const data = await register(name, email, password);
      setUser(data);
      const localCart = JSON.parse(localStorage.getItem('amazon_clone_cart') || '[]');
      if (localCart.length) {
        await syncCart(localCart.map((item) => ({ product: item.productId, quantity: item.quantity })));
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 shadow-card">
      <h1 className="text-3xl font-bold text-slate-900">Create account</h1>
      <p className="mt-2 text-slate-500">Register a new account to save orders and manage your profile.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm" required />
        </div>
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
          {loading ? 'Registering…' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
