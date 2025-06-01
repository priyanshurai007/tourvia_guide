import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(request: Request) {
  let client = null;
  
  try {
    console.log('Testing database connection...');
    
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
    console.log('Using database:', dbName);
    
    const db = client.db(dbName);
    
    // Check if users collection exists
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    if (!collectionNames.includes('users')) {
      return NextResponse.json({
        success: false,
        error: 'Users collection not found',
        collections: collectionNames
      }, { status: 404 });
    }
    
    // Count users
    const usersCount = await db.collection('users').countDocuments();
    
    // Get a sample user (removing sensitive info)
    const sampleUser = await db.collection('users').findOne(
      {},
      { projection: { password: 0 } } // Exclude password
    );
    
    // Format ObjectId to string
    if (sampleUser && sampleUser._id) {
      sampleUser._id = sampleUser._id.toString();
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      dbName,
      collections: collectionNames,
      usersCount,
      sampleUser
    });
  } catch (error) {
    console.error('Database test error:', error);
    
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