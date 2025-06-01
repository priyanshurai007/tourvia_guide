'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaUsers, FaMapMarkedAlt, FaCalendarAlt, FaStar, 
  FaArrowUp, FaArrowDown, FaEllipsisH, FaExclamationCircle,
  FaUserPlus, FaFileAlt, FaChartLine, FaRupeeSign, FaEye, FaFileExport, FaPrint
} from 'react-icons/fa';
import DateDisplay from '@/components/DateDisplay';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Dashboard Stats Interface
interface DashboardStats {
  totalGuides: number;
  totalDestinations: number;
  monthlyBookings: number;
  averageRating: number;
  guidesChange: number;
  destinationsChange: number;
  bookingsChange: number;
  ratingChange: number;
}

// Booking Interface
interface Booking {
  _id: string;
  travelerId: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    phone: string;
  };
  travelerName: string;
  travelerEmail: string;
  guideId: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    phone?: string;
  };
  guideName: string;
  tourId: {
    _id: string;
    price: number;
  };
  tourName: string;
  date: string;
  participants: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  hasReviewed: boolean;
  time: string;
}

// Destination Interface
interface Destination {
  _id: string;
  name: string;
  bookingsCount: number;
  image: string;
}

// Alert Interface
interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  message: string;
  time: string;
}

// Monthly Revenue Interface
interface MonthlyRevenue {
  month: string;
  amount: number;
}

