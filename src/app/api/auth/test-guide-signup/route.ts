import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    // Create a test guide user
    const guideUser = {
      _id: '123456789012345678901234',
      name: 'Test Guide',
      email: 'testguide@example.com',
      role: 'guide',
      avatar: 'https://ui-avatars.com/api/?name=Test+Guide&background=random'
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: guideUser._id, role: 'guide' },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '30d' }
    );

    // Set token in cookies
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60,
      path: '/'
    });

    // Return success response with redirect path
    return NextResponse.json({
      success: true,
      message: 'Guide test account created',
      redirectTo: '/guide-dashboard',
      user: guideUser,
      token
    });
  } catch (error) {
    console.error('Test guide signup error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    }, { status: 500 });
  }
} 