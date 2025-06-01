import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create a safe version of the environment info (no sensitive values)
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      // Check if the JWT_SECRET exists without revealing it
      JWT_SECRET: process.env.JWT_SECRET ? 'set (value hidden)' : 'not set',
      // Check if MONGODB_URI exists without revealing sensitive parts
      MONGODB_URI: process.env.MONGODB_URI 
        ? `set (format: ${process.env.MONGODB_URI.split('@').length > 1 ? 'mongodb+srv://[username]:[password]@[host]' : 'other format'})` 
        : 'not set',
      // Get the database name without revealing connection string
      DATABASE_NAME: process.env.MONGODB_URI 
        ? process.env.MONGODB_URI.split('/').pop()?.split('?')[0] || 'unknown' 
        : 'unknown',
      // Environment detection
      IS_PRODUCTION: process.env.NODE_ENV === 'production',
    };
    
    // Get Node.js version
    const nodeVersion = process.version;
    
    // Get package.json information if available
    let packageInfo = {};
    try {
      const packageJson = require('../../../../package.json');
      packageInfo = {
        name: packageJson.name,
        version: packageJson.version,
        dependencies: Object.keys(packageJson.dependencies || {}),
      };
    } catch (err) {
      packageInfo = { error: 'Package.json not accessible' };
    }
    
    // Return the debug info
    return NextResponse.json({
      success: true,
      message: 'Debug information',
      timestamp: new Date().toISOString(),
      environment: envInfo,
      node: {
        version: nodeVersion,
      },
      package: packageInfo,
    });
  } catch (error) {
    console.error('Debug info error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      stack: process.env.NODE_ENV !== 'production' && error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 