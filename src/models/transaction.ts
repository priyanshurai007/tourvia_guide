import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITransaction extends Document {
  bookingId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderId: string; // Razorpay order id
  paymentId?: string; // Razorpay payment id
  signature?: string; // Razorpay signature
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: String,
    required: true
  },
  paymentId: {
    type: String
  },
  signature: {
    type: String
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed'],
    default: 'created'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient queries
transactionSchema.index({ bookingId: 1, createdAt: -1 });
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ orderId: 1 });

/**
 * Ensures the Transaction model is registered once.
 */
function getTransactionModel(): Model<ITransaction> {
  if (mongoose.models && mongoose.models.Transaction) {
    return mongoose.models.Transaction as Model<ITransaction>;
  }
  try {
    return mongoose.model<ITransaction>('Transaction', transactionSchema);
  } catch (error) {
    if ((error as any).message?.includes('Cannot overwrite')) {
      return mongoose.model<ITransaction>('Transaction');
    }
    throw error;
  }
}

const TransactionModel = getTransactionModel();
export default TransactionModel;
