import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  let client;
  
  try {
    console.log('Starting direct MongoDB test...');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }
    
    // Connect directly with the MongoDB driver
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('Connected directly to MongoDB!');
    
    // Get the database name from the connection string
    const uri = process.env.MONGODB_URI;
    const dbName = uri.split('/').pop()?.split('?')[0] || 'test';
    
    const db = client.db(dbName);
    const collection = db.collection('direct_test_users');
    
    // Insert a test document
    const testUser = {
      name: 'Direct Test User',
      email: `direct-test-${Date.now()}@example.com`,
      createdAt: new Date(),
    };
    
    console.log('Inserting test document:', testUser);
    const result = await collection.insertOne(testUser);
    
    console.log('Document inserted with ID:', result.insertedId);
    
    // Count documents
    const count = await collection.countDocuments();
    console.log('Total documents in collection:', count);
    
    return NextResponse.json({
      success: true,
      message: 'Direct MongoDB test successful',
      insertedId: result.insertedId.toString(),
      documentCount: count,
      databaseName: dbName,
    });
  } catch (error) {
    console.error('Direct MongoDB test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
} 