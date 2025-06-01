import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

interface TestResults {
  getProfile: {
    success: boolean;
    message?: string;
    data?: any;
  };
  updateProfile: {
    success: boolean;
    message?: string;
    data?: any;
  };
}

export async function GET() {
  const MONGODB_URI = process.env.MONGODB_URI;
  const JWT_SECRET = process.env.JWT_SECRET;
  
  if (!MONGODB_URI || !JWT_SECRET) {
    return NextResponse.json({
      success: false,
      message: 'Server configuration error'
    }, { status: 500 });
  }

  const client = new MongoClient(MONGODB_URI);
  const results: TestResults = {
    getProfile: { success: false },
    updateProfile: { success: false }
  };
  
  try {
    await client.connect();
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Find a test user (first user with role 'traveler')
    const testUser = await usersCollection.findOne({ role: 'traveler' });
    
    if (!testUser) {
      return NextResponse.json({
        success: false,
        message: 'No test user found'
      }, { status: 404 });
    }
    
    // Create a test token
    const token = jwt.sign(
      { 
        id: testUser._id.toString(),
        email: testUser.email,
        role: testUser.role
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Set the token as a cookie for testing
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/'
    });
    
    // Test get profile endpoint
    const getProfileResponse = await fetch(new URL('/api/users/get-profile', 'http://localhost:3000').toString(), {
      headers: {
        Cookie: `token=${token}`
      }
    });
    
    const getProfileData = await getProfileResponse.json();
    results.getProfile = {
      success: getProfileResponse.ok,
      message: getProfileResponse.ok ? 'Get profile successful' : 'Get profile failed',
      data: getProfileData
    };
    
    // Test update profile endpoint with a simple name update
    const updateData = {
      name: `Test User ${new Date().toISOString()}`
    };
    
    const updateProfileResponse = await fetch(new URL('/api/users/update-profile', 'http://localhost:3000').toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${token}`
      },
      body: JSON.stringify(updateData)
    });
    
    const updateProfileData = await updateProfileResponse.json();
    results.updateProfile = {
      success: updateProfileResponse.ok,
      message: updateProfileResponse.ok ? 'Update profile successful' : 'Update profile failed',
      data: updateProfileData
    };
    
    return NextResponse.json({
      success: true,
      message: 'Profile API test completed',
      results,
      token,
      user: {
        id: testUser._id.toString(),
        email: testUser.email,
        role: testUser.role
      }
    }, {
      headers: {
        'Set-Cookie': `token=${token}; Path=/; HttpOnly; SameSite=Strict`
      }
    });
    
  } catch (error) {
    console.error('Error testing profile API:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to test profile API',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      results
    }, { status: 500 });
  } finally {
    await client.close();
  }
} 