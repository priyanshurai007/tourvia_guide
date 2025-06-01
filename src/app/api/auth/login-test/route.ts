import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

interface TestResults {
  loginTest: {
    success: boolean;
    details?: string;
    error?: string;
  };
  dashboardTest: {
    success: boolean;
    details?: string;
    error?: string;
  };
}

export async function GET() {
  let client = null;
  const testResults: TestResults = {
    loginTest: { success: false },
    dashboardTest: { success: false }
  };
  
  try {
    console.log('Starting login and dashboard test...');
    
    // Check for required environment variables
    if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
      return NextResponse.json({
        success: false,
        error: 'Missing required environment variables (MONGODB_URI or JWT_SECRET)'
      }, { status: 500 });
    }
    
    // Connect to MongoDB
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    
    // Determine database name from connection string
    const uri = process.env.MONGODB_URI;
    const dbName = uri.split('/').pop()?.split('?')[0] || '';
    const db = client.db(dbName);
    
    // Find a test user
    const usersCollection = db.collection('users');
    const testUser = await usersCollection.findOne({ role: 'traveler' });
    
    if (!testUser) {
      return NextResponse.json({
        success: false,
        error: 'No test user found'
      }, { status: 404 });
    }
    
    // Test login by generating a token
    const token = jwt.sign(
      { 
        id: testUser._id.toString(),
        name: testUser.name,
        email: testUser.email,
        role: testUser.role || 'traveler'
      },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );
    
    testResults.loginTest = {
      success: true,
      details: `Generated token for user: ${testUser.email}`
    };
    
    // Test dashboard API with the generated token
    try {
      // Create a fetch request to the dashboard API
      const dashboardResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/dashboard/user-dashboard`, {
        headers: {
          'Cookie': `token=${token}`
        }
      });
      
      if (!dashboardResponse.ok) {
        const errorData = await dashboardResponse.json();
        testResults.dashboardTest = {
          success: false,
          error: `Dashboard API returned error: ${dashboardResponse.status} - ${JSON.stringify(errorData)}`
        };
      } else {
        const dashboardData = await dashboardResponse.json();
        testResults.dashboardTest = {
          success: true,
          details: `Successfully retrieved dashboard data for user: ${testUser.email}`
        };
      }
    } catch (dashboardError) {
      testResults.dashboardTest = {
        success: false,
        error: `Error during dashboard test: ${dashboardError instanceof Error ? dashboardError.message : String(dashboardError)}`
      };
    }
    
    // Prepare response with test user and token
    const response = NextResponse.json({
      success: true,
      message: 'Login and dashboard test completed',
      results: testResults,
      testUser: {
        _id: testUser._id.toString(),
        name: testUser.name,
        email: testUser.email,
        role: testUser.role || 'traveler'
      },
      token
    });
    
    // Set token as cookie for testing
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 60 // 30 minutes in seconds
    });
    
    return response;
  } catch (error) {
    console.error('Test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred during test',
      details: process.env.NODE_ENV === 'development' ? {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      } : undefined
    }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
} 