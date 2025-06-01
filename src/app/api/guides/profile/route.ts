import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Connect to MongoDB using Mongoose
    await connectDB();
    const db = mongoose.connection.db;
    
    let query: any = { role: 'guide' };

    // If slug is provided, use it for querying
    if (slug) {
      // Check if the slug looks like a MongoDB ObjectId
      if (slug.match(/^[0-9a-fA-F]{24}$/)) {
        query = { 
          $or: [
            { slug: slug },
            { _id: new mongoose.Types.ObjectId(slug) }
          ],
          role: 'guide'
        };
      } else {
        query = { slug: slug, role: 'guide' };
      }
    }
    // If no slug, try to use token
    else if (token) {
      let decodedToken: DecodedToken;
      try {
        decodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;
        if (decodedToken.role !== 'guide') {
          return NextResponse.json(
            { success: false, message: 'Unauthorized access' },
            { status: 403 }
          );
        }
        query = { 
          _id: new mongoose.Types.ObjectId(decodedToken.id),
          role: 'guide'
        };
      } catch (error) {
        return NextResponse.json({
          success: false,
          message: 'Invalid token'
        }, { status: 401 });
      }
    } else {
      return NextResponse.json(
        { success: false, message: 'Either slug or valid authentication required' },
        { status: 400 }
      );
    }

    // Find the guide in the database
    const guide = await db.collection('users').findOne(query, { projection: { password: 0 } });

    if (!guide) {
      return NextResponse.json(
        { success: false, error: 'Guide not found' },
        { status: 404 }
      );
    }

    // Fetch tours for this guide from the tours collection
    const tours = await db.collection('tours').find({ 
      guideId: new mongoose.Types.ObjectId(guide._id)
    }).toArray();
    
    console.log(`Found ${tours.length} tours for guide ${guide.name}`);
    
    // Transform tours data for frontend
    const transformedTours = tours.length > 0 ? tours.map(tour => {
      // Log the tour data to debug
      console.log('Tour data from DB:', {
        id: tour._id.toString(),
        title: tour.title,
        name: tour.name,
        keys: Object.keys(tour)
      });
      
      // Make sure we use title if available, otherwise use name
      const tourTitle = tour.title || tour.name || 'Unnamed Tour';
      
      return {
        id: tour._id.toString(),
        title: tourTitle,
        description: tour.description || 'No description available',
        duration: tour.duration ? `${tour.duration} ${tour.duration === 1 ? 'hour' : 'hours'}` : '3 hours',
        price: tour.price || 2000,
        image: tour.image || 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=1470',
        maxParticipants: tour.maxParticipants || 8,
        location: tour.location || guide.location,
        date: tour.date ? new Date(tour.date).toISOString().split('T')[0] : null
      };
    }) : [
      {
        id: '1',
        title: 'Local City Tour',
        description: 'Explore the highlights of the city with a knowledgeable local guide.',
        duration: '3 hours',
        price: 2200,
        image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=1470',
        maxParticipants: 8
      },
      {
        id: '2',
        title: 'Cultural Experience',
        description: 'Immerse yourself in local culture with visits to traditional sites and experiences.',
        duration: '4 hours',
        price: 2800,
        image: 'https://images.unsplash.com/photo-1602424130259-aa54ea657bac?auto=format&fit=crop&q=80&w=1470',
        maxParticipants: 6
      }
    ];
    
    // Fetch availability data if exists, or generate default
    let availability = guide.availability || [];
    
    // If no availability data exists, generate default availability data based on tours
    if (!availability || availability.length === 0) {
      // Generate dates for the next 14 days
      const today = new Date();
      const dates = [];
      
      for (let i = 1; i <= 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        // Skip weekends (6 = Saturday, 0 = Sunday)
        if (date.getDay() !== 6 && date.getDay() !== 0) {
          dates.push(date.toISOString().split('T')[0]);
        }
      }
      
      // Generate slots for each date
      availability = dates.map(date => ({
        date,
        slots: ['09:00', '12:00', '15:00'].filter(() => Math.random() > 0.3) // Randomly remove some slots
      })).filter(item => item.slots.length > 0); // Remove dates with no slots
    }
    
    // Transform guide data for frontend
    const transformedGuide = {
      id: guide._id.toString(),
      name: guide.name || 'Guide',
      location: guide.location || 'India',
      languages: Array.isArray(guide.languages) ? guide.languages : [guide.languages || 'English'],
      rating: guide.rating || 4.5,
      reviews: guide.reviews || Math.floor(Math.random() * 100) + 20,
      price: guide.price || 2000,
      experience: guide.experience || 3,
      bio: guide.bio || 'Professional tour guide with a passion for sharing local culture and history.',
      profileImage: guide.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      galleryImages: guide.galleryImages || [
        'https://images.unsplash.com/photo-1598924957323-4700f9e40826?auto=format&fit=crop&q=80&w=1470',
        'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=1470',
        'https://images.unsplash.com/photo-1602424130259-aa54ea657bac?auto=format&fit=crop&q=80&w=1470',
        'https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&q=80&w=1470',
      ],
      specialties: Array.isArray(guide.specialties) ? guide.specialties : [guide.specialties || 'Tours'],
      tours: transformedTours,
      availability: availability,
      slug: guide.slug || guide._id.toString(),
      email: guide.email || '',
      phone: guide.phone || ''
    };
    
    return NextResponse.json({ 
      success: true, 
      guide: transformedGuide 
    });
  } catch (error) {
    console.error('Error fetching guide profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch guide profile', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Get token from cookies
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    
    // Check if user is a guide
    if (decoded.role !== 'guide') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    // Parse request body
    const data = await request.json();
    
    // Connect to MongoDB using Mongoose
    await connectDB();
    const db = mongoose.connection.db;

    // Prepare update object with only allowed fields
    const allowedFields = [
      'name', 'phone', 'location', 'about', 'website', 
      'languages', 'specialties', 'experience',
      'socialMedia', 'avatar', 'coverImage'
    ];
    
    const updateData: Record<string, any> = {};
    
    // Filter out only allowed fields
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }
    
    // Update guide in database
    const result = await db.collection('users').updateOne(
      { _id: new mongoose.Types.ObjectId(decoded.id), role: 'guide' },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Profile updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating guide profile:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update guide profile'
    }, { status: 500 });
  }
}