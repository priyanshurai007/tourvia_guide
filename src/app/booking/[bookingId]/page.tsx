'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUserFriends, 
  FaMapMarkerAlt, 
  FaMoneyBillWave,
  FaUserAlt,
  FaEnvelope,
  FaPhone,
  FaInfoCircle,
  FaArrowLeft,
  FaSpinner,
  FaTimes
} from 'react-icons/fa';
import DateDisplay from '@/components/DateDisplay';

interface BookingDetails {
  id: string;
  traveler: {
    id: string;
    name: string;
    email: string;
  };
  guide: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    bio: string;
    languages: string[];
    specialty: string;
  };
  tour: {
    id: string;
    title: string;
    price: number;
    duration: string;
    description: string;
    images: string[];
    location: string;
  };
  date: string;
  time: string;
  participants: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function BookingDetailsPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const resolvedParams = React.use(params);
  const bookingId = resolvedParams.bookingId;
  
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingBooking, setCancelingBooking] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/bookings/${bookingId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch booking details');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setBooking(data.booking);
        } else {
          throw new Error(data.error || 'Failed to fetch booking details');
        }
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [bookingId]);

  const cancelBooking = async () => {
    try {
      setCancelingBooking(true);
      
      const response = await fetch('/api/dashboard/cancel-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel booking');
      }
      
      // Refresh booking data
      const updatedResponse = await fetch(`/api/bookings/${bookingId}`);
      const updatedData = await updatedResponse.json();
      
      if (updatedData.success) {
        setBooking(updatedData.booking);
        setShowCancelModal(false);
      }
    } catch (err) {
      console.error('Error canceling booking:', err);
      alert(err instanceof Error ? err.message : 'Failed to cancel booking');
    } finally {
      setCancelingBooking(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-900 text-green-300';
      case 'pending':
        return 'bg-yellow-900 text-yellow-300';
      case 'cancelled':
        return 'bg-red-900 text-red-300';
      case 'completed':
        return 'bg-blue-900 text-blue-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-xl">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md bg-gray-800 p-8 rounded-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition mr-4"
          >
            Go Back
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No booking data state
  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md bg-gray-800 p-8 rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
          <p className="text-gray-300 mb-6">
            The booking you're looking for could not be found.
          </p>
          <Link href="/dashboard">
            <button className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-gray-300 hover:text-white transition"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
        </div>
        
        {/* Booking title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{booking.tour.title}</h1>
          <div className="flex items-center mt-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            <span className="text-gray-400 ml-4">
              Booking ID: {booking.id}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content (left column) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tour image */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="relative h-80 w-full">
                <Image 
                  src={booking.tour.images[0] || 'https://images.unsplash.com/photo-1528493859953-39d70f2a62f2'} 
                  alt={`${booking.tour.title} tour image - ${booking.tour.location}`} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  priority
                  unoptimized
                />
              </div>
            </div>
            
            {/* Tour details */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Tour Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-orange-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-gray-300">{booking.tour.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaCalendarAlt className="text-orange-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Date</h3>
                    <p className="text-gray-300">
                      <DateDisplay date={booking.date} />
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaClock className="text-orange-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Time & Duration</h3>
                    <p className="text-gray-300">
                      {booking.time} • {booking.tour.duration}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaUserFriends className="text-orange-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Group Size</h3>
                    <p className="text-gray-300">{booking.participants} participant(s)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaMoneyBillWave className="text-orange-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Price Details</h3>
                    <p className="text-gray-300">
                      ₹{booking.tour.price} × {booking.participants} = ₹{booking.totalPrice}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="font-medium mb-2">Tour Description</h3>
                <p className="text-gray-300 whitespace-pre-line">
                  {booking.tour.description}
                </p>
              </div>
            </div>
          </div>
          
          {/* Sidebar (right column) */}
          <div className="space-y-6">
            {/* Guide information */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Your Guide</h2>
              
              <div className="flex items-center mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image 
                    src={booking.guide.avatar || '/images/default-avatar.png'} 
                    alt={`Profile photo of guide ${booking.guide.name}`}
                    fill
                    sizes="64px"
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-lg">{booking.guide.name}</h3>
                  <p className="text-orange-400">{booking.guide.specialty}</p>
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-start">
                  <FaEnvelope className="text-gray-400 mt-1 mr-3" />
                  <p className="text-gray-300">{booking.guide.email}</p>
                </div>
                
                {booking.guide.phone && (
                  <div className="flex items-start">
                    <FaPhone className="text-gray-400 mt-1 mr-3" />
                    <p className="text-gray-300">{booking.guide.phone}</p>
                  </div>
                )}
                
                {booking.guide.languages && booking.guide.languages.length > 0 && (
                  <div className="flex items-start">
                    <FaInfoCircle className="text-gray-400 mt-1 mr-3" />
                    <div>
                      <p className="text-gray-300">
                        Languages: {booking.guide.languages.join(', ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 space-y-3">
                <Link href={`/guide/${booking.guide.id}`}>
                  <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition">
                    View Guide Profile
                  </button>
                </Link>
                
                <Link href={`/messages?guide=${booking.guide.id}`}>
                  <button className="w-full px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition">
                    Message Guide
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Booking Actions */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Booking Actions</h2>
              
              <div className="space-y-3">
                {booking.status.toLowerCase() === 'confirmed' && (
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                    Download Confirmation
                  </button>
                )}
                
                {(booking.status.toLowerCase() === 'pending' || booking.status.toLowerCase() === 'confirmed') && (
                  <button 
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    onClick={() => setShowCancelModal(true)}
                  >
                    Cancel Booking
                  </button>
                )}
                
                {booking.status.toLowerCase() === 'completed' && (
                  <Link href={`/write-review/${booking.id}`}>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                      Write a Review
                    </button>
                  </Link>
                )}
                
                <Link href="/dashboard">
                  <button className="w-full px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition">
                    Back to Dashboard
                  </button>
                </Link>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-gray-400 text-sm">
                  <strong>Booking created on:</strong>{' '}
                  {new Date(booking.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cancel booking confirmation modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Confirm Cancellation</h3>
              <button 
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            
            <p className="text-gray-300 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition"
              >
                No, Keep Booking
              </button>
              <button
                onClick={cancelBooking}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center"
                disabled={cancelingBooking}
              >
                {cancelingBooking ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Cancelling...
                  </>
                ) : (
                  <>Yes, Cancel</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 