import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Tour from '@/models/Tour';

export async function GET(request: Request) {
  try {
    console.log('Fetching recommended tours');
    
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Find upcoming tours with available spots
    const tours = await Tour.find({
      date: { $gt: new Date() },
      availableSpots: { $gt: 0 }
    })
      .populate('guideId', 'name')
      .sort({ date: 1 })
      .limit(3);
    
    console.log(`Found ${tours.length} recommended tours`);
    
    return NextResponse.json({
      success: true,
      tours,
      count: tours.length
    });
  } catch (error) {
    console.error('Error fetching recommended tours:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while fetching recommended tours',
      stack: process.env.NODE_ENV !== 'production' && error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 