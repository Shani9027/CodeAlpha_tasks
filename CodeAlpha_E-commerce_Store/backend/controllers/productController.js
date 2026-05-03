const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { isConnected } = require('../config/db');
const fallbackProducts = require('../data/fallbackProducts');

const applyProductFilters = (products, req) => {
  const keyword = req.query.search ? req.query.search.toLowerCase() : '';
  const category = req.query.category;
  const priceRange = req.query.priceRange;
  const sort = req.query.sort;

  let filtered = products.filter((product) => {
    const matchesSearch = keyword ? product.name.toLowerCase().includes(keyword) : true;
    const matchesCategory = category ? product.category === category : true;
    let matchesPrice = true;
    if (priceRange) {
      const parts = priceRange.split('-');
      const min = Number(parts[0] || 0);
      const max = Number(parts[1] || 999999);
      matchesPrice = product.price >= min && product.price <= max;
    }
    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (sort === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    filtered.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
  }

  return filtered;
};

exports.getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.search
    ? { name: { $regex: req.query.search, $options: 'i' } }
    : {};
  const categoryFilter = req.query.category ? { category: req.query.category } : {};
  const priceFilter = req.query.priceRange
    ? {
        price: {
          $gte: Number(req.query.priceRange.split('-')[0] || 0),
          $lte: Number(req.query.priceRange.split('-')[1] || 999999),
        },
      }
    : {};
  const sortOption = req.query.sort === 'price_asc'
    ? { price: 1 }
    : req.query.sort === 'price_desc'
    ? { price: -1 }
    : req.query.sort === 'rating'
    ? { rating: -1 }
    : { createdAt: -1 };

  if (!isConnected()) {
    const products = applyProductFilters(fallbackProducts, req);
    const total = products.length;
    const pageProducts = products.slice(pageSize * (page - 1), pageSize * page);
    return res.json({ products: pageProducts, page, pages: Math.ceil(total / pageSize), total });
  }

  const filter = { ...keyword, ...categoryFilter, ...priceFilter };
  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sortOption)
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  res.json({ products, page, pages: Math.ceil(total / pageSize), total });
});

exports.getProductById = asyncHandler(async (req, res) => {
  if (!isConnected()) {
    const product = fallbackProducts.find((item) => item._id === req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    return res.json({ product, reviews: [] });
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const reviews = await Review.find({ product: product._id }).populate('user', 'name');
  res.json({ product, reviews });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, images, featured } = req.body;
  const product = new Product({
    name,
    description,
    price,
    category,
    stock,
    images,
    featured: featured || false,
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, images, featured } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.category = category || product.category;
  product.stock = stock || product.stock;
  product.images = images || product.images;
  product.featured = featured ?? product.featured;
  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.remove();
  res.json({ message: 'Product removed' });
});

exports.getCategories = asyncHandler(async (req, res) => {
  if (!isConnected()) {
    const categories = [...new Set(fallbackProducts.map((product) => product.category))];
    return res.json(categories);
  }

  const categories = await Product.distinct('category');
  res.json(categories);
});
