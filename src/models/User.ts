import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'traveler' | 'guide' | 'admin';
  avatar: string;
  phone?: string;
  location?: string;
  bio?: string;
  languages?: string[];
  specialty?: string;
  savedGuides?: mongoose.Types.ObjectId[];
  preferences?: {
    tourTypes?: string[];
    languages?: string[];
  };
  profileCompleted?: boolean;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the user schema
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  role: {
    type: String,
    enum: ['traveler', 'guide', 'admin'],
    default: 'traveler'
  },
  avatar: {
    type: String,
    default: function() {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=random`;
    }
  },
  phone: {
    type: String,
  },
  location: {
    type: String,
  },
  bio: {
    type: String,
  },
  languages: {
    type: [String],
  },
  specialty: {
    type: String,
  },
  savedGuides: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  preferences: {
    tourTypes: [String],
    languages: [String]
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * This function ensures the User model is properly registered
 * and available to the application regardless of how Mongoose
 * and Next.js handle module loading.
 */
function getUserModel(): Model<IUser> {
  // If the model already exists, return it
  if (mongoose.models && mongoose.models.User) {
    return mongoose.models.User as Model<IUser>;
  }
  
  // If the model doesn't exist, create and return it
  try {
    return mongoose.model<IUser>('User', userSchema);
  } catch (error) {
    // If the error is because the model is already defined, return it
    if ((error as any).message?.includes('Cannot overwrite')) {
      return mongoose.model<IUser>('User');
    }
    // Otherwise, re-throw the error
    throw error;
  }
}

// Create and export the model
const UserModel = getUserModel();
export default UserModel; 