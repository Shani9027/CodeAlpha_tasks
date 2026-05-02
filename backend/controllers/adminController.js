const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getDashboardStats = asyncHandler(async (req, res) => {
  const userCount = await User.countDocuments();
  const productCount = await Product.countDocuments();
  const orderCount = await Order.countDocuments();
  const totalSales = await Order.aggregate([
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);
  res.json({
    userCount,
    productCount,
    orderCount,
    totalSales: totalSales[0]?.total || 0,
  });
});

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').populate('items.product', 'name price');
  res.json(orders);
});
