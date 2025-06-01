import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  let client = null;
  
  try {
    console.log('Starting force-write test...');
    console.log('Connection string:', process.env.MONGODB_URI?.split('@')[1]?.split('/')[0] || 'hidden');
    
    // Connect directly with the MongoDB driver
    client = new MongoClient(process.env.MONGODB_URI || '');
    await client.connect();
    console.log('✅ MongoDB connected successfully');
    
    // Try multiple database names
    const possibleDatabases = ['find_best_guide', 'tourguide', 'test'];
    const results = [];
    
    for (const dbName of possibleDatabases) {
      try {
        console.log(`Attempting to write to database: ${dbName}`);
        const db = client.db(dbName);
        
        // Try to write to test_collection
        const testData = {
          name: 'Test User',
          email: `test-user-${Date.now()}@example.com`,
          timestamp: new Date(),
          database: dbName
        };
        
        const result = await db.collection('test_collection').insertOne(testData);
        console.log(`✅ Successfully wrote to ${dbName}.test_collection with ID: ${result.insertedId}`);
        
        // List all collections in this database
        const collections = await db.listCollections().toArray();
        console.log(`Collections in ${dbName}:`, collections.map(c => c.name));
        
        // Count documents in each collection
        const collectionStats = [];
        for (const collection of collections) {
          const count = await db.collection(collection.name).countDocuments();
          collectionStats.push({ name: collection.name, count });
        }
        
        results.push({
          database: dbName,
          insertedId: result.insertedId.toString(),
          collections: collections.map(c => c.name),
          collectionStats
        });
      } catch (dbError) {
        console.error(`❌ Error writing to database ${dbName}:`, dbError.message);
        results.push({
          database: dbName,
          error: dbError.message
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Force write test completed',
      results
    });
  } catch (error) {
    console.error('❌ Force write test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      connectionString: process.env.MONGODB_URI ? 'Provided' : 'Missing'
    }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
} 