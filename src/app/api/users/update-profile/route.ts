import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export async function PUT(request: Request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    
    // Parse request body
    const data = await request.json();
    
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();

    // Prepare update object with only allowed fields
    const allowedFields = [
      'phone', 'location', 'dob', 'bio', 'preferences'
    ];
    
    const updateData: Record<string, any> = {};
    
    // Filter out only allowed fields
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }
    
    // Add a completedProfile flag if all required fields are provided
    const requiredFields = ['phone', 'location'];
    const hasAllRequiredFields = requiredFields.every(field => 
      updateData[field] !== undefined && updateData[field] !== ''
    );
    
    if (hasAllRequiredFields) {
      updateData.profileCompleted = true;
    }
    
    // Update user in database
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(decoded.id) },
      { $set: updateData }
    );
    
    await client.close();
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Profile updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user profile'
    }, { status: 500 });
  }
} 