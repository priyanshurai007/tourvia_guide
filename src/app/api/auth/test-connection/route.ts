import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  console.log('Test connection endpoint called');
  
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

    // Check collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('Collections:', collectionNames);

    // Check if users collection exists
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

    // Get a sample user without password
    let sampleUser = null;
    if (userCount > 0) {
      const user = await usersCollection.findOne({});
      if (user) {
        const { password, ...userWithoutPassword } = user;
        sampleUser = userWithoutPassword;
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      database: {
        name: dbName,
        collections: collectionNames,
        userCount
      },
      sampleUser
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error connecting to MongoDB:', error);
    return NextResponse.json({
      success: false,
      error: 'Error connecting to MongoDB',
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
    }, { status: 500 });
  } finally {
    // Close MongoDB connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
} 