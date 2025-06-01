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

    try {
      const decoded = jwt.verify(token, secret) as any;
      
      // Support both token formats (id or userId)
      const guideId = decoded.id || decoded.userId;
      
      console.log('Token decoded:', { 
        guideId,
        role: decoded.role, 
        tokenKeys: Object.keys(decoded)
      });
      
      if (!guideId) {
        return NextResponse.json({ success: false, error: 'Invalid token format' }, { status: 401 });
      }
      
      if (decoded.role !== 'guide') {
        return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 403 });
      }
      
      // Connect to MongoDB
      await connectDB();
      
      console.log('Guide ID from token:', guideId);
      
      // Find all bookings first to debug
      const allBookings = await Booking.find({});
      console.log('All bookings in system:', allBookings.length);
      
      if (allBookings.length > 0) {
        console.log('Sample booking fields:', Object.keys(allBookings[0].toObject()));
        console.log('Sample guideId in DB:', allBookings[0].guideId);
      }
      
      // Find bookings for this guide - try both string and ObjectId comparison
      const bookings = await Booking.find({ 
        $or: [
          { guideId: guideId },
          { guideId: guideId.toString() },
          { guideId: new mongoose.Types.ObjectId(guideId) }
        ]
      })
      .sort({ createdAt: -1 });
      
      console.log('Bookings found for guide:', bookings.length);
      
      // Transform bookings to frontend format
      const transformedBookings = bookings.map(booking => {
        const bookingObj = booking.toObject();
        
        console.log(`Processing booking ${booking._id}:`, {
          travelerName: booking.travelerName,
          tourName: booking.tourName,
          totalPrice: booking.totalPrice,
          status: booking.status
        });
        
        return {
          id: booking._id.toString(),
          travelerName: booking.travelerName || 'Unknown',
          travelerEmail: booking.travelerEmail || 'No email',
          tourName: booking.tourName || 'Unnamed Tour',
          date: booking.date,
          participants: booking.participants,
          totalPrice: booking.totalPrice,
          status: booking.status,
          createdAt: booking.createdAt
        };
      });
      
      console.log('Transformed bookings:', transformedBookings.length);
      
      return NextResponse.json({ 
        success: true, 
        bookings: transformedBookings 
      });
      
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ success: false, error: 'Error fetching bookings' }, { status: 500 });
  }
} 