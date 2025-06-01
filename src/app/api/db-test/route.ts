import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  let client = null;
  
  try {
    // Log the MongoDB URI (first few characters only for security)
    const mongoUri = process.env.MONGODB_URI || '';
    console.log('MongoDB URI (partial):', mongoUri.substring(0, 20) + '...');
    
    // Connect directly to MongoDB
    client = new MongoClient(mongoUri);
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    // Get the database name from the URI
    const dbName = mongoUri.split('/').pop()?.split('?')[0] || 'find_best_guide';
    console.log('Database name:', dbName);
    
    // Get the database
    const db = client.db(dbName);
    
    // List collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('Collections:', collectionNames);
    
    // Insert a test document
    const testCollection = db.collection('test_documents');
    const testDoc = {
      name: 'Test Document',
      createdAt: new Date(),
      testValue: Math.random().toString(36).substring(2, 15)
    };
    
    const result = await testCollection.insertOne(testDoc);
    console.log('Inserted test document with ID:', result.insertedId);
    
    // Count documents in users collection
    const userCount = await db.collection('users').countDocuments();
    console.log('User count:', userCount);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection and write test successful',
      collections: collectionNames,
      testDocumentId: result.insertedId.toString(),
      userCount
    });
  } catch (error) {
    console.error('Database test error:', error);
    
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