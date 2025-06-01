import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import User from '@/models/User';
import { sendEmail, generateBookingStatusUpdateEmail } from '@/lib/email';
import { format } from 'date-fns';

export async function PATCH(request: Request, { params }: { params: { bookingId: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as any;
      
      // Support both token formats (id or userId)
      const userId = decoded.id || decoded.userId;
      
      if (!userId) {
        return NextResponse.json({ success: false, message: 'Invalid token format' }, { status: 401 });
      }
      
      // Check if user is a guide
      if (decoded.role !== 'guide') {
        return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 403 });
      }

      // Get the booking ID and new status from the request
      const bookingId = params.bookingId;
      const { status } = await request.json();

      // Validate the new status
      if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
        return NextResponse.json({ success: false, message: 'Invalid status value' }, { status: 400 });
      }

      // Connect to the database
      await connectDB();

      // Find the booking and ensure it belongs to this guide
      const booking = await Booking.findOne({
        _id: bookingId,
        guideId: userId
      }).exec();

      if (!booking) {
        return NextResponse.json({ success: false, message: 'Booking not found or not authorized' }, { status: 404 });
      }

      // Capture previous status for comparison
      const previousStatus = booking.status;
      
      // Update the booking status
      booking.status = status;
      await booking.save();

      // Send email notification if status changed
      if (previousStatus !== status) {
        try {
          // Format date for email
          const formattedDate = format(new Date(booking.date), 'MMMM d, yyyy');
          const formattedTime = booking.time || '09:00 AM';
          
          // If status is confirmed, fetch guide contact details
          let guideContact = null;
          if (status === 'confirmed') {
            const guide = await User.findById(userId).select('email phone').exec();
            if (guide) {
              guideContact = {
                email: guide.email,
                phone: guide.phone || 'Not provided'
              };
              console.log('Including guide contact details in confirmation email:', guideContact);
            }
          }
          
          // Generate email content
          const emailHtml = generateBookingStatusUpdateEmail({
            travelerName: booking.travelerName,
            guideName: booking.guideName,
            tourName: booking.tourName,
            date: `${formattedDate} at ${formattedTime}`,
            participants: booking.participants,
            totalPrice: booking.totalPrice,
            status: status,
            guideContact: guideContact
          });
          
          // Send email to traveler
          await sendEmail({
            to: booking.travelerEmail,
            subject: `Your Tour Booking Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            html: emailHtml
          });
          
          console.log(`Booking status update email sent to ${booking.travelerEmail}`);
        } catch (emailError) {
          // Log email error but don't fail the request
          console.error('Error sending booking status email:', emailError);
        }
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Booking status updated successfully',
        booking: {
          id: booking._id.toString(),
          status: booking.status
        }
      });

    } catch (verifyError) {
      console.error('Token verification error:', verifyError);
      return NextResponse.json({ success: false, message: 'Invalid authentication token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json({ success: false, message: 'Error updating booking status' }, { status: 500 });
  }
} 