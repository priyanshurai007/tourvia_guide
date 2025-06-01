import mongoose from 'mongoose';
import Tour from '../models/Tour';
import User from '../models/User';
import Booking from '../models/Booking';
import connectDB from './db';

/**
 * This function forcefully preloads all models to ensure they're registered
 * before the app needs them.
 */
export async function preloadModels() {
  try {
    console.log('Preloading models...');
    
    // Connect to the database first
    await connectDB();
    
    // Force access to ensure models are registered
    console.log('Registered models before preload:', Object.keys(mongoose.models).join(', '));
    
    // Reference each model to ensure they're loaded
    const tourModel = Tour;
    const userModel = User;
    const bookingModel = Booking;
    
    console.log('Model preloading complete. Available models:', Object.keys(mongoose.models).join(', '));
    
    return {
      success: true,
      models: Object.keys(mongoose.models)
    };
  } catch (error) {
    console.error('Error preloading models:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export default preloadModels; 