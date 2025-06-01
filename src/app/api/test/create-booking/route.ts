import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Get JWT token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    // Verify token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    const decoded = jwt.verify(token, secret) as any;
    
    // Support different token formats (id or userId)
    const guideId = decoded.id || decoded.userId;
    
    if (!guideId) {
      return NextResponse.json({ success: false, error: 'Invalid token format' }, { status: 401 });
    }
    
    if (decoded.role !== 'guide') {
      return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 403 });
    }
    
    // Connect to MongoDB
    await connectDB();
    
    // Generate a test booking
    const testBooking = {
      travelerId: new mongoose.Types.ObjectId(),
      travelerName: 'Test Traveler',
      travelerEmail: 'test@traveler.com',
      guideId: guideId,
      guideName: decoded.name || 'Test Guide',
      tourId: new mongoose.Types.ObjectId(),
      tourName: 'Sample City Tour',
      date: new Date().toISOString().split('T')[0],
      participants: 2,
      totalPrice: 2500,
      status: 'pending',
      createdAt: new Date()
    };
    
    // Create booking
    const booking = new Booking(testBooking);
    await booking.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test booking created successfully',
      booking: {
        id: booking._id.toString(),
        ...testBooking,
        guideId: booking.guideId.toString(),
        tourId: booking.tourId.toString(),
        travelerId: booking.travelerId.toString(),
      }
    });
  } catch (error) {
    console.error('Error creating test booking:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Error creating test booking'
    }, { status: 500 });
  }
} 