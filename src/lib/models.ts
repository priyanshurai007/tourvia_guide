import mongoose from 'mongoose';
// Force load all models
import '../models/User';
import '../models/Booking';
import '../models/Tour';

/**
 * This function ensures all models are properly registered with Mongoose
 * It forces model registration when called to prevent the
 * "Schema hasn't been registered for model X" error in Next.js
 * due to the way it handles module loading in development
 */
export function registerModels() {
  // Pre-load critical models
  try {
    // Attempt to access models - this will fail with error if model isn't registered
    if (!mongoose.models.User) {
      console.warn('User model not registered yet');
    }
    if (!mongoose.models.Booking) {
      console.warn('Booking model not registered yet');
    }
    if (!mongoose.models.Tour) {
      console.warn('Tour model not registered yet');
    }
  } catch (e) {
    console.error('Error checking models:', e);
  }
  
  console.log('Models registered:', Object.keys(mongoose.models).join(', '));
  
  // Return all registered models
  return {
    User: mongoose.models.User,
    Booking: mongoose.models.Booking,
    Tour: mongoose.models.Tour
  };
}

export default registerModels; 