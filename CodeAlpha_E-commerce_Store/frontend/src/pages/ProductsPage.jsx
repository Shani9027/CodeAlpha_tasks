import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const query = useMemo(() => ({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || '',
    priceRange: searchParams.get('priceRange') || '',
    pageNumber: searchParams.get('page') || 1,
  }), [searchParams]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchProducts(query);
      setProducts(data.products);
      setPages(data.pages);
      setTotal(data.total);
      setLoading(false);
    };
    load();
  }, [query]);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  const updateParam = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());
    if (value) {
      params[key] = value;
    } else {
      delete params[key];
    }
    setSearchParams(params);
  };

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
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Shop by category</p>
          <h1 className="text-3xl font-bold text-slate-900">Browse our catalog</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <select value={query.sort} onChange={(e) => updateParam('sort', e.target.value)} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm">
            <option value="">Sort by</option>
            <option value="price_asc">Price low to high</option>
            <option value="price_desc">Price high to low</option>
            <option value="rating">Top rated</option>
          </select>
          <select value={query.category} onChange={(e) => updateParam('category', e.target.value)} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm">
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <aside className="space-y-6 rounded-3xl bg-white p-6 shadow-card">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <button className="w-full rounded-full border border-slate-200 px-4 py-2 text-left" onClick={() => updateParam('priceRange', '0-50')}>Under $50</button>
              <button className="w-full rounded-full border border-slate-200 px-4 py-2 text-left" onClick={() => updateParam('priceRange', '50-150')}>$50 - $150</button>
              <button className="w-full rounded-full border border-slate-200 px-4 py-2 text-left" onClick={() => updateParam('priceRange', '150-1000')}>Above $150</button>
              <button className="w-full rounded-full bg-slate-900 px-4 py-2 text-white" onClick={() => setSearchParams({})}>Clear filters</button>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Results</h2>
            <p className="mt-2 text-sm text-slate-500">{total} products found</p>
          </div>
        </aside>

        <section className="space-y-6">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} onAdd={handleAdd} />
              ))}
            </div>
          )}
          <Pagination page={Number(query.pageNumber)} pages={pages} onPageChange={(page) => updateParam('page', page)} />
        </section>
      </div>
    </div>
  );
}

export default ProductsPage;
