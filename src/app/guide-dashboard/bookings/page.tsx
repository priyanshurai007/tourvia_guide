'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt, 
  FaUserFriends,
  FaMapMarkerAlt,
  FaClock,
  FaEdit,
  FaEye,
  FaTrashAlt,
  FaDownload,
  FaPrint,
  FaStar,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSpinner,
  FaInfoCircle,
  FaTimesCircle,
  FaFlag,
  FaEnvelope
} from 'react-icons/fa';
import DateDisplay from '@/components/DateDisplay';
import { format } from 'date-fns';

// Define booking interface to match API response
interface Booking {
  id: string;
  travelerName: string;
  travelerEmail: string;
  tourName: string;
  date: string;
  participants: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-600 text-green-100';
      case 'pending':
        return 'bg-yellow-600 text-yellow-100';
      case 'cancelled':
        return 'bg-red-600 text-red-100';
      case 'completed':
        return 'bg-blue-600 text-blue-100';
      default:
        return 'bg-gray-600 text-gray-100';
    }
  };

  const getStatusIcon = () => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <FaCheckCircle className="mr-1" />;
      case 'pending':
        return <FaClock className="mr-1" />;
      case 'cancelled':
        return <FaTimesCircle className="mr-1" />;
      case 'completed':
        return <FaFlag className="mr-1" />;
      default:
        return null;
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {getStatusIcon()}
      {status}
    </span>
  );
};

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' } | null>(null);
  
  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    
    // Hide toast after 5 seconds
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };
  
  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching bookings data...');
      const response = await fetch('/api/guides/bookings', {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Bookings API error:', response.status, errorText);
        
        // Handle authentication errors
        if (response.status === 401 || response.status === 403) {
          console.log('Authentication issue detected, redirecting to login...');
          window.location.href = '/login?redirect=/guide-dashboard/bookings';
          return;
        }
        
        throw new Error(`Failed to fetch bookings: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (!data.success) {
        if (data.error === 'Invalid or expired token') {
          console.log('Token issue detected, redirecting to login...');
          window.location.href = '/login?redirect=/guide-dashboard/bookings';
          return;
        }
        throw new Error(data.error || 'Failed to fetch bookings');
      }
      
      // Ensure we have an array of bookings
      if (Array.isArray(data.bookings)) {
        setBookings(data.bookings);
        console.log(`Loaded ${data.bookings.length} bookings successfully`);
      } else {
        console.error('Invalid bookings data format:', data);
        throw new Error('Invalid data format received from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to update booking status
  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      setActionLoading(bookingId);
      console.log(`Updating booking ${bookingId} to ${newStatus}...`);
      
      const response = await fetch(`/api/guides/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Status update error:', response.status, errorText);
        
        if (response.status === 401 || response.status === 403) {
          console.log('Authentication issue detected while updating status, redirecting to login...');
          window.location.href = '/login?redirect=/guide-dashboard/bookings';
          return;
        }
        
        throw new Error(`Failed to update booking status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Update the booking in local state
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: newStatus } 
              : booking
          )
        );
        
        // Show success toast with notification message
        const booking = bookings.find(b => b.id === bookingId);
        const travelerName = booking?.travelerName || 'the traveler';
        
        // Status-specific messages
        let statusMessage;
        switch(newStatus) {
          case 'confirmed':
            statusMessage = `Booking confirmed! ${travelerName} has been notified via email.`;
            break;
          case 'cancelled':
            statusMessage = `Booking cancelled. ${travelerName} has been notified via email.`;
            break; 
          case 'completed':
            statusMessage = `Booking marked as completed. ${travelerName} has been notified via email.`;
            break;
          case 'pending':
            statusMessage = `Booking status updated to pending. ${travelerName} has been notified via email.`;
            break;
          default:
            statusMessage = `Booking status updated. ${travelerName} has been notified via email.`;
        }
        
        showToast(statusMessage);
        console.log(`Successfully updated booking ${bookingId} status to ${newStatus}`);
      } else {
        if (data.error === 'Invalid or expired token') {
          console.log('Token issue detected during status update, redirecting to login...');
          window.location.href = '/login?redirect=/guide-dashboard/bookings';
          return;
        }
        throw new Error(data.error || 'Failed to update booking status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating the booking');
      showToast(err instanceof Error ? err.message : 'An error occurred while updating the booking', 'error');
      console.error('Error updating booking status:', err);
    } finally {
      setActionLoading(null);
    }
  };
  
  useEffect(() => {
    fetchBookings();
  }, []);
  
  // Filter bookings based on search and filters
  const filteredBookings = bookings.filter(booking => {
    // Handle case where any of these properties might be undefined
    const matchesSearch = 
      (booking.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
      (booking.tourName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
      (booking.travelerName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (booking.status?.toLowerCase() || '') === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  // Get count of different status types
  const confirmedCount = bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length;
  const pendingCount = bookings.filter(b => b.status?.toLowerCase() === 'pending').length;
  const cancelledCount = bookings.filter(b => b.status?.toLowerCase() === 'cancelled').length;
  const completedCount = bookings.filter(b => b.status?.toLowerCase() === 'completed').length;
  
  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PP');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  return (
    <div>
      {/* Toast Notification */}
      {toast && toast.show && (
        <div 
          className={`fixed top-4 right-4 z-50 flex items-center p-4 mb-4 rounded-md shadow-lg max-w-md ${
            toast.type === 'success' ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'
          }`}
        >
          <div className={`mr-3 ${toast.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {toast.type === 'success' ? (
              <FaCheckCircle className="text-xl" />
            ) : (
              <FaExclamationTriangle className="text-xl" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">
              {toast.message}
            </p>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="ml-3 text-gray-300 hover:text-white"
          >
            <FaTimesCircle />
          </button>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings Management</h1>
          <p className="text-gray-400 mt-1">View and manage your tour bookings</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition shadow-lg border border-gray-600 flex items-center text-sm">
            <FaDownload className="mr-2" />
            Export
          </button>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition shadow-lg shadow-orange-600/20 flex items-center text-sm">
            <FaPrint className="mr-2" />
            Print
          </button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs mb-1">Total Bookings</p>
              <p className="text-2xl font-bold text-white">{bookings.length}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <FaCalendarAlt className="text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs mb-1">Confirmed</p>
              <p className="text-2xl font-bold text-green-400">{confirmedCount}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <FaCheckCircle className="text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <FaInfoCircle className="text-yellow-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs mb-1">Completed</p>
              <p className="text-2xl font-bold text-blue-400">{completedCount}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <FaCheckCircle className="text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs mb-1">Cancelled</p>
              <p className="text-2xl font-bold text-red-400">{cancelledCount}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <FaExclamationTriangle className="text-red-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, tour or booking ID..."
              className="w-full pl-10 pr-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="w-full md:w-40 pl-10 pr-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Loading and Error States */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
          <FaSpinner className="animate-spin text-4xl text-orange-500 mb-4" />
          <p className="text-gray-300">Loading your bookings...</p>
        </div>
      )}
      
      {error && (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-lg border border-red-800 shadow-lg">
          <FaExclamationTriangle className="text-4xl text-red-500 mb-4" />
          <p className="text-red-400 font-medium">Error loading bookings</p>
          <p className="text-gray-400 mt-2">{error}</p>
          <button 
            onClick={fetchBookings} 
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 flex items-center"
          >
            <FaSpinner className={`mr-2 ${loading ? 'animate-spin' : 'hidden'}`} />
            Try Again
          </button>
        </div>
      )}
      
      {/* Bookings Table */}
      {!loading && !error && (
        <>
          {filteredBookings.length > 0 ? (
            <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700 bg-gray-900">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Booking Details</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Traveler</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-700/50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-start">
                            <div>
                              <p className="text-sm font-medium text-white">{booking.tourName || 'Unnamed Tour'}</p>
                              <p className="text-xs text-gray-400">ID: {booking.id}</p>
                              <div className="flex items-center mt-1">
                                <FaUserFriends className="text-gray-500 mr-1 text-xs" />
                                <span className="text-xs text-gray-400">{booking.participants} people</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <p className="text-sm font-medium text-white">{booking.travelerName}</p>
                          <p className="text-xs text-gray-400">{booking.travelerEmail}</p>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <p className="text-sm text-white">{formatDate(booking.date)}</p>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <StatusBadge status={booking.status || 'pending'} />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <p className="text-sm font-medium text-white">₹{booking.totalPrice}</p>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-2">
                            <button 
                              className="p-1 text-blue-400 hover:text-blue-300 transition-colors relative group" 
                              title="View Details"
                            >
                              <FaEye />
                              <span className="absolute right-0 top-full mt-1 w-24 bg-gray-900 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                View Details
                              </span>
                            </button>
                            
                            <div className="relative group">
                              <button
                                className="p-1 text-orange-400 hover:text-orange-300 transition-colors"
                                title="Change Status"
                              >
                                <FaEdit />
                                <span className="absolute right-0 top-full mt-1 w-24 bg-gray-900 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  Change Status
                                </span>
                              </button>
                              
                              <div className="absolute right-0 top-full mt-1 w-32 bg-gray-800 rounded-md shadow-lg border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                                {booking.status !== 'confirmed' && (
                                  <button
                                    className="w-full text-left px-3 py-2 text-sm text-green-400 hover:bg-gray-700 rounded-t-md flex items-center space-x-2"
                                    onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                    disabled={actionLoading === booking.id}
                                    title="Confirm booking and send notification to traveler"
                                  >
                                    {actionLoading === booking.id ? 
                                      <FaSpinner className="animate-spin mr-2" /> : 
                                      <FaCheckCircle className="mr-2" />
                                    }
                                    <span>Confirm</span>
                                  </button>
                                )}
                                
                                {booking.status !== 'pending' && (
                                  <button
                                    className="w-full text-left px-3 py-2 text-sm text-yellow-400 hover:bg-gray-700 flex items-center space-x-2"
                                    onClick={() => updateBookingStatus(booking.id, 'pending')}
                                    disabled={actionLoading === booking.id}
                                    title="Mark as pending and notify traveler"
                                  >
                                    {actionLoading === booking.id ? 
                                      <FaSpinner className="animate-spin mr-2" /> : 
                                      <FaInfoCircle className="mr-2" />
                                    }
                                    <span>Mark Pending</span>
                                  </button>
                                )}
                                
                                {booking.status !== 'completed' && (
                                  <button
                                    className="w-full text-left px-3 py-2 text-sm text-blue-400 hover:bg-gray-700 flex items-center space-x-2"
                                    onClick={() => updateBookingStatus(booking.id, 'completed')}
                                    disabled={actionLoading === booking.id}
                                    title="Mark as completed and notify traveler"
                                  >
                                    {actionLoading === booking.id ? 
                                      <FaSpinner className="animate-spin mr-2" /> : 
                                      <FaCheckCircle className="mr-2" />
                                    }
                                    <span>Complete</span>
                                  </button>
                                )}
                                
                                {booking.status !== 'cancelled' && (
                                  <button
                                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-b-md flex items-center space-x-2"
                                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                    disabled={actionLoading === booking.id}
                                    title="Cancel booking and notify traveler"
                                  >
                                    {actionLoading === booking.id ? 
                                      <FaSpinner className="animate-spin mr-2" /> : 
                                      <FaExclamationTriangle className="mr-2" />
                                    }
                                    <span>Cancel</span>
                                  </button>
                                )}
                                
                                <div className="w-full text-center text-xs text-gray-400 px-2 py-1 border-t border-gray-700 mt-1">
                                  Email notifications will be sent to the traveler
                                </div>
                              </div>
                            </div>
                            
                            <button 
                              className="p-1 text-red-400 hover:text-red-300 transition-colors relative group"
                              title="Delete Booking"
                            >
                              <FaTrashAlt />
                              <span className="absolute right-0 top-full mt-1 w-28 bg-gray-900 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                Delete Booking
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 shadow-lg text-center">
              <FaCalendarAlt className="text-4xl text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No bookings found</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No bookings match your search criteria. Try changing your filters.'
                  : 'You don\'t have any bookings yet. Once travelers book your tours, they will appear here.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
} 