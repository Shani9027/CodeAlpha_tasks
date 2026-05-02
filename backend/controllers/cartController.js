const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) {
    return res.json({ items: [] });
  }
  res.json(cart);
});

exports.updateCart = asyncHandler(async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    res.status(400);
    throw new Error('Invalid cart payload');
  }

  const sanitizedItems = await Promise.all(items.map(async (item) => {
    const product = await Product.findById(item.product);
    if (!product) throw new Error('Product not found in cart');
    return { product: product._id, quantity: Math.min(Math.max(item.quantity, 1), product.stock) };
  }));

  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { user: req.user._id, items: sanitizedItems },
    { new: true, upsert: true }
  ).populate('items.product');

  res.json(cart);
});

exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json({ message: 'Cart cleared' });
});
