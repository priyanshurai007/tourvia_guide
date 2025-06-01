import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export function generateBookingConfirmationEmail({
  travelerName,
  guideName,
  tourName,
  date,
  participants,
  totalPrice
}: {
  travelerName: string;
  guideName: string;
  tourName: string;
  date: string;
  participants: number;
  totalPrice: number;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f97316;">Tour Booking Confirmation</h2>
      <p>Dear ${travelerName},</p>
      <p>Thank you for booking a tour with ${guideName}!</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1f2937; margin-top: 0;">Booking Details</h3>
        <p><strong>Tour:</strong> ${tourName}</p>
        <p><strong>Guide:</strong> ${guideName}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Number of Participants:</strong> ${participants}</p>
        <p><strong>Total Price:</strong> ₹${totalPrice}</p>
      </div>

      <p>Your booking is currently pending confirmation from the guide. You will receive another email once the guide confirms your booking.</p>
      
      <p>If you have any questions or need to make changes to your booking, please contact the guide directly.</p>
      
      <p>Best regards,<br>The Find Best Guide Team</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
        <p>This is an automated email. Please do not reply directly to this message.</p>
      </div>
    </div>
  `;
}

export function generateBookingStatusUpdateEmail({
  travelerName,
  guideName,
  tourName,
  date,
  participants,
  totalPrice,
  status,
  guideContact = null
}: {
  travelerName: string;
  guideName: string;
  tourName: string;
  date: string;
  participants: number;
  totalPrice: number;
  status: string;
  guideContact?: { email: string; phone: string } | null;
}) {
  // Different messaging based on the status
  let statusMessage = '';
  let statusColor = '';
  let statusTitle = '';
  let guideContactHTML = '';
  
  // Add guide contact details HTML if provided (for confirmed bookings)
  if (guideContact && status === 'confirmed') {
    guideContactHTML = `
      <div style="background-color: #064e3b; padding: 15px; border-radius: 8px; margin: 20px 0; color: #white;">
        <h3 style="color: white; margin-top: 0;">Guide Contact Information</h3>
        <p style="color: #d1fae5;"><strong>Name:</strong> ${guideName}</p>
        <p style="color: #d1fae5;"><strong>Phone:</strong> ${guideContact.phone || 'Not provided'}</p>
        <p style="color: #d1fae5;"><strong>Email:</strong> ${guideContact.email}</p>
        <p style="color: #d1fae5; font-style: italic; margin-top: 10px;">Please save these contact details for the day of your tour.</p>
      </div>
    `;
  }
  
  switch(status) {
    case 'confirmed':
      statusTitle = 'Your Tour Booking is Confirmed!';
      statusColor = '#059669'; // green
      statusMessage = `
        <p>Great news! Your tour booking has been confirmed by the guide.</p>
        <p>Please make sure to arrive at the meeting point on time. Your guide is looking forward to providing you with an amazing experience!</p>
        ${guideContact ? `<p>The guide's contact information is provided below for your reference on the day of the tour.</p>` : ''}
      `;
      break;
    case 'cancelled':
      statusTitle = 'Your Tour Booking has been Cancelled';
      statusColor = '#DC2626'; // red
      statusMessage = `
        <p>We regret to inform you that your tour booking has been cancelled by the guide.</p>
        <p>If you have any questions regarding this cancellation, please contact the guide directly.</p>
        <p>We encourage you to explore other tour options available on our platform.</p>
      `;
      break;
    case 'completed':
      statusTitle = 'Your Tour has been Completed';
      statusColor = '#3B82F6'; // blue
      statusMessage = `
        <p>Your tour has been marked as completed by the guide. We hope you had a wonderful experience!</p>
        <p>Please consider leaving a review to share your experience with other travelers.</p>
        <p>Thank you for using our platform, and we hope to see you again soon!</p>
      `;
      break;
    case 'pending':
      statusTitle = 'Your Tour Booking Status has been Updated';
      statusColor = '#F59E0B'; // yellow
      statusMessage = `
        <p>Your tour booking has been marked as pending by the guide.</p>
        <p>This means the guide is reviewing your booking. You will receive another notification once the booking is confirmed.</p>
      `;
      break;
    default:
      statusTitle = 'Your Tour Booking Status has been Updated';
      statusColor = '#6B7280'; // gray
      statusMessage = `
        <p>The status of your tour booking has been updated.</p>
        <p>If you have any questions, please contact the guide directly.</p>
      `;
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${statusColor};">${statusTitle}</h2>
      <p>Dear ${travelerName},</p>
      ${statusMessage}
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1f2937; margin-top: 0;">Booking Details</h3>
        <p><strong>Tour:</strong> ${tourName}</p>
        <p><strong>Guide:</strong> ${guideName}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Number of Participants:</strong> ${participants}</p>
        <p><strong>Total Price:</strong> ₹${totalPrice}</p>
        <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${status.charAt(0).toUpperCase() + status.slice(1)}</span></p>
      </div>
      
      ${guideContactHTML}
      
      <p>If you have any questions or concerns, please contact the guide directly.</p>
      
      <p>Best regards,<br>The Find Best Guide Team</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
        <p>This is an automated email. Please do not reply directly to this message.</p>
      </div>
    </div>
  `;
} 