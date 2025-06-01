import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Booking from '@/models/Booking';
import Tour from '@/models/Tour';
import { ObjectId } from 'mongodb';
import registerModels from '@/lib/models';

interface DecodedToken {
  id: string;
  role: string;
  exp: number;
  iat: number;
}

export async function GET() {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    
    // Connect to MongoDB and ensure models are registered
    await connectDB();
    registerModels();
    
    // Find user in database
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Fetch user's bookings
    const allBookings = await Booking.find({ 
      travelerId: user._id 
    })
    .sort({ createdAt: -1 })
    .populate('guideId', 'name avatar')
    .populate('tourId', 'title images location');
    
    const now = new Date();
    
    // Process bookings into upcoming and past
    const upcomingBookings = [];
    const pastBookings = [];
    
    try {
      for (const booking of allBookings) {
        const bookingDate = new Date(booking.date);
        const isUpcoming = bookingDate >= now || 
                           (booking.status !== 'cancelled' && booking.status !== 'completed');
        
        const processedBooking = {
          id: booking._id.toString(),
          tourName: booking.tourName || 'Unnamed Tour',
          guideName: booking.guideName || 'Unknown Guide',
          location: booking.tourId?.location || 'Unknown location',
          date: booking.date,
          time: booking.time || '12:00 PM', // Default if no time specified
          status: booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pending',
          image: booking.tourId?.images?.[0] || 'https://images.unsplash.com/photo-1528493859953-39d70f2a62f2',
          hasReviewed: booking.hasReviewed || false
        };
        
        if (isUpcoming) {
          upcomingBookings.push(processedBooking);
        } else {
          pastBookings.push(processedBooking);
        }
      }
    } catch (err) {
      console.error('Error processing bookings:', err);
      // Continue with empty bookings arrays
    }
    
    // Fetch saved guides
    const savedGuides = [];
    if (user.savedGuides && user.savedGuides.length > 0) {
      try {
        const guidesData = await User.find({
          _id: { $in: user.savedGuides },
          role: 'guide'
        });
        
        for (const guide of guidesData) {
          savedGuides.push({
            id: guide._id.toString(),
            name: guide.name,
            location: guide.location || 'Location not specified',
            rating: guide.rating || 4.5,
            specialty: guide.specialty || 'Local Guide',
            image: guide.avatar || 'https://images.unsplash.com/photo-1566753323558-f4e0952af115'
          });
        }
      } catch (err) {
        console.error('Error fetching saved guides:', err);
        // Continue with empty savedGuides array
      }
    }
    
    // Construct user data response
    const userData = {
      name: user.name,
      email: user.email,
      avatar: user.avatar || '/images/default-avatar.png',
      phone: user.phone || '',
      location: user.location || '',
      dob: user.dob || '',
      bio: user.bio || '',
      preferences: {
        tourTypes: user.preferences?.tourTypes || [],
        languages: user.preferences?.languages || []
      },
      profileCompleted: user.profileCompleted || false,
      upcomingBookings,
      pastBookings,
      savedGuides
    };
    
    return NextResponse.json({
      success: true,
      userData
    });
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch dashboard data'
    }, { status: 500 });
  }
} 