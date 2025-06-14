import { NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/utils/razorpay';
import TransactionModel from '@/models/transaction';
import BookingModel from '@/models/Booking';
import { connectToDB } from '@/utils/database';

export async function POST(request: Request) {
  try {
    await connectToDB();
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Update transaction
    const transaction = await TransactionModel.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: 'paid',
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Update booking status
    await BookingModel.findByIdAndUpdate(
      transaction.bookingId,
      { status: 'confirmed' }
    );

    return NextResponse.json({
      success: true,
      transaction
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { message: 'Error verifying payment' },
      { status: 500 }
    );
  }
}
