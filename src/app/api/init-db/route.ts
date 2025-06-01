import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Tour from '@/models/Tour';
import Booking from '@/models/Booking';
import Guide from '@/models/Guide';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    console.log('Starting database initialization...');
    await connectDB();
    console.log('Connected to MongoDB');

    // Create a test admin user
    console.log('Creating test admin user...');
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@example.com' },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedAdminPassword,
        role: 'admin',
      },
      { upsert: true, new: true }
    );
    console.log('Admin user created or updated:', adminUser._id);

    // Create test traveler
    console.log('Creating test traveler...');
    const hashedTravelerPassword = await bcrypt.hash('traveler123', 10);
    const travelerUser = await User.findOneAndUpdate(
      { email: 'traveler@example.com' },
      {
        name: 'Test Traveler',
        email: 'traveler@example.com',
        password: hashedTravelerPassword,
        role: 'traveler',
      },
      { upsert: true, new: true }
    );
    console.log('Traveler user created or updated:', travelerUser._id);

    // Create test guide
    console.log('Creating test guide...');
    const hashedGuidePassword = await bcrypt.hash('guide123', 10);
    const guide = await Guide.findOneAndUpdate(
      { email: 'guide@example.com' },
      {
        name: 'Test Guide',
        email: 'guide@example.com',
        password: hashedGuidePassword,
        bio: 'Experienced tour guide with 5 years of experience',
        location: 'New Delhi, India',
        languages: ['English', 'Hindi'],
        rating: 4.8,
        reviewCount: 25,
      },
      { upsert: true, new: true }
    );
    console.log('Guide created or updated:', guide._id);

    // Create test tours
    console.log('Creating test tours...');
    const tour1 = await Tour.findOneAndUpdate(
      { title: 'Delhi Heritage Walk' },
      {
        title: 'Delhi Heritage Walk',
        description: 'Explore the rich history of Delhi with our expert guide',
        price: 2500,
        duration: 4,
        location: 'Delhi, India',
        image: '/images/tours/delhi-heritage.jpg',
        date: new Date('2023-12-20'),
        guideId: guide._id,
        maxParticipants: 15,
        availableSpots: 10,
      },
      { upsert: true, new: true }
    );
    console.log('Tour 1 created or updated:', tour1._id);

    const tour2 = await Tour.findOneAndUpdate(
      { title: 'Agra Taj Mahal Tour' },
      {
        title: 'Agra Taj Mahal Tour',
        description: 'Visit the iconic Taj Mahal and Agra Fort in a day trip',
        price: 4500,
        duration: 12,
        location: 'Agra, India',
        image: '/images/tours/taj-mahal.jpg',
        date: new Date('2023-12-25'),
        guideId: guide._id,
        maxParticipants: 20,
        availableSpots: 15,
      },
      { upsert: true, new: true }
    );
    console.log('Tour 2 created or updated:', tour2._id);

    // Create test bookings
    console.log('Creating test bookings...');
    const booking1 = await Booking.findOneAndUpdate(
      {
        userId: travelerUser._id,
        tourId: tour1._id,
      },
      {
        userId: travelerUser._id,
        tourId: tour1._id,
        bookingDate: new Date('2023-11-15'),
        numberOfParticipants: 2,
        totalAmount: 5000,
        status: 'confirmed',
        paymentStatus: 'paid',
      },
      { upsert: true, new: true }
    );
    console.log('Booking 1 created or updated:', booking1._id);

    const booking2 = await Booking.findOneAndUpdate(
      {
        userId: travelerUser._id,
        tourId: tour2._id,
      },
      {
        userId: travelerUser._id,
        tourId: tour2._id,
        bookingDate: new Date('2023-11-18'),
        numberOfParticipants: 3,
        totalAmount: 13500,
        status: 'pending',
        paymentStatus: 'unpaid',
      },
      { upsert: true, new: true }
    );
    console.log('Booking 2 created or updated:', booking2._id);

    // Get counts
    const userCount = await User.countDocuments();
    const guideCount = await Guide.countDocuments();
    const tourCount = await Tour.countDocuments();
    const bookingCount = await Booking.countDocuments();

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      counts: {
        users: userCount,
        guides: guideCount,
        tours: tourCount,
        bookings: bookingCount,
      },
      testCredentials: {
        admin: { email: 'admin@example.com', password: 'admin123' },
        traveler: { email: 'traveler@example.com', password: 'traveler123' },
        guide: { email: 'guide@example.com', password: 'guide123' },
      },
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Database initialization failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
} 