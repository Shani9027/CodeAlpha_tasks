import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';

function HomePage() {
  const [heroProducts, setHeroProducts] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchProducts({ pageSize: 12 });
        const products = Array.isArray(result?.products) ? result.products : [];
        setHeroProducts(products.slice(0, 3));
        setTrending(products.slice(0, 6));
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAdd = (product) => {
    const cart = JSON.parse(localStorage.getItem('amazon_clone_cart') || '[]');
    const existing = cart.find((item) => item.productId === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ productId: product._id, name: product.name, price: product.price, image: product.images[0], quantity: 1 });
    }
    localStorage.setItem('amazon_clone_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    alert('Added to cart');
  };

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-12 text-white shadow-xl">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.8fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">ShopEase</p>
            <h1 className="mt-4 text-5xl font-bold leading-tight">Discover deals on trending products across electronics, fashion, and home.</h1>
            <p className="mt-6 max-w-xl text-slate-200">Experience fast search, smart recommendations, and a seamless checkout flow built for modern shoppers.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="rounded-full bg-white px-6 py-3 text-slate-900 shadow-lg">Browse Products</Link>
              <Link to="/cart" className="rounded-full border border-white px-6 py-3 text-white">View Cart</Link>
            </div>
          </div>
          <div className="grid gap-4">
            {heroProducts.map((product) => (
              <div key={product._id} className="overflow-hidden rounded-[2rem] bg-slate-800 p-5 shadow-card">
                <img src={product.images[0]} alt={product.name} className="h-64 w-full rounded-[1.5rem] object-cover" />
                <div className="mt-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Featured</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">{product.name}</h2>
                  <p className="mt-2 text-slate-300">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Trending products</p>
            <h2 className="text-3xl font-bold text-slate-900">Popular picks for you</h2>
          </div>
          <Link to="/products" className="text-sm font-semibold text-slate-900 hover:text-slate-700">View all products</Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="rounded-3xl bg-red-50 p-6 text-red-700 shadow-sm">
            <p className="font-semibold">Unable to load products.</p>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        ) : trending.length === 0 ? (
          <div className="rounded-3xl bg-slate-100 p-6 text-slate-700 shadow-sm">
            <p className="font-semibold">No trending products available right now.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {trending.map((product) => (
              <ProductCard key={product._id} product={product} onAdd={handleAdd} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