export default function AdminDashboard() {
  // State hooks for data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalGuides: 0,
    totalDestinations: 0,
    monthlyBookings: 0,
    averageRating: 0,
    guidesChange: 0,
    destinationsChange: 0,
    bookingsChange: 0,
    ratingChange: 0
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [popularDestinations, setPopularDestinations] = useState<Destination[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [highestMonth, setHighestMonth] = useState<{month: string, amount: number}>({month: '', amount: 0});
  const [averageRevenue, setAverageRevenue] = useState<number>(0);

  // Alerts are typically not stored in the database, so keeping them hardcoded
  const recentAlerts: Alert[] = [
    { id: '1', type: 'warning', message: 'Low availability for Delhi tours next week', time: '2 hours ago' },
    { id: '2', type: 'danger', message: 'Guide Raj Mehta has requested profile changes', time: '5 hours ago' },
    { id: '3', type: 'info', message: '3 new customer support tickets waiting for response', time: '1 day ago' },
  ];

  // Add state for alert messages
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', type: 'info', message: 'Welcome to the admin dashboard! Here you can monitor all activities.' },
  ]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/dashboard');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch dashboard data');
        }

        if (data.success) {
          // Set dashboard stats
          setStats({
            totalGuides: data.stats.totalGuides || 0,
            totalDestinations: data.stats.totalDestinations || 0,
            monthlyBookings: data.stats.monthlyBookings || 0,
            averageRating: parseFloat(data.stats.averageRating?.toFixed(1)) || 0,
            guidesChange: data.stats.guidesChange || 0,
            destinationsChange: data.stats.destinationsChange || 0,
            bookingsChange: data.stats.bookingsChange || 0,
            ratingChange: data.stats.ratingChange || 0
          });

          // Set recent bookings
          setRecentBookings(data.recentBookings || []);

          // Set popular destinations
          setPopularDestinations(data.popularDestinations || []);

          // Set monthly revenue data and calculate stats
          if (data.monthlyRevenue && data.monthlyRevenue.length > 0) {
            setMonthlyRevenue(data.monthlyRevenue);
            
            // Calculate total revenue
            const total = data.monthlyRevenue.reduce((acc: number, curr: MonthlyRevenue) => acc + curr.amount, 0);
            setTotalRevenue(total);
            
            // Find highest month
            const highest = data.monthlyRevenue.reduce(
              (max: MonthlyRevenue, curr: MonthlyRevenue) => curr.amount > max.amount ? curr : max, 
              data.monthlyRevenue[0]
            );
            setHighestMonth(highest);
            
            // Calculate average
            setAverageRevenue(total / data.monthlyRevenue.length);
          }
        }
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Function to close an alert
  const closeAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Chart data configuration
  const chartData = {
    labels: monthlyRevenue.map(month => month.month),
    datasets: [
      {
        label: 'Monthly Revenue',
        data: monthlyRevenue.map(month => month.amount),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e2e8f0',
        },
      },
      title: {
        display: true,
        text: 'Monthly Revenue (Current Year)',
        color: '#e2e8f0',
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#e2e8f0',
          callback: (value: number) => formatCurrency(value),
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#e2e8f0',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    elements: {
      point: {
        radius: 5,
        hoverRadius: 7,
      },
    },
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-orange-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xl text-gray-200">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Error Loading Dashboard</h1>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Stats config for rendering
  const statsConfig = [
    { 
      title: 'Total Guides', 
      value: stats.totalGuides, 
      change: stats.guidesChange, 
      icon: FaUsers, 
      color: 'bg-blue-600', 
      lightColor: 'bg-blue-500/20', 
      textColor: 'text-blue-400' 
    },
    { 
      title: 'Total Destinations', 
      value: stats.totalDestinations, 
      change: stats.destinationsChange, 
      icon: FaMapMarkedAlt, 
      color: 'bg-green-600', 
      lightColor: 'bg-green-500/20', 
      textColor: 'text-green-400' 
    },
    { 
      title: 'Bookings This Month', 
      value: stats.monthlyBookings, 
      change: stats.bookingsChange, 
      icon: FaCalendarAlt, 
      color: 'bg-purple-600', 
      lightColor: 'bg-purple-500/20', 
      textColor: 'text-purple-400' 
    },
    { 
      title: 'Average Rating', 
      value: stats.averageRating, 
      change: stats.ratingChange, 
      icon: FaStar, 
      color: 'bg-amber-600', 
      lightColor: 'bg-amber-500/20', 
      textColor: 'text-amber-400' 
    },
  ];

  // Find max value for chart scaling
  const maxRevenueValue = monthlyRevenue.length > 0 
    ? Math.max(...monthlyRevenue.map(item => item.amount)) 
    : 1;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex mt-4 sm:mt-0 space-x-3">
          <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition">
            <FaFileExport className="mr-2" />
            <span>Export</span>
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition">
            <FaPrint className="mr-2" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Alerts section */}
      {alerts.length > 0 && (
        <div className="mb-8">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 mb-4 rounded-md flex justify-between items-center ${
                alert.type === 'info'
                  ? 'bg-blue-900/40 text-blue-200 border border-blue-800'
                  : alert.type === 'warning'
                  ? 'bg-yellow-900/40 text-yellow-200 border border-yellow-800'
                  : alert.type === 'success'
                  ? 'bg-green-900/40 text-green-200 border border-green-800'
                  : 'bg-red-900/40 text-red-200 border border-red-800'
              }`}
            >
              <p>{alert.message}</p>
              <button
                onClick={() => closeAlert(alert.id)}
                className="text-white opacity-70 hover:opacity-100"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsConfig.map((stat, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
              </div>
              <span className={`p-3 ${stat.color} rounded-lg`}>
                <stat.icon size={24} className={stat.textColor} />
              </span>
            </div>
            <div className={`mt-4 text-sm ${(stat.change > 0 ? 'text-green-400' : 'text-red-400')}`}>
              {stat.change > 0 ? '↑' : '↓'} {Math.abs(stat.change)}% since last month
            </div>
          </div>
        ))}
      </div>

      {/* Revenue and Bookings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-6">Revenue Overview</h2>
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
          
          {/* Revenue stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-xl font-semibold mt-1">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Highest Month</p>
              <p className="text-xl font-semibold mt-1">{highestMonth.month} ({formatCurrency(highestMonth.amount)})</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Avg Monthly</p>
              <p className="text-xl font-semibold mt-1">{formatCurrency(averageRevenue)}</p>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Bookings</h2>
            <a href="/admin/bookings" className="text-teal-400 hover:text-teal-300 text-sm flex items-center">
              <span>View all</span>
              <FaEye className="ml-1" />
            </a>
          </div>
          
          <div className="space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking._id} className="bg-gray-700/40 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600 mr-3">
                      <img 
                        src={booking.travelerId.avatar} 
                        alt={booking.travelerId.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{booking.travelerName}</h4>
                      <p className="text-sm text-gray-400">with {booking.guideName}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-gray-400">Destination</p>
                      <p>{booking.tourName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Date</p>
                      <p>{formatDate(booking.date)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Amount</p>
                      <p className="font-medium text-teal-400">{formatCurrency(booking.totalPrice)}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      booking.status === 'confirmed' ? 'bg-green-900/50 text-green-400' :
                      booking.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400' :
                      booking.status === 'completed' ? 'bg-blue-900/50 text-blue-400' :
                      'bg-red-900/50 text-red-400'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No recent bookings found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popular destinations */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-6">Popular Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {popularDestinations.length > 0 ? (
            popularDestinations.map((destination) => (
              <div key={destination._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <div className="h-40 overflow-hidden">
                  <img 
                    src={destination.image || "/placeholder-destination.jpg"} 
                    alt={destination.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-200"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{destination.name}</h3>
                  <p className="text-sm text-gray-400">{destination.bookingsCount} bookings</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-5 text-center py-12 bg-gray-800 rounded-lg">
              <p className="text-gray-400">No popular destinations found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
