import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import User from '@/models/User';
import { ObjectId } from 'mongodb';
import registerModels from '@/lib/models';

interface DecodedToken {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  exp: number;
}

export async function POST(request: Request) {
  try {
    console.log('Canceling booking...');
    
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Not authenticated'
      }, { status: 401 });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    
    // Parse request body to get bookingId
    const body = await request.json();
    const { bookingId } = body;
    
    if (!bookingId) {
      return NextResponse.json({
        success: false,
        error: 'Booking ID is required'
      }, { status: 400 });
    }
    
    // Connect to the database
    await connectDB();
    registerModels();
    
    // Find the booking
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return NextResponse.json({
        success: false,
        error: 'Booking not found'
      }, { status: 404 });
    }
    
    // Verify that this booking belongs to the user
    if (booking.travelerId.toString() !== decoded.id) {
      return NextResponse.json({
        success: false,
        error: 'You are not authorized to cancel this booking'
      }, { status: 403 });
    }
    
    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return NextResponse.json({
        success: false,
        error: 'Booking is already cancelled'
      }, { status: 400 });
    }
    
    // Check if booking is already completed
    if (booking.status === 'completed') {
      return NextResponse.json({
        success: false,
        error: 'Completed bookings cannot be cancelled'
      }, { status: 400 });
    }
    
    // Update booking status to cancelled
    booking.status = 'cancelled';
    await booking.save();
    
    return NextResponse.json({
      success: true,
      message: 'Booking canceled successfully'
    });
  } catch (error) {
    console.error('Error canceling booking:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while canceling the booking',
      stack: process.env.NODE_ENV !== 'production' && error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 