import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing');
    }
    if (process.env.MONGO_URI.includes('username:password@cluster.mongodb.net')) {
      throw new Error('MONGO_URI still contains the placeholder Atlas URI. Replace it with your real MongoDB Atlas connection string.');
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
