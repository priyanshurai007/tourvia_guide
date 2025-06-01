import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";

import Guide from '@/models/User';
import Destination from '@/models/Tour';
import Booking from '@/models/Booking';
import Review from '@/models/review';

export async function GET() {
  try {
    await connectDB();

    // Get current date for calculations
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Get current stats
    const [
      totalGuides,
      totalDestinations,
      monthlyBookings,
      lastMonthBookings,
      reviews,
      recentBookings,
      popularDestinations,
      monthlyRevenue
    ] = await Promise.all([
      Guide.countDocuments(),
      Destination.countDocuments(),
      Booking.countDocuments({ createdAt: { $gte: firstDayOfMonth } }),
      Booking.countDocuments({
        createdAt: {
          $gte: lastMonth,
          $lt: firstDayOfMonth
        }
      }),
      Review.find().select('rating'),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('guideId', 'name email phone avatar')
            .populate('tourId', 'title price')
            .populate('travelerId', 'name email phone avatar'),
      Destination.aggregate([
        {
          $lookup: {
            from: 'bookings',
            localField: '_id',
            foreignField: 'tourId',
            as: 'bookings'
          }
        },
        {
          $project: {
            name: 1,
            image: 1,
            bookingsCount: { $size: '$bookings' }
          }
        },
        { $sort: { bookingsCount: -1 } },
        { $limit: 5 }
      ]),
      Booking.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(now.getFullYear(), 0, 1)
            },
            $or: [
              { status: 'confirmed' },
              { status: 'completed' }
            ]
          }
        },
        {
          $group: {
            _id: { $month: '$createdAt' },
            amount: { $sum: '$totalPrice' }
          }
        },
        {
          $project: {
            month: {
              $let: {
                vars: {
                  monthsInString: [
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                  ]
                },
                in: {
                  $arrayElemAt: ['$$monthsInString', { $subtract: ['$_id', 1] }]
                }
              }
            },
            amount: 1
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    // Calculate average rating
    const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

    // Calculate percentage changes
    const bookingsChange = lastMonthBookings === 0 ? 100 : 
      ((monthlyBookings - lastMonthBookings) / lastMonthBookings) * 100;

    return NextResponse.json({
      success: true,
      stats: {
        totalGuides,
        totalDestinations,
        monthlyBookings,
        averageRating: averageRating || 0,
        guidesChange: 5, // Placeholder - implement historical comparison
        destinationsChange: 2, // Placeholder - implement historical comparison
        bookingsChange: Math.round(bookingsChange * 10) / 10,
        ratingChange: 0 // Placeholder - implement historical comparison
      },
      recentBookings,
      popularDestinations,
      monthlyRevenue
    });

  } catch (error: any) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}