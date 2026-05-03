const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.placeOrder = asyncHandler(async (req, res) => {
  const { address, paymentMethod, paymentStatus, items } = req.body;
  if (!address || !items || !items.length) {
    res.status(400);
    throw new Error('Order requires products and address');
  }

  const orderItems = await Promise.all(items.map(async (item) => {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    return { product: product._id, quantity: item.quantity, price: product.price };
  }));

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalPrice,
    address,
    paymentMethod: paymentMethod || 'stripe',
    paymentStatus: paymentStatus || 'Paid',
  });

  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.status(201).json(order);
});

exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('items.product');
  res.json(orders);
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not allowed');
  }
  res.json(order);
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.orderStatus = req.body.orderStatus || order.orderStatus;
  const updated = await order.save();
  res.json(updated);
});
