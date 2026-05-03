import { Link } from 'react-router-dom';

function ProductCard({ product, onAdd }) {
  return (
    <div className="card-shadow overflow-hidden rounded-3xl bg-white transition hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/product/${product._id}`} className="block h-72 overflow-hidden">
        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
      </Link>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-900">${product.price.toFixed(2)}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{product.category}</span>
        </div>
        <Link to={`/product/${product._id}`} className="mt-3 block text-lg font-semibold text-slate-900 hover:text-slate-600">
          {product.name}
        </Link>
        <p className="mt-2 text-sm text-slate-500">{product.description.slice(0, 90)}...</p>
        <div className="mt-4 flex items-center justify-between">
          <Link to={`/product/${product._id}`} className="text-slate-600 hover:text-slate-900">View</Link>
          <button
            onClick={() => onAdd(product)}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
