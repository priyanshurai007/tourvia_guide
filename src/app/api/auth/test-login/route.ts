import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function GET() {
  console.log('Test login endpoint called');
  
  // Check if MongoDB URI is set
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set');
    return NextResponse.json(
      { success: false, error: 'MongoDB URI not set' },
      { status: 500 }
    );
  }

  let client;
  try {
    // Connect to MongoDB
    client = new MongoClient(uri);
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');

    // Get database name from URI
    const dbName = uri.split('/').pop()?.split('?')[0];
    console.log(`Database name: ${dbName}`);
    const db = client.db(dbName);

    // Check if users collection exists
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('Collections:', collectionNames);
    
    if (!collectionNames.includes('users')) {
      return NextResponse.json(
        { success: false, error: 'Users collection not found', collections: collectionNames },
        { status: 500 }
      );
    }

    // Count users
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log(`User count: ${userCount}`);
    
    if (userCount === 0) {
      return NextResponse.json(
        { success: false, error: 'No users found in database' },
        { status: 500 }
      );
    }

    // Get a sample user for testing
    const sampleUser = await usersCollection.findOne({});
    if (!sampleUser) {
      return NextResponse.json(
        { success: false, error: 'Could not retrieve sample user' },
        { status: 500 }
      );
    }

    // Check if JWT secret is set
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json(
        { success: false, error: 'JWT_SECRET not set' },
        { status: 500 }
      );
    }

    // Generate test token
    const token = jwt.sign(
      {
        id: sampleUser._id.toString(),
        name: sampleUser.name || 'Test User',
        email: sampleUser.email,
        role: sampleUser.role || 'traveler',
      },
      jwtSecret,
      { expiresIn: '1h' }
    );

    // Prepare user object without password
    const { password, ...userWithoutPassword } = sampleUser;

    // Return success response with sample user and token
    return NextResponse.json({
      success: true,
      message: 'Login test successful',
      user: userWithoutPassword,
      token,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error during login test:', error);
    return NextResponse.json({
      success: false,
      error: 'Error during login test',
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack,
      } : undefined,
    }, { status: 500 });
  } finally {
    // Close MongoDB connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
} 