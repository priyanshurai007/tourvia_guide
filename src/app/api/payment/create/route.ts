import { NextResponse } from 'next/server';
import { razorpay } from '@/utils/razorpay';
import TransactionModel from '@/models/transaction';
import { connectToDB } from '@/utils/database';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    await connectToDB();
    
    // Verify authentication
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const body = await request.json();
    const { bookingId, amount } = body;

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `rcpt_${bookingId}`,
    };

    const order = await razorpay.orders.create(options);

    const transaction = await TransactionModel.create({
      bookingId,
      userId: decoded.id,
      orderId: order.id,
      amount: amount,
      currency: "INR",
    });

    return NextResponse.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
      transaction
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Error creating payment' },
      { status: 500 }
    );
  }
}
