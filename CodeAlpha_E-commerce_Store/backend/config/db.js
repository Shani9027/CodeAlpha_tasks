const mongoose = require('mongoose');

let dbConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/amazon_clone', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    dbConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    dbConnected = false;
    console.error(`MongoDB connection failed: ${error.message}`);
    console.error('Continuing in fallback mode without MongoDB. Product routes will use sample data only.');
  }
};

const isConnected = () => dbConnected;

module.exports = { connectDB, isConnected };
