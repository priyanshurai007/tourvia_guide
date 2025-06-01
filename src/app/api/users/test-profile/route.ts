import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

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
  const results: TestResults = {
    getProfile: {
      success: false
    },
    updateProfile: {
      success: false
    }
  };
  
  const MONGODB_URI = process.env.MONGODB_URI;
  const JWT_SECRET = process.env.JWT_SECRET;
  
  if (!MONGODB_URI || !JWT_SECRET) {
    return NextResponse.json({
      success: false,
      message: 'Missing environment variables',
      missingVars: {
        MONGODB_URI: !MONGODB_URI,
        JWT_SECRET: !JWT_SECRET
      }
    }, { status: 500 });
  }
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Find a test user
    const testUser = await usersCollection.findOne({ role: 'traveler' });
    
    if (!testUser) {
      return NextResponse.json({
        success: false,
        message: 'No test user found'
      }, { status: 404 });
    }
    
    console.log(`Found test user: ${testUser.email}`);
    
    // Generate a token for the test user
    const token = jwt.sign(
      { 
        id: testUser._id.toString(),
        email: testUser.email,
        role: testUser.role
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('Generated token for test user');
    
    // Test GET profile endpoint
    try {
      const getProfileResponse = await fetch(new URL('/api/users/get-profile', 'http://localhost:3000').toString(), {
        method: 'GET',
        headers: {
          'Cookie': `token=${token}`
        }
      });
      
      const getProfileData = await getProfileResponse.json();
      
      results.getProfile = {
        success: getProfileResponse.ok,
        message: getProfileResponse.ok ? 'Successfully fetched profile' : 'Failed to fetch profile',
        data: getProfileData
      };
      
      console.log('Tested GET profile endpoint');
    } catch (error) {
      results.getProfile = {
        success: false,
        message: `Error testing GET profile: ${error}`
      };
    }
    
    // Test UPDATE profile endpoint
    try {
      const updateData = {
        name: 'Test Update Name',
        about: 'This is a test update for the profile'
      };
      
      const updateProfileResponse = await fetch(new URL('/api/users/update-profile', 'http://localhost:3000').toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `token=${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      const updateProfileData = await updateProfileResponse.json();
      
      results.updateProfile = {
        success: updateProfileResponse.ok,
        message: updateProfileResponse.ok ? 'Successfully updated profile' : 'Failed to update profile',
        data: updateProfileData
      };
      
      console.log('Tested UPDATE profile endpoint');
      
      // Revert the changes if the update was successful
      if (updateProfileResponse.ok) {
        const revertData = {
          name: testUser.name || '',
          about: testUser.about || ''
        };
        
        await fetch(new URL('/api/users/update-profile', 'http://localhost:3000').toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `token=${token}`
          },
          body: JSON.stringify(revertData)
        });
        
        console.log('Reverted test changes');
      }
    } catch (error) {
      results.updateProfile = {
        success: false,
        message: `Error testing UPDATE profile: ${error}`
      };
    }
    
    // Set the token as a cookie for manual testing
    const response = NextResponse.json({
      success: true,
      message: 'Profile API test completed',
      results,
      testUser: {
        id: testUser._id.toString(),
        email: testUser.email,
        role: testUser.role
      },
      token
    });
    
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    
    return response;
  } catch (error) {
    console.error('Error in test:', error);
    return NextResponse.json({
      success: false,
      message: 'Test failed',
      error: String(error)
    }, { status: 500 });
  } finally {
    await client.close();
    console.log('Closed MongoDB connection');
  }
} 