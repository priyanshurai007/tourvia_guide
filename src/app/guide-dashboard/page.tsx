'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaStar, FaUsers, FaMoneyBillWave, FaCalendarAlt, 
  FaMapMarkerAlt, FaClock, FaEye, FaChevronRight,
  FaMapMarkedAlt, FaChartLine, FaBell
} from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

export default function GuideDashboard() {
  const [data, setData] = useState<GuideDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard/guide-dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const chartData = {
    labels: data.analytics.monthlyStats.map(stat => stat.month),
    datasets: [
      {
        label: 'Bookings',
        data: data.analytics.monthlyStats.map(stat => stat.bookings),
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
      },
      {
        label: 'Earnings',
        data: data.analytics.monthlyStats.map(stat => stat.earnings),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#fff',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Monthly Performance',
        color: '#fff',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#9CA3AF'
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)'
        }
      },
      x: {
        ticks: {
          color: '#9CA3AF'
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)'
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome Back, {data.guide.name}!</h1>
          <p className="text-gray-400 mt-1">Here's what's happening with your tours today</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <button className="relative text-gray-300 hover:text-white transition-colors">
            <FaBell size={20} />
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>
          <Link 
            href="/guide-dashboard/profile" 
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-orange-500">
              <Image 
                src={data.guide.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"} 
                alt={data.guide.name} 
                fill 
                sizes="32px"
                className="object-cover"
              />
            </div>
            <span className="text-sm font-medium">{data.guide.name}</span>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Total Tours</p>
              <p className="text-2xl font-bold text-white">{data.analytics?.totalTours || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
              <FaMapMarkedAlt className="text-orange-500 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Total Bookings</p>
              <p className="text-2xl font-bold text-white">{data.analytics?.totalBookings || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
              <FaUsers className="text-orange-500 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Total Earnings</p>
              <p className="text-2xl font-bold text-white">₹{(data.analytics?.totalEarnings || 0).toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
              <FaMoneyBillWave className="text-orange-500 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Average Rating</p>
              <p className="text-2xl font-bold text-white">{data.analytics?.averageRating?.toFixed(1) || '0.0'}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
              <FaStar className="text-orange-500 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="h-80">
          <Line 
            data={{
              labels: data.analytics?.monthlyStats?.map(stat => stat.month) || [],
              datasets: [
                {
                  label: 'Bookings',
                  data: data.analytics?.monthlyStats?.map(stat => stat.bookings) || [],
                  borderColor: 'rgb(249, 115, 22)',
                  backgroundColor: 'rgba(249, 115, 22, 0.5)',
                },
                {
                  label: 'Earnings',
                  data: data.analytics?.monthlyStats?.map(stat => stat.earnings) || [],
                  borderColor: 'rgb(16, 185, 129)',
                  backgroundColor: 'rgba(16, 185, 129, 0.5)',
                },
              ],
            }}
            options={chartOptions}
          />
        </div>
      </div>

      {/* Upcoming Tours */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Upcoming Tours</h3>
          <Link 
            href="/guide-dashboard/tours" 
            className="text-sm text-orange-500 hover:text-orange-400 flex items-center"
          >
            View All <FaChevronRight className="ml-1" size={12} />
          </Link>
        </div>
        <div className="space-y-4">
          {data.upcomingTours?.map((tour) => (
            <div key={tour._id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
              <div>
                <p className="font-medium text-white">{tour.title || 'Untitled Tour'}</p>
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <FaMapMarkerAlt className="mr-1" size={12} />
                  <span>{tour.location || 'Location not specified'}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">₹{(tour.price || 0).toLocaleString()}</p>
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <FaCalendarAlt className="mr-1" size={12} />
                  <span>{tour.date ? new Date(tour.date).toLocaleDateString() : 'Date not set'}</span>
                </div>
              </div>
            </div>
          )) || (
            <div className="text-center text-gray-400 py-4">
              No upcoming tours scheduled
            </div>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Bookings</h3>
          <Link 
            href="/guide-dashboard/bookings" 
            className="text-sm text-orange-500 hover:text-orange-400 flex items-center"
          >
            View All <FaChevronRight className="ml-1" size={12} />
          </Link>
        </div>
        <div className="space-y-4">
          {data.recentBookings?.map((booking) => (
            <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
              <div>
                <p className="font-medium text-white">{booking.tourTitle || 'Untitled Tour'}</p>
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <FaUsers className="mr-1" size={12} />
                  <span>{booking.customerName || 'Anonymous Customer'}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">₹{(booking.amount || 0).toLocaleString()}</p>
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <FaCalendarAlt className="mr-1" size={12} />
                  <span>{booking.date ? new Date(booking.date).toLocaleDateString() : 'Date not set'}</span>
                </div>
              </div>
            </div>
          )) || (
            <div className="text-center text-gray-400 py-4">
              No recent bookings
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 