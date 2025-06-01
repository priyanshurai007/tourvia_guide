import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
    
    // Check if user is a guide
    if (decoded.role !== 'guide') {
      return NextResponse.json({ error: 'Only guides can access their tours' }, { status: 403 });
    }

    const guideId = decoded.id;

    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();

    // Fetch tours for this guide
    const tours = await db.collection('tours')
      .find({ guideId: new ObjectId(guideId) })
      .sort({ lastUpdated: -1 })
      .toArray();
    
    // Format tours for response
    const formattedTours = tours.map(tour => ({
      id: tour._id.toString(),
      name: tour.name,
      image: tour.image,
      description: tour.description,
      location: tour.location,
      duration: tour.duration,
      price: tour.price,
      maxParticipants: tour.maxParticipants,
      status: tour.status,
      bookings: tour.bookings || 0,
      rating: tour.rating || 0,
      lastUpdated: tour.lastUpdated || tour.createdAt,
      upcoming: tour.upcoming || 0
    }));

    await client.close();

    return NextResponse.json({
      success: true,
      tours: formattedTours
    });
  } catch (error) {
    console.error('Error fetching guide tours:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch tours'
    }, { status: 500 });
  }
} 