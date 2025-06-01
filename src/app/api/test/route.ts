import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    
    // Count users
    const userCount = await User.countDocuments();
    
    // Get all users (without passwords)
    const users = await User.find().select('-password');
    
    return NextResponse.json({
      message: 'Database connection successful',
      userCount,
      users,
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to database' },
      { status: 500 }
    );
  }
} 