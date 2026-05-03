import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../services/authService';
import { fetchProducts } from '../services/productService';

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('amazon_clone_cart') || '[]');
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const cart = JSON.parse(localStorage.getItem('amazon_clone_cart') || '[]');
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const result = await fetchProducts({ search, pageSize: 5 });
      setSuggestions(result.products);
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('amazon_clone_cart');
    navigate('/');
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-bold text-slate-900">ShopEase</Link>
          <span className="text-sm text-slate-500">Amazon-style marketplace</span>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl">
          <input
            className="w-full rounded-full border border-slate-300 bg-slate-50 py-2 px-4 pr-32 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
            placeholder="Search products, categories, brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white">Search</button>
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-20 rounded-xl border border-slate-200 bg-white shadow-lg">
              {suggestions.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setSearch('')}
                >
                  {product.name}
                </Link>
              ))}
            </div>
          )}
        </form>

        <nav className="flex items-center gap-3 text-sm text-slate-700">
          <Link to="/products" className="hover:text-slate-900">Products</Link>
          <Link to="/cart" className="relative hover:text-slate-900">
            Cart
            {cartCount > 0 && (
              <span className="absolute -right-3 -top-2 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-rose-500 px-2 text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/orders" className="hover:text-slate-900">Orders</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="font-medium text-slate-900">{user.name}</Link>
              {user.role === 'admin' && <Link to="/admin" className="text-slate-600 hover:text-slate-900">Admin</Link>}
              <button onClick={handleLogout} className="rounded-full bg-slate-900 px-3 py-2 text-white">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:text-slate-900">Login</Link>
              <Link to="/register" className="rounded-full bg-slate-900 px-3 py-2 text-white">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
