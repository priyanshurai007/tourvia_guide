import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITour extends Document {
  title: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  images: string[];
  date: Date;
  guideId: mongoose.Types.ObjectId;
  maxParticipants: number;
  availableSpots: number;
  startTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define schema outside so we can access it multiple ways
const TourSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a tour title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a tour description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a tour price'],
    min: [0, 'Price must be a positive number'],
  },
  duration: {
    type: String,
    required: [true, 'Please provide tour duration'],
    default: '2 hours',
  },
  location: {
    type: String,
    required: [true, 'Please provide tour location'],
  },
  images: {
    type: [String],
    default: ['/images/default-tour.jpg'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide tour date'],
  },
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Tour must be associated with a guide'],
  },
  maxParticipants: {
    type: Number,
    required: [true, 'Please provide maximum number of participants'],
    min: [1, 'Must allow at least 1 participant'],
    default: 10,
  },
  availableSpots: {
    type: Number,
    required: [true, 'Please provide available spots'],
    min: [0, 'Available spots cannot be negative'],
    default: 10,
  },
  startTime: {
    type: String,
    default: '09:00 AM',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * This function ensures the Tour model is properly registered
 * and available to the application regardless of how Mongoose
 * and Next.js handle module loading.
 */
function getTourModel(): Model<ITour> {
  // If the model already exists, return it
  if (mongoose.models && mongoose.models.Tour) {
    return mongoose.models.Tour as Model<ITour>;
  }
  
  // If the model doesn't exist, create and return it
  try {
    return mongoose.model<ITour>('Tour', TourSchema);
  } catch (error) {
    // If the error is because the model is already defined, return it
    if ((error as any).message?.includes('Cannot overwrite')) {
      return mongoose.model<ITour>('Tour');
    }
    // Otherwise, re-throw the error
    throw error;
  }
}

// Create and export the model
const TourModel = getTourModel();
export default TourModel; 