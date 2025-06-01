import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import registerModels from '@/lib/models';
import preloadModels from '@/lib/preloadModels';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Force models to be registered and preloaded
    await connectDB();
    const preloadResult = await preloadModels();
    const registeredModels = registerModels();
    
    // Return success
    return NextResponse.json({ 
      success: true, 
      message: 'API is operational',
      models: Object.keys(registeredModels),
      preloadSuccess: preloadResult.success,
      allRegisteredModels: Object.keys(mongoose.models || {})
    });
  } catch (error) {
    console.error('Error in ping endpoint:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'API encountered an error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 