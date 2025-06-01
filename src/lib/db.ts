import mongoose from 'mongoose';
import registerModels from './models';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
    isConnected: boolean;
  };
}

global.mongoose = global.mongoose || { 
  conn: null, 
  promise: null,
  isConnected: false 
};

async function connectDB() {
  if (global.mongoose.isConnected) {
    console.log('Using existing mongoose connection');
    // Make sure models are registered even with existing connection
    registerModels();
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    console.log('Creating new mongoose connection');
    const opts = {
      bufferCommands: false,
    };

    global.mongoose.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    global.mongoose.conn = await global.mongoose.promise;
    global.mongoose.isConnected = true;
    
    // Register all models
    const models = registerModels();
    console.log('MongoDB connected successfully');
    console.log('Registered models:', Object.keys(models).join(', '));
    
    // Return connection
    return global.mongoose.conn;
  } catch (e) {
    global.mongoose.promise = null;
    global.mongoose.isConnected = false;
    console.error('MongoDB connection error:', e);
    throw e;
  }
}

export default connectDB; 