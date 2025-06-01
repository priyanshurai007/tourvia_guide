import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import Tour from '@/models/Tour';
import User from '@/models/User';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  let client = null;
  
  try {
    console.log('Fetching bookings for user:', params.userId);
    
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Find user to verify they exist
    const user = await User.findById(params.userId);
    if (!user) {
      console.log('User not found with ID:', params.userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Find bookings for this user
    const bookings = await Booking.find({ userId: params.userId })
      .populate({
        path: 'tourId',
        populate: { path: 'guideId', select: 'name' }
      })
      .sort({ bookingDate: -1 })
      .limit(5);
    
    console.log(`Found ${bookings.length} bookings for user:`, params.userId);
    
    return NextResponse.json({
      success: true,
      bookings,
      count: bookings.length
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while fetching bookings',
      stack: process.env.NODE_ENV !== 'production' && error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 