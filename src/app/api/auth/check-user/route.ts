import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function POST(request: Request) {
  let client = null;
  
  try {
    // Parse the request body for the email
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 });
    }
    
    console.log(`Checking for user with email: ${email}`);
    
    // Check for MONGODB_URI
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    // Connect directly to MongoDB
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    
    // Determine database name from connection string
    const uri = process.env.MONGODB_URI;
    const dbName = uri.split('/').pop()?.split('?')[0] || 'find_best_guide';
    
    const db = client.db(dbName);
    
    // Check if users collection exists
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    if (!collectionNames.includes('users')) {
      return NextResponse.json({
        success: false,
        error: 'Users collection not found'
      }, { status: 404 });
    }
    
    // Check for the user in both original and lowercase email formats
    const normalizedEmail = email.toLowerCase().trim();
    
    const user = await db.collection('users').findOne(
      {
        $or: [
          { email },
          { email: normalizedEmail }
        ]
      },
      { projection: { _id: 1, email: 1, name: 1, role: 1 } } // Only return non-sensitive fields
    );
    
    if (!user) {
      return NextResponse.json({
        success: false,
        exists: false,
        message: 'User not found',
        // Provide hints about what email was searched
        searchedFor: [email, normalizedEmail]
      });
    }
    
    // Format ObjectId to string
    if (user._id) {
      user._id = user._id.toString();
    }
    
    return NextResponse.json({
      success: true,
      exists: true,
      message: 'User found',
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Check user error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      stack: process.env.NODE_ENV !== 'production' && error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
} 