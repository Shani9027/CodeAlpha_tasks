const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  try {
    if (mongoUri) {
      const conn = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    }

    throw new Error('MONGODB_URI not set');
  } catch (error) {
    console.warn(`Local MongoDB connection failed: ${error.message}`);
    console.warn('Falling back to in-memory MongoDB for development. Data will not persist after restart.');

    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`In-memory MongoDB started at ${uri}`);
    return conn;
  }
};

module.exports = connectDB;
