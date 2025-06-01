import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import User from '@/models/User';
import Tour from '@/models/Tour';
import registerModels from '@/lib/models';

interface DecodedToken {
  id: string;
  email: string;
  role: string;
}

export async function POST(request: Request) {
  try {
    console.log('Tour booking request received');
    
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      console.log('Authentication required - no token found');
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    console.log(`User authenticated: ${decoded.id}, role: ${decoded.role}`);

    // Connect to database and register models
    await connectDB();
    registerModels();
    
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log(`User not found: ${decoded.id}`);
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    if (user.role !== 'traveler') {
      console.log(`User role not traveler: ${user.role}`);
      return NextResponse.json(
        { success: false, error: 'Only travelers can create bookings' },
        { status: 403 }
      );
    }

    // Get booking data from request
    const bookingData = await request.json();
    console.log('Booking data received:', bookingData);

    // Validate required fields
    const requiredFields = ['tourId', 'date', 'participants'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);
    
    if (missingFields.length > 0) {
      console.log(`Missing required fields: ${missingFields.join(', ')}`);
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Get tour details
    const tour = await Tour.findById(bookingData.tourId).populate('guideId', 'name email');
    
    if (!tour) {
      console.log(`Tour not found: ${bookingData.tourId}`);
      return NextResponse.json(
        { success: false, error: 'Tour not found' },
        { status: 404 }
      );
    }

    // Calculate total price
    const totalPrice = tour.price * bookingData.participants;

    // Create new booking
    console.log('Creating new booking in database');
    const booking = new Booking({
      travelerId: user._id,
      travelerName: user.name,
      travelerEmail: user.email,
      guideId: tour.guideId._id,
      guideName: tour.guideId.name,
      tourId: tour._id,
      tourName: tour.title,
      date: bookingData.date,
      time: bookingData.time || tour.startTime || '09:00 AM',
      participants: bookingData.participants,
      totalPrice: totalPrice,
      status: 'pending',
      createdAt: new Date()
    });

    // Save booking to database
    await booking.save();
    console.log(`Booking saved successfully with ID: ${booking._id}`);

    // Send notification to guide (implementation depends on your notification system)
    // This could be an email, a notification in the app, etc.

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      booking: {
        id: booking._id,
        tourName: booking.tourName,
        guideName: booking.guideName,
        date: booking.date,
        time: booking.time,
        participants: booking.participants,
        totalPrice: booking.totalPrice,
        status: booking.status
      }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create booking' },
      { status: 500 }
    );
  }
} 