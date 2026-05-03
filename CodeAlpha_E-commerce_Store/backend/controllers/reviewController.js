const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');

exports.createReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = await Review.findOne({ user: req.user._id, product: productId });
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating: Number(rating),
    comment,
  });

  const reviews = await Review.find({ product: productId });
  product.reviewsCount = reviews.length;
  product.rating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await product.save();

  res.status(201).json(review);
});

exports.getReviewsForProduct = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
  res.json(reviews);
});
