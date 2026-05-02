const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');

dotenv.config();
connectDB();

const products = [
  {
    name: 'Wireless Noise Cancelling Headphones',
    description: 'Premium over-ear headphones with adaptive noise cancellation and 30-hour battery life.',
    price: 179.99,
    category: 'Electronics',
    stock: 58,
    images: [
      'https://images.unsplash.com/photo-1511376777868-611b54f68947?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80'
    ],
    featured: true,
  },
  {
    name: 'Modern Minimalist Leather Wallet',
    description: 'Slim RFID-blocking wallet with premium full-grain leather finish.',
    price: 39.99,
    category: 'Fashion',
    stock: 92,
    images: [
      'https://images.unsplash.com/photo-1518544790610-20733cc18af0?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=900&q=80'
    ],
    featured: true,
  },
  {
    name: 'Smart Fitness Tracker Watch',
    description: 'Track workouts, heart rate, sleep, and notifications with this lightweight smartwatch.',
    price: 119.99,
    category: 'Wearables',
    stock: 74,
    images: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1512058564366-c9a08d0cc580?auto=format&fit=crop&w=900&q=80'
    ],
    featured: true,
  },
  {
    name: 'Ultra HD 4K Smart TV',
    description: '55-inch 4K HDR smart television with voice control and streaming support.',
    price: 499.0,
    category: 'Electronics',
    stock: 24,
    images: [
      'https://images.unsplash.com/photo-1525072122511-1f1f4e3e41de?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=900&q=80'
    ],
    featured: false,
  },
  {
    name: 'Comfort Memory Foam Sneakers',
    description: 'Everyday running shoes with breathable mesh and responsive cushioning.',
    price: 69.99,
    category: 'Footwear',
    stock: 118,
    images: [
      'https://images.unsplash.com/photo-1528701800489-20f0f8a9c8d1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1526401485004-4c7c5f21ef60?auto=format&fit=crop&w=900&q=80'
    ],
    featured: true,
  }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    await Product.insertMany(products);
    const adminPassword = await bcrypt.hash('Admin123!', 12);
    await User.create({
      name: 'Admin User',
      email: 'admin@shani.com',
      password: adminPassword,
      role: 'admin',
      addresses: [],
    });
    console.log('Seed data inserted. Admin credentials: admin@shani.com / Admin123!');
    process.exit();
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

importData();
