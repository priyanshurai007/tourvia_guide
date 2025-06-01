import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import User from '@/models/User';
import { sendEmail, generateBookingConfirmationEmail } from '@/lib/email';

interface DecodedToken {
  id: string;
  email: string;
  role: string;
}

// POST /api/bookings
export async function POST(request: Request) {
  try {
    console.log('Booking request received');
    
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

    // Check if user exists and is a traveler
    await connectDB();
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
    const requiredFields = ['guideId', 'guideName', 'tourId', 'tourName', 'date', 'participants', 'totalPrice'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);
    
    if (missingFields.length > 0) {
      console.log(`Missing required fields: ${missingFields.join(', ')}`);
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Create new booking
    console.log('Creating new booking in database');
    const booking = new Booking({
      travelerId: user._id,
      travelerName: user.name,
      travelerEmail: user.email,
      ...bookingData,
      status: 'pending',
      createdAt: new Date()
    });

    // Save booking to database
    await booking.save();
    console.log(`Booking saved successfully with ID: ${booking._id}`);

    // Try to send booking confirmation email
    try {
      console.log('Preparing to send confirmation email');
      const emailHtml = generateBookingConfirmationEmail({
        travelerName: user.name,
        guideName: bookingData.guideName,
        tourName: bookingData.tourName,
        date: bookingData.date,
        participants: bookingData.participants,
        totalPrice: bookingData.totalPrice
      });

      await sendEmail({
        to: user.email,
        subject: `Tour Booking Confirmation - ${bookingData.tourName}`,
        html: emailHtml
      });
      console.log(`Confirmation email sent to ${user.email}`);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Continue with the booking process even if email fails
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking._id,
        guideId: booking.guideId,
        tourId: booking.tourId,
        date: booking.date,
        participants: booking.participants,
        totalPrice: booking.totalPrice,
        status: booking.status,
        createdAt: booking.createdAt
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

// GET /api/bookings
export async function GET(request: Request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    // Connect to database
    await connectDB();

    // Get user
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get bookings based on user role
    let bookings;
    if (user.role === 'traveler') {
      bookings = await Booking.find({ travelerId: user._id })
        .sort({ createdAt: -1 })
        .populate('guideId', 'name email phone')
        .populate('tourId', 'title price');
    } else if (user.role === 'guide') {
      bookings = await Booking.find({ guideId: user._id })
        .sort({ createdAt: -1 })
        .populate('travelerId', 'name email')
        .populate('tourId', 'title price');
    }

    return NextResponse.json({
      success: true,
      bookings: bookings.map(booking => ({
        id: booking._id,
        guideId: booking.guideId,
        travelerId: booking.travelerId,
        tourId: booking.tourId,
        date: booking.date,
        participants: booking.participants,
        totalPrice: booking.totalPrice,
        status: booking.status,
        createdAt: booking.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
} 