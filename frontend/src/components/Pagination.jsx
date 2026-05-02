function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const items = [];
  for (let p = 1; p <= pages; p += 1) {
    items.push(
      <button
        key={p}
        onClick={() => onPageChange(p)}
        className={`rounded-full px-4 py-2 text-sm ${p === page ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
      >
        {p}
      </button>
    );
  }

  return <div className="flex flex-wrap items-center gap-2">{items}</div>;
}

export default Pagination;
