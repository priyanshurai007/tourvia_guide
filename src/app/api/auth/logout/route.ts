import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create response object
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
    // Clear the auth token cookie
    response.cookies.set({
      name: 'token',
      value: '',
      expires: new Date(0), // Set expiration to the epoch to invalidate immediately
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Failed to logout' },
      { status: 500 }
    );
  }
} 