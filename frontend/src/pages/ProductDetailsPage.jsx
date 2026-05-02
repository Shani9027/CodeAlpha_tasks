import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProduct } from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';
import ReviewList from '../components/ReviewList';

function ProductDetailsPage() {
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchProduct(id);
      setProductData(data);
      setLoading(false);
    };
    load();
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('amazon_clone_cart') || '[]');
    const existing = cart.find((item) => item.productId === productData.product._id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ productId: productData.product._id, name: productData.product.name, price: productData.product.price, image: productData.product.images[0], quantity });
    }
    localStorage.setItem('amazon_clone_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    alert('Added to cart');
  };

  if (loading) return <LoadingSpinner />;

  const { product, reviews } = productData;

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5 rounded-3xl bg-white p-6 shadow-card">
          <div className="grid gap-4 lg:grid-cols-[1fr_5rem]">
            <div className="rounded-3xl overflow-hidden border border-slate-200">
              <img src={product.images[mainImageIndex]} alt={product.name} className="h-[420px] w-full object-cover" />
            </div>
            <div className="space-y-3">
              {product.images.map((img, index) => (
                <button key={img} className={`block h-20 w-full overflow-hidden rounded-3xl border ${index === mainImageIndex ? 'border-slate-900' : 'border-slate-200'}`} onClick={() => setMainImageIndex(index)}>
                  <img src={img} alt={`${product.name}-${index}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-semibold text-slate-900">{product.name}</h1>
            <p className="mt-2 text-slate-600">{product.category} • {product.stock > 0 ? 'In stock' : 'Out of stock'}</p>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-3xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{product.rating.toFixed(1)} ⭐</span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Product details</h2>
            <p className="text-slate-600 leading-7">{product.description}</p>
          </div>
        </div>

        <aside className="space-y-6 rounded-3xl bg-white p-6 shadow-card">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-slate-600">
              <span>Quantity</span>
              <input type="number" min="1" max={product.stock} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-20 rounded-full border border-slate-300 bg-slate-50 px-3 py-2 text-right" />
            </div>
            <button disabled={product.stock === 0} onClick={addToCart} className="w-full rounded-full bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400">
              Add to cart
            </button>
          </div>

          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Seller</p>
            <p className="mt-3 text-slate-700">Shani Shop verified store</p>
          </div>
        </aside>
      </div>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold text-slate-900">Reviews</h2>
        <ReviewList reviews={reviews} />
      </section>
    </div>
  );
}

export default ProductDetailsPage;
