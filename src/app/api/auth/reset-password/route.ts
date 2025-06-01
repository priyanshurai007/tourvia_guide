import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import { z } from 'zod';

// Define schema for validation
const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  adminKey: z.string().optional()
});

export async function POST(request: Request) {
  let client = null;

  try {
    console.log('Starting password reset process...');

    // Parse and validate request body
    const body = await request.json();

    const result = resetSchema.safeParse(body);
    if (!result.success) {
      console.log('Validation failed:', result.error.errors);
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, newPassword, adminKey } = result.data;

    // Security check - require adminKey to match environment variable
    const ADMIN_RESET_KEY = process.env.ADMIN_RESET_KEY || 'admin-reset-123';
    if (adminKey !== ADMIN_RESET_KEY) {
      console.log('Invalid admin key provided');
      return NextResponse.json(
        { error: 'Not authorized to perform password reset' },
        { status: 403 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Connect directly to MongoDB
    client = new MongoClient(process.env.MONGODB_URI || '');
    await client.connect();
    console.log('Connected to MongoDB');

    // Determine database name from connection string
    const uri = process.env.MONGODB_URI || '';
    const dbName = uri.split('/').pop()?.split('?')[0] || 'find_best_guide';
    console.log('Using database:', dbName);

    const db = client.db(dbName);

    // Find user by email with case insensitive search
    console.log('Looking for user with email:', normalizedEmail);
    const user = await db.collection('users').findOne({
      $or: [
        { email: normalizedEmail },
        { email: email },
        { email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } }
      ]
    });

    if (!user) {
      console.log('User not found with email:', normalizedEmail);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('User found, resetting password for:', normalizedEmail);

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    const updateResult = await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );

    if (updateResult.modifiedCount !== 1) {
      console.error('Failed to update password');
      return NextResponse.json(
        { error: 'Password update failed' },
        { status: 500 }
      );
    }

    console.log('Password successfully reset for:', normalizedEmail);

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Password reset error:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred during password reset',
      stack: process.env.NODE_ENV !== 'production' && error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
} 