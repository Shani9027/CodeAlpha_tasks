function ReviewList({ reviews }) {
  if (!reviews.length) {
    return <p className="text-slate-500">No reviews yet.</p>;
  }
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review._id} className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-slate-900">{review.user?.name || 'Unknown'}</p>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{review.rating} ⭐</span>
          </div>
          <p className="mt-2 text-slate-600">{review.comment}</p>
          <p className="mt-3 text-xs uppercase tracking-widest text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
