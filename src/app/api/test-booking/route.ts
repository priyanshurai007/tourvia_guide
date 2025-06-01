import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import Tour from '@/models/Tour';
import User from '@/models/User';
import Guide from '@/models/Guide';
import mongoose from 'mongoose';

// Function to generate a valid ObjectId
const createObjectId = () => new mongoose.Types.ObjectId();

export async function GET() {
  try {
    console.log('Starting test booking creation...');
    
    // Connect to database
    await connectDB();
    console.log('Connected to database successfully');
    
    // Check if there's at least one user in the database
    const user = await User.findOne();
    console.log('Found user:', user ? 'Yes' : 'No');
    
    // If no user exists, create a test user
    let userId;
    if (!user) {
      console.log('Creating test user...');
      const testUser = await User.create({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        role: 'traveler'
      });
      userId = testUser._id;
      console.log('Test user created with ID:', userId);
    } else {
      userId = user._id;
      console.log('Using existing user ID:', userId);
    }
    
    // Check if there's at least one guide in the database
    const guide = await Guide.findOne();
    console.log('Found guide:', guide ? 'Yes' : 'No');
    
    // If no guide exists, create a test guide
    let guideId;
    if (!guide) {
      console.log('Creating test guide...');
      const testGuide = await Guide.create({
        name: 'Test Guide',
        email: `guide${Date.now()}@example.com`,
        password: 'password123',
        specialization: 'Test Specialization',
        experience: 5,
        rating: 4.5,
        hourlyRate: 50,
        availability: true
      });
      guideId = testGuide._id;
      console.log('Test guide created with ID:', guideId);
    } else {
      guideId = guide._id;
      console.log('Using existing guide ID:', guideId);
    }
    
    // Check if there's at least one tour in the database
    const tour = await Tour.findOne();
    console.log('Found tour:', tour ? 'Yes' : 'No');
    
    // If no tour exists, create a test tour
    let tourId;
    if (!tour) {
      console.log('Creating test tour...');
      const testTour = await Tour.create({
        title: 'Test Tour',
        description: 'A test tour for debugging',
        price: 2500,
        duration: 1, // Number of days
        location: 'Test Location',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        guideId: guideId,
        maxParticipants: 10,
        availableSpots: 10
      });
      tourId = testTour._id;
      console.log('Test tour created with ID:', tourId);
    } else {
      tourId = tour._id;
      console.log('Using existing tour ID:', tourId);
    }
    
    // Create test booking data
    const bookingData = {
      userId: userId,
      tourId: tourId,
      numberOfParticipants: 2,
      totalAmount: 5000,
      status: 'pending',
      paymentStatus: 'unpaid',
      bookingDate: new Date()
    };
    
    console.log('Creating test booking with data:', JSON.stringify(bookingData));
    
    // Create the booking
    const booking = await Booking.create(bookingData);
    console.log('Booking created successfully with ID:', booking._id);
    
    // Verify the booking was saved by retrieving it
    const savedBooking = await Booking.findById(booking._id);
    console.log('Verified saved booking:', savedBooking ? 'Yes' : 'No');
    
    // Get all bookings count
    const bookingCount = await Booking.countDocuments();
    console.log('Total bookings in database:', bookingCount);
    
    return NextResponse.json({
      success: true,
      message: 'Test booking created successfully',
      bookingId: booking._id.toString(),
      totalBookings: bookingCount,
      bookingDetails: savedBooking
    });
  } catch (error) {
    console.error('Error creating test booking:', error);
    
    // Log detailed error information
    if (error instanceof mongoose.Error.ValidationError) {
      console.error('Validation Error:', Object.values(error.errors).map(err => err.message));
    } else if (error instanceof mongoose.Error.CastError) {
      console.error('Cast Error:', error.message);
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      errorType: error instanceof mongoose.Error.ValidationError ? 'ValidationError' : 
                 error instanceof mongoose.Error.CastError ? 'CastError' : 'Unknown'
    }, { status: 500 });
  }
} 