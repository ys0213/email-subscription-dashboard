import mongoose from 'mongoose';

// Extend the global object to include mongoose
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Log connection attempt (remove in production)
console.log('MongoDB URI configured:', MONGODB_URI ? 'Yes' : 'No');

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (!cached) {
    throw new Error('Failed to initialize mongoose cache');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 10000, // 10 seconds
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
    };

    console.log('Attempting to connect to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI!, opts) as any;
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB connected successfully');
  } catch (e) {
    console.error('MongoDB connection error:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;