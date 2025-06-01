import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    console.log('Starting database test...');
    await connectDB();
    console.log('Connected to MongoDB!');
    
    // Log connection status
    const connectionState = mongoose.connection.readyState;
    const stateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    
    console.log(`MongoDB connection state: ${stateMap[connectionState] || 'unknown'}`);
    
    // Check if the User model exists
    const modelNames = mongoose.modelNames();
    console.log('Available models:', modelNames);
    
    // Try to create a test user
    const testEmail = `test-${Date.now()}@example.com`;
    const hashedPassword = await bcrypt.hash('TestPassword123!', 10);
    
    const testUser = {
      name: 'Test User',
      email: testEmail,
      password: hashedPassword,
      role: 'traveler',
    };
    
    console.log('Attempting to create test user:', { ...testUser, password: '[REDACTED]' });
    
    // Create user directly
    const newUser = await User.create(testUser);
    console.log('Test user created successfully:', newUser._id);
    
    // Get count of all users
    const userCount = await User.countDocuments();
    console.log('Total users in database:', userCount);
    
    return NextResponse.json({
      success: true,
      message: 'Database test completed successfully',
      connectionState: stateMap[connectionState] || 'unknown',
      models: modelNames,
      testUserId: newUser._id,
      userCount,
    });
  } catch (error) {
    console.error('Database test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
} 