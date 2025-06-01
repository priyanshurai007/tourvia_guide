import mongoose from 'mongoose';

const GuideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
  },
  bio: {
    type: String,
    required: [true, 'Please provide a bio'],
  },
  avatar: {
    type: String,
    required: [true, 'Please provide an avatar URL'],
  },
  rating: {
    type: Number,
    default: 0,
  },
  totalTours: {
    type: Number,
    default: 0,
  },
  experience: {
    type: String,
    required: [true, 'Please provide experience'],
  },
  languages: [{
    type: String,
    required: [true, 'Please provide at least one language'],
  }],
  specialties: [{
    type: String,
    required: [true, 'Please provide at least one specialty'],
  }],
  hourlyRate: {
    type: Number,
    required: [true, 'Please provide an hourly rate'],
  },
  verified: {
    type: Boolean,
    default: false,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave', 'Pending'],
    default: 'Pending',
  },
  availability: [{
    type: String,
    required: [true, 'Please provide availability'],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
GuideSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Guide || mongoose.model('Guide', GuideSchema); 