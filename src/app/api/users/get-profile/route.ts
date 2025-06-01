import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function GET() {
  const MONGODB_URI = process.env.MONGODB_URI;
  const JWT_SECRET = process.env.JWT_SECRET;
  
  if (!MONGODB_URI || !JWT_SECRET) {
    return NextResponse.json({
      success: false,
      message: 'Server configuration error'
    }, { status: 500 });
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Authentication required'
      }, { status: 401 });
    }

    let decodedToken: DecodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: 'Invalid token'
      }, { status: 401 });
    }

    const client = new MongoClient(MONGODB_URI);
    
    try {
      await client.connect();
      const db = client.db();
      const usersCollection = db.collection('users');
      
      // Convert string ID to ObjectId
      let userId;
      try {
        userId = new ObjectId(decodedToken.id);
      } catch (error) {
        return NextResponse.json({
          success: false,
          message: 'Invalid user ID'
        }, { status: 400 });
      }
      
      // Fetch the user profile
      const user = await usersCollection.findOne(
        { _id: userId },
        { projection: { password: 0 } } // Exclude password from the response
      );
      
      if (!user) {
        return NextResponse.json({
          success: false,
          message: 'User not found'
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        user
      });
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch profile',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      }, { status: 500 });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch profile',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
} 