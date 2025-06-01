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
  email?: string;
  role?: string;
  exp: number;
}

export async function GET(
  request: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const bookingId = params.bookingId;
    
    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      );
    }

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
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Connect to DB
    await connectDB();
    registerModels();

    // Find the booking
    const booking = await Booking.findById(bookingId)
      .populate('tourId', 'title price duration description images location')
      .populate('guideId', 'name email phone avatar bio languages specialty')
      .exec();

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify that the user is authorized to view this booking
    const userId = decoded.id;
    const isGuide = decoded.role === 'guide';
    const isTraveler = decoded.role === 'traveler';

    if (
      (isTraveler && booking.travelerId.toString() !== userId) ||
      (isGuide && booking.guideId.toString() !== userId)
    ) {
      return NextResponse.json(
        { success: false, error: 'You are not authorized to view this booking' },
        { status: 403 }
      );
    }

    // Transform the booking for the response
    const bookingDetails = {
      id: booking._id.toString(),
      traveler: {
        id: booking.travelerId.toString(),
        name: booking.travelerName,
        email: booking.travelerEmail
      },
      guide: {
        id: booking.guideId._id.toString(),
        name: booking.guideId.name,
        email: booking.guideId.email,
        phone: booking.guideId.phone,
        avatar: booking.guideId.avatar,
        bio: booking.guideId.bio,
        languages: booking.guideId.languages,
        specialty: booking.guideId.specialty
      },
      tour: {
        id: booking.tourId._id.toString(),
        title: booking.tourId.title,
        price: booking.tourId.price,
        duration: booking.tourId.duration,
        description: booking.tourId.description,
        images: booking.tourId.images,
        location: booking.tourId.location
      },
      date: booking.date,
      time: booking.time,
      participants: booking.participants,
      totalPrice: booking.totalPrice,
      status: booking.status,
      createdAt: booking.createdAt
    };

    return NextResponse.json({
      success: true,
      booking: bookingDetails
    });
  } catch (error) {
    console.error('Error fetching booking details:', error);
    return NextResponse.json(
      { success: false, error: 'Error fetching booking details' },
      { status: 500 }
    );
  }
} 