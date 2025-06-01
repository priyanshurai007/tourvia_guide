import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
  travelerId: mongoose.Types.ObjectId;
  travelerName: string;
  travelerEmail: string;
  guideId: mongoose.Types.ObjectId;
  guideName: string;
  tourId: mongoose.Types.ObjectId;
  tourName: string;
  date: string;
  time?: string;
  participants: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  hasReviewed?: boolean;
  createdAt: Date;
}

const bookingSchema = new Schema({
  travelerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  travelerName: {
    type: String,
    required: true
  },
  travelerEmail: {
    type: String,
    required: true
  },
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  guideName: {
    type: String,
    required: true
  },
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  tourName: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    default: '09:00 AM'
  },
  participants: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  hasReviewed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better query performance
bookingSchema.index({ travelerId: 1, createdAt: -1 });
bookingSchema.index({ guideId: 1, createdAt: -1 });
bookingSchema.index({ date: 1 });

/**
 * This function ensures the Booking model is properly registered
 * and available to the application regardless of how Mongoose
 * and Next.js handle module loading.
 */
function getBookingModel(): Model<IBooking> {
  // If the model already exists, return it
  if (mongoose.models && mongoose.models.Booking) {
    return mongoose.models.Booking as Model<IBooking>;
  }
  
  // If the model doesn't exist, create and return it
  try {
    return mongoose.model<IBooking>('Booking', bookingSchema);
  } catch (error) {
    // If the error is because the model is already defined, return it
    if ((error as any).message?.includes('Cannot overwrite')) {
      return mongoose.model<IBooking>('Booking');
    }
    // Otherwise, re-throw the error
    throw error;
  }
}

// Create and export the model
const BookingModel = getBookingModel();
export default BookingModel; 