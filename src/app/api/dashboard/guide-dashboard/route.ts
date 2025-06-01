import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

interface GuideDashboardData {
  guide: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    rating?: number;
    totalTours?: number;
    totalBookings?: number;
    totalEarnings?: number;
  };
  upcomingTours: Array<{
    _id: string;
    title: string;
    date: string;
    location: string;
    price: number;
    status: string;
    bookings: number;
  }>;
  recentBookings: Array<{
    _id: string;
    tourId: string;
    tourTitle: string;
    customerName: string;
    date: string;
    status: string;
    amount: number;
  }>;
  analytics: {
    totalTours: number;
    totalBookings: number;
    totalEarnings: number;
    averageRating: number;
    monthlyStats: Array<{
      month: string;
      bookings: number;
      earnings: number;
    }>;
  };
}

export async function GET() {
  try {
    // Get token from cookies and verify
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const guideId = decoded.id;

    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();

    // Fetch guide data
    const guide = await db.collection('users').findOne(
      { _id: new ObjectId(guideId) },
      { projection: { password: 0 } }
    );

    if (!guide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    // Fetch upcoming tours
    const upcomingTours = await db.collection('tours')
      .find({ 
        guideId: new ObjectId(guideId),
        status: 'active'
      })
      .sort({ date: 1 })
      .limit(5)
      .toArray();

    // Fetch recent bookings
    const recentBookings = await db.collection('bookings')
      .find({ 
        guideId: new ObjectId(guideId)
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // Fetch analytics data
    const totalTours = await db.collection('tours')
      .countDocuments({ guideId: new ObjectId(guideId) });

    const totalBookings = await db.collection('bookings')
      .countDocuments({ guideId: new ObjectId(guideId) });

    const bookings = await db.collection('bookings')
      .find({ guideId: new ObjectId(guideId) })
      .toArray();

    const totalEarnings = bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);

    // Calculate monthly stats
    const monthlyStats = await db.collection('bookings')
      .aggregate([
        {
          $match: {
            guideId: new ObjectId(guideId),
            createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
          }
        },
        {
          $group: {
            _id: { $month: '$createdAt' },
            bookings: { $sum: 1 },
            earnings: { $sum: '$amount' }
          }
        },
        {
          $project: {
            month: '$_id',
            bookings: 1,
            earnings: 1,
            _id: 0
          }
        },
        { $sort: { month: 1 } }
      ])
      .toArray();

    const response: GuideDashboardData = {
      guide: {
        _id: guide._id.toString(),
        name: guide.name,
        email: guide.email,
        avatar: guide.avatar,
        rating: guide.rating || 0,
        totalTours,
        totalBookings,
        totalEarnings
      },
      upcomingTours: upcomingTours.map(tour => ({
        _id: tour._id.toString(),
        title: tour.title,
        date: tour.date,
        location: tour.location,
        price: tour.price,
        status: tour.status,
        bookings: tour.bookings || 0
      })),
      recentBookings: recentBookings.map(booking => ({
        _id: booking._id.toString(),
        tourId: booking.tourId.toString(),
        tourTitle: booking.tourTitle,
        customerName: booking.customerName,
        date: booking.date,
        status: booking.status,
        amount: booking.amount
      })),
      analytics: {
        totalTours,
        totalBookings,
        totalEarnings,
        averageRating: guide.rating || 0,
        monthlyStats: monthlyStats.map(stat => ({
          month: new Date(2000, stat.month - 1).toLocaleString('default', { month: 'short' }),
          bookings: stat.bookings,
          earnings: stat.earnings
        }))
      }
    };

    await client.close();
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching guide dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guide dashboard data' },
      { status: 500 }
    );
  }
} 