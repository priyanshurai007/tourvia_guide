import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Tour from '@/models/Tour';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Get the URL object from the request
    const url = new URL(request.url);
    
    // Get query parameters
    const guideId = url.searchParams.get('guideId');
    const location = url.searchParams.get('location');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const sortBy = url.searchParams.get('sortBy') || 'date';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';
    
    // Build query
    const query: any = {};
    
    if (guideId) {
      query.guideId = guideId;
    }
    
    if (location) {
      query.location = new RegExp(location, 'i'); // Case-insensitive search
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    
    // Build sort options
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Fetch tours
    const tours = await Tour.find(query)
      .populate('guideId', 'name email rating') // Populate guide details
      .sort(sortOptions);
    
    return NextResponse.json({ tours });
  } catch (error) {
    console.error('Error fetching tours:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch tours. Please try again.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'price', 'duration', 'location', 'date', 'guideId', 'maxParticipants'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Create tour with availableSpots equal to maxParticipants initially
    const newTour = await Tour.create({
      ...body,
      availableSpots: body.maxParticipants,
    });
    
    return NextResponse.json(
      { message: 'Tour created successfully', tour: newTour },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating tour:', error);
    
    return NextResponse.json(
      { error: 'Failed to create tour. Please try again.' },
      { status: 500 }
    );
  }
} 