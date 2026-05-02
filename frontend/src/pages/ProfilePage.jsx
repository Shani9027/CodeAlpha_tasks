import { useContext, useState } from 'react';
import { AuthContext, updateProfile } from '../services/authService';

function ProfilePage() {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState(user?.addresses?.[0]?.street || '');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = { name, email, password, addresses: [{ label: 'Home', street: address, city: '', state: '', zip: '', country: '' }] };
    const data = await updateProfile(payload);
    setUser((current) => ({ ...current, name: data.name, email: data.email }));
    setMessage('Profile updated successfully');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 rounded-3xl bg-white p-10 shadow-card">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
        <p className="mt-2 text-slate-500">Manage your account details and shipping address.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm" required />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm" placeholder="Leave blank to keep current password" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Primary address</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm" placeholder="Street address" />
        </div>
        {message && <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
        <button type="submit" className="rounded-full bg-slate-900 px-6 py-3 text-white hover:bg-slate-700">Save changes</button>
      </form>
    </div>
  );
}

export default ProfilePage;
