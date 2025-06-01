import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

export async function GET() {
  let mongoClient = null;
  
  try {
    console.log('========= DATABASE DEBUG ROUTE =========');
    console.log('Checking environment variables...');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    console.log('MONGODB_URI is defined:', process.env.MONGODB_URI.substring(0, 20) + '...');
    
    // Test direct MongoDB connection first
    console.log('Testing direct MongoDB connection...');
    
    try {
      mongoClient = new MongoClient(process.env.MONGODB_URI);
      await mongoClient.connect();
      console.log('Direct MongoDB connection successful!');
      
      const uri = process.env.MONGODB_URI;
      const dbName = uri.split('/').pop()?.split('?')[0] || 'test';
      const db = mongoClient.db(dbName);
      
      // Test a simple operation
      const collections = await db.listCollections().toArray();
      console.log('Collections in database:', collections.map(c => c.name));
      
    } catch (directError) {
      console.error('Direct MongoDB connection failed:', directError);
      return NextResponse.json({
        success: false,
        error: 'Direct MongoDB connection failed',
        details: directError instanceof Error ? directError.message : 'Unknown error',
        stack: directError instanceof Error ? directError.stack : undefined,
      }, { status: 500 });
    } finally {
      if (mongoClient) {
        await mongoClient.close();
        console.log('Direct MongoDB connection closed');
      }
    }
    
    // Now test Mongoose connection
    console.log('Testing Mongoose connection...');
    
    // Check if Mongoose is already connected
    console.log('Current Mongoose connection state:', mongoose.connection.readyState);
    const stateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    
    // Disconnect if already connected
    if (mongoose.connection.readyState !== 0) {
      console.log('Disconnecting existing Mongoose connection...');
      await mongoose.connection.close();
    }
    
    // Connect with Mongoose
    console.log('Connecting to MongoDB with Mongoose...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Mongoose connection successful!');
    
    // Check models
    const modelNames = mongoose.modelNames();
    console.log('Available Mongoose models:', modelNames);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection test successful',
      mongooseState: stateMap[mongoose.connection.readyState] || 'unknown',
      models: modelNames,
    });
    
  } catch (error) {
    console.error('Database debug error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Database connection test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
} 