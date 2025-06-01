import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

interface DecodedToken {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  exp: number;
}

export async function DELETE(request: Request) {
  try {
    console.log('Removing saved guide...');
    
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Not authenticated'
      }, { status: 401 });
    }
    
    // Parse request body to get guideId
    const body = await request.json();
    const { guideId } = body;
    
    if (!guideId) {
      return NextResponse.json({
        success: false,
        error: 'Guide ID is required'
      }, { status: 400 });
    }
    
    // This is a placeholder that simulates successful removal
    return NextResponse.json({
      success: true,
      message: 'Guide removed from saved collection'
    });
  } catch (error) {
    console.error('Error removing saved guide:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while removing the guide',
      stack: process.env.NODE_ENV !== 'production' && error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 