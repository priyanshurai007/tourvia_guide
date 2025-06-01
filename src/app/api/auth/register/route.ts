import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

if (!process.env.JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

// Define schema for validation
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
});

export async function POST(request: Request) {
  try {
    // Connect to database
    console.log('Starting user registration process');
    await connectDB();
    console.log('Connected to database');
    
    // Parse request body
    const body = await request.json();
    console.log('Received registration data:', { ...body, password: '[REDACTED]' });

    // Validate input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      console.log('Validation failed:', result.error.errors);
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('User already exists with email:', email);
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }


    // Create user
    console.log('Creating new user document');
    const newUser = {
      name,
      email,
      password,
      role: 'traveler',
    };
    
    const user = await User.create(newUser);
    console.log('User created successfully with ID:', user._id);

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'fallback_secret_not_for_production',
      { expiresIn: '30d' }
    );

    // Prepare response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    console.log('Registration successful for:', email);
    
    return NextResponse.json({
      user: userResponse,
      token,
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
} 