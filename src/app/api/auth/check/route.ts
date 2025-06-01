import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

interface DecodedToken {
  id: string;
  email: string;
  role: string;
}

export async function GET() {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({
        isAuthenticated: false,
        message: 'No token found'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    // Connect to database
    await connectDB();

    // Check if user exists
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({
        isAuthenticated: false,
        message: 'User not found'
      });
    }

    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({
      isAuthenticated: false,
      message: 'Invalid token'
    });
  }
} 