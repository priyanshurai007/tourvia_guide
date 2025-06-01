/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch, FaFilter, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaEllipsisV, FaCheck, FaTimes, FaDownload, FaPencilAlt, FaTrash, FaEllipsisH, FaPrint, FaSort, FaEye } from 'react-icons/fa';
import DateDisplay from '@/components/DateDisplay';
import { Pagination } from '../guides/page';

// Sample bookings data
interface Booking {
  _id: string;
  time: string;
  hasReviewed: boolean;
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
  guide: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
  };
  tour: {
    _id: string;
    price: number;
  };
  customer: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    phone: string;
  };
}

export default function BookingsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [destinationFilter, setDestinationFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [formattedDates, setFormattedDates] = useState<{ [key: string]: string }>({});

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasMore: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [destinations, setDestination] = useState<string[]>([]);

  // Format date with consistent locale
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  // Format dates after component mounts to ensure client-side only
  useEffect(() => {
    const dates: { [key: string]: string } = {};
    bookings.forEach(booking => {
      dates[`${booking._id}-date`] = formatDate(booking.date);
      dates[`${booking._id}-created`] = formatDate(booking.createdAt);
    });
    setFormattedDates(dates);
  }, []);

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          search: searchTerm,
          status: statusFilter
        });

        const response = await fetch(`/api/admin/bookings?${queryParams}`);

        if (!response.ok) {
          throw new Error('Failed to fetch tours');
        }

        const data = await response.json();

        if (data.success) {
          setBookings(data.bookings);
          setDestination(Array.from(new Set(data.bookings.map(booking => booking.tour.destination.split(',')[0]))))
          setPagination(data.pagination);
        } else {
          throw new Error(data.error || 'Failed to fetch guides');
        }
      } catch (err: any) {
        console.error('Error fetching guides:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [searchTerm, statusFilter, pagination.page, pagination.limit]);

  const toggleDropdown = (id: string) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-900/60 text-green-300 border border-green-700';
      case 'pending':
        return 'bg-yellow-900/60 text-yellow-300 border border-yellow-700';
      case 'cancelled':
        return 'bg-red-900/60 text-red-300 border border-red-700';
      case 'completed':
        return 'bg-blue-900/60 text-blue-300 border border-blue-700';
      default:
        return 'bg-gray-700 text-gray-300 border border-gray-600';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-900/60 text-green-300 border border-green-700';
      case 'pending':
        return 'bg-yellow-900/60 text-yellow-300 border border-yellow-700';
      case 'refunded':
        return 'bg-blue-900/60 text-blue-300 border border-blue-700';
      case 'failed':
        return 'bg-red-900/60 text-red-300 border border-red-700';
      default:
        return 'bg-gray-700 text-gray-300 border border-gray-600';
    }
  };


  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-orange-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xl text-gray-200">Loading Bookings data...</p>
        </div>
      </div>
    );
  }

  if (error && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Error Loading Bookings</h1>
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

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings Management</h1>
          <p className="text-gray-400 mt-1">View and manage all tour bookings</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition shadow flex items-center">
            <FaDownload className="mr-2" />
            Export
          </button>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition shadow-lg shadow-orange-600/20 flex items-center">
            <FaPrint className="mr-2" />
            Print Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Bookings</p>
              <p className="text-2xl font-bold text-white">156</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <FaCalendarAlt className="text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Confirmed</p>
              <p className="text-2xl font-bold text-green-400">98</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <FaCheck className="text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">42</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <FaSort className="text-yellow-400" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Cancelled</p>
              <p className="text-2xl font-bold text-red-400">16</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <FaTimes className="text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-700 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, customer, guide, destination..."
              className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Booking Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value)}
              >
                <option value="all">All Destinations</option>
                {destinations.map((destination, index) => (
                  <option key={index} value={destination}>
                    {destination}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="text-gray-400" />
              </div>
              <input
                type="date"
                className="pl-10 pr-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50 text-left">
              <tr>
                <th className="p-4 font-medium text-gray-300">Booking ID</th>
                <th className="p-4 font-medium text-gray-300">
                  <div className="flex items-center">
                    Customer
                    <FaSort className="ml-1 text-gray-500 cursor-pointer" />
                  </div>
                </th>
                <th className="p-4 font-medium text-gray-300">Guide</th>
                <th className="p-4 font-medium text-gray-300">
                  <div className="flex items-center">
                    Tour
                    <FaSort className="ml-1 text-gray-500 cursor-pointer" />
                  </div>
                </th>
                <th className="p-4 font-medium text-gray-300">
                  <div className="flex items-center">
                    Date
                    <FaSort className="ml-1 text-gray-500 cursor-pointer" />
                  </div>
                </th>
                <th className="p-4 font-medium text-gray-300">
                  <div className="flex items-center">
                    Amount
                    <FaSort className="ml-1 text-gray-500 cursor-pointer" />
                  </div>
                </th>
                <th className="p-4 font-medium text-gray-300">Status</th>
                <th className="p-4 font-medium text-gray-300">Payment</th>
                <th className="p-4 font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-400">
                    No bookings found matching your search criteria.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking._id} className="border-t border-gray-700 hover:bg-gray-700/20 transition-colors">
                    <td className="p-4 font-medium text-gray-300">{booking._id}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3 border border-gray-600">
                          <Image
                            src={booking.customer.avatar}
                            alt={booking.customer.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50px"
                            priority
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-200">{booking.customer.name}</div>
                          <div className="text-xs text-gray-400">{booking.customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3 border border-gray-600">
                          <Image
                            src={booking.guide.avatar}
                            alt={booking.guide.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50px"
                            priority
                          />
                        </div>
                        <span className="text-gray-200">{booking.guide.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="text-gray-200">{booking.tourName}</div>
                        <div className="text-xs text-gray-400">
                          <span>{booking.participants} {booking.participants > 1 ? 'persons' : 'person'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="text-gray-200">
                          <DateDisplay date={booking.date} className="text-sm" />
                        </div>
                        <div className="text-xs text-gray-400">{booking.time}</div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-200 font-medium">₹{booking.totalPrice.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-1">
                        <button className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded transition-colors" title="View Details">
                          <FaEye size={14} />
                        </button>
                        <button className="p-1.5 text-orange-400 hover:text-orange-300 hover:bg-orange-900/30 rounded transition-colors" title="Edit Booking">
                          <FaPencilAlt size={14} />
                        </button>
                        <button className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors" title="Cancel Booking">
                          <FaTrash size={14} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-gray-600 rounded transition-colors" title="More Options">
                          <FaEllipsisH size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )))}
            </tbody>
          </table>
        </div>



        {/* Pagination */}
         {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-700 flex justify-between items-center">
            <div className="text-gray-400 text-sm">
              Showing {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} guides
            </div>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded ${pagination.page === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    className={`px-3 py-1 rounded ${
                      pageNum === pagination.page
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                className={`px-3 py-1 rounded ${pagination.page === pagination.totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}