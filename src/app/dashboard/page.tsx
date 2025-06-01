'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DateDisplay from '@/components/DateDisplay';
import AccountSettingsPopup from '@/components/AccountSettingsPopup';
import { FaUserEdit, FaCog } from 'react-icons/fa';

// Define types for the dashboard data
interface Booking {
  id: string;
  tourName: string;
  guideName: string;
  location: string;
  date: string;
  time: string;
  status: string;
  image: string;
  hasReviewed?: boolean;
}

interface SavedGuide {
  id: string;
  name: string;
  location: string;
  rating: number;
  specialty: string;
  image: string;
}

interface UserData {
  name: string;
  avatar: string;
  email?: string;
  phone?: string;
  location?: string;
  dob?: string;
  bio?: string;
  preferences?: {
    tourTypes?: string[];
    languages?: string[];
  };
  profileCompleted?: boolean;
  upcomingBookings: Booking[];
  pastBookings: Booking[];
  savedGuides: SavedGuide[];
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingGuide, setRemovingGuide] = useState<string | null>(null);
  const [cancelingBooking, setCancelingBooking] = useState<string | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // First, try to ensure model registration by making multiple ping requests
        let pingSuccessful = false;
        for (let i = 0; i < 3; i++) {
          try {
            console.log(`Attempting ping ${i+1}/3...`);
            const pingResponse = await fetch('/api/ping', { 
              method: 'GET',
              cache: 'no-store' 
            });
            const pingData = await pingResponse.json();
            console.log('Ping response:', pingData);
            
            if (pingData.success && pingData.models && pingData.models.includes('Tour')) {
              console.log('Tour model successfully registered');
              pingSuccessful = true;
              break;
            } else {
              console.warn('Tour model not found in ping response, retrying...');
              // Wait a bit before retrying
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          } catch (e) {
            console.warn('Ping error:', e);
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        if (!pingSuccessful) {
          console.warn('Could not verify model registration via ping, continuing anyway...');
        }
        
        // Now fetch the dashboard data
        console.log('Fetching dashboard data...');
        const response = await fetch('/api/dashboard/user-dashboard', {
          cache: 'no-store'
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        if (data.success) {
          setUserData(data.userData);
          
          // If profile is not completed, show the prompt
          if (data.userData && !data.userData.profileCompleted) {
            setShowProfilePrompt(true);
          }
        } else {
          throw new Error(data.error || 'Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const removeSavedGuide = async (guideId: string) => {
    if (!userData) return;
    
    try {
      setRemovingGuide(guideId);
      
      const response = await fetch('/api/dashboard/remove-saved-guide', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guideId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove guide');
      }
      
      // Update local state to remove the guide
      setUserData({
        ...userData,
        savedGuides: userData.savedGuides.filter(guide => guide.id !== guideId)
      });
      
    } catch (err) {
      console.error('Error removing saved guide:', err);
      alert('Failed to remove guide from saved collection');
    } finally {
      setRemovingGuide(null);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    if (!userData) return;
    
    try {
      setCancelingBooking(bookingId);
      
      const response = await fetch('/api/dashboard/cancel-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to cancel booking');
      }
      
      // Update local state to change the booking status
      setUserData({
        ...userData,
        upcomingBookings: userData.upcomingBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'Canceled' } 
            : booking
        )
      });
      
      // Close the confirmation modal
      setBookingToCancel(null);
      
    } catch (err) {
      console.error('Error canceling booking:', err);
      alert(err instanceof Error ? err.message : 'Failed to cancel booking');
    } finally {
      setCancelingBooking(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-xl">Loading your dashboard...</p>
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
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state (user not authenticated or no data found)
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md bg-gray-800 p-8 rounded-lg">
          <h1 className="text-2xl font-bold mb-4">No Dashboard Data</h1>
          <p className="text-gray-300 mb-6">
            Please log in to view your dashboard.
          </p>
          <Link href="/login">
            <div className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition inline-block">
              Log In
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-16 w-16 relative rounded-full overflow-hidden border-2 border-orange-500">
              <Image 
                src={userData.avatar || '/images/default-avatar.png'} 
                alt={userData.name}
                fill
                sizes="64px"
                className="object-cover"
                priority
                unoptimized
              />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold">Welcome, {userData.name}</h1>
              <p className="text-gray-400">Manage your bookings and saved guides</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md border border-gray-700 transition"
          >
            <FaCog className="mr-2" />
            Account Settings
          </button>
        </div>
        
        {/* Profile completion prompt */}
        {showProfilePrompt && (
          <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-orange-600">
            <div className="flex items-start md:items-center">
              <div className="hidden md:block bg-orange-700 p-3 rounded-md mr-4">
                <FaUserEdit className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white">Complete Your Profile</h3>
                <p className="text-gray-400 mt-1">
                  Please take a moment to complete your profile information. This helps guides provide you with a more personalized experience.
                </p>
              </div>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="ml-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition"
              >
                Complete Now
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image 
                  src={userData.avatar} 
                  alt={userData.name}
                  fill
                  sizes="64px"
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{userData.name}</h2>
                <p className="text-orange-400">Traveler</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              <button 
                className={`w-full text-left px-4 py-2 rounded-md transition ${activeTab === 'upcoming' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming Trips
              </button>
              <button 
                className={`w-full text-left px-4 py-2 rounded-md transition ${activeTab === 'past' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                onClick={() => setActiveTab('past')}
              >
                Past Trips
              </button>
              <button 
                className={`w-full text-left px-4 py-2 rounded-md transition ${activeTab === 'saved' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                onClick={() => setActiveTab('saved')}
              >
                Saved Guides
              </button>
            </nav>
            
            <div className="mt-8 pt-6 border-t border-gray-700">
              <Link href="/search-guides">
                <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition">
                  Find New Guides
                </button>
              </Link>
              <Link href="/account-settings">
                <button className="w-full mt-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition">
                  Account Settings
                </button>
              </Link>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 w-full">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">My Dashboard</h1>
              <p className="text-gray-400 mt-1">Manage your bookings and saved guides</p>
            </div>
            
            {/* Upcoming Bookings */}
            {activeTab === 'upcoming' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Upcoming Trips</h2>
                
                {userData.upcomingBookings.length > 0 ? (
                  userData.upcomingBookings.map((booking, index) => (
                    <div key={booking.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                      <div className="relative w-full md:w-48 h-48 md:h-auto">
                        <Image 
                          src={booking.image} 
                          alt={booking.tourName}
                          fill
                          sizes="(max-width: 768px) 100vw, 192px"
                          style={{ objectFit: "cover" }}
                          priority={index === 0}
                          unoptimized
                        />
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-lg">{booking.tourName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs 
                            ${booking.status === 'Confirmed' ? 'bg-green-900 text-green-300' : 
                              booking.status === 'Canceled' ? 'bg-red-900 text-red-300' : 
                              'bg-yellow-900 text-yellow-300'}`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-gray-300 mt-1">
                          <span className="font-medium">Guide:</span> {booking.guideName}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Location:</span> {booking.location}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Date:</span> <DateDisplay date={booking.date} />
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Time:</span> {booking.time}
                        </p>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link href={`/booking/${booking.id}`}>
                            <button className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                              View Details
                            </button>
                          </Link>
                          {booking.status !== 'Canceled' && (
                            <button 
                              className="px-4 py-2 border border-red-500 text-red-400 rounded-md hover:bg-red-900"
                              onClick={() => setBookingToCancel(booking.id)}
                              disabled={cancelingBooking !== null}
                            >
                              {cancelingBooking === booking.id ? 'Canceling...' : 'Cancel Booking'}
                            </button>
                          )}
                          <Link href={`/messages?guide=${booking.id}`}>
                            <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700">
                              Contact Guide
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-800 rounded-lg">
                    <h3 className="text-lg font-medium">No upcoming trips</h3>
                    <p className="text-gray-400 mt-2">Start exploring to find your next adventure</p>
                    <Link href="/search-guides">
                      <div className="mt-4 inline-block px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                        Find Guides
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Past Bookings */}
            {activeTab === 'past' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Past Trips</h2>
                
                {userData.pastBookings.length > 0 ? (
                  userData.pastBookings.map(booking => (
                    <div key={booking.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                      <div className="relative w-full md:w-48 h-48 md:h-auto">
                        <Image 
                          src={booking.image} 
                          alt={booking.tourName}
                          fill
                          sizes="(max-width: 768px) 100vw, 192px"
                          style={{ objectFit: "cover" }}
                          unoptimized
                        />
                      </div>
                      <div className="p-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-lg">{booking.tourName}</h3>
                          <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-gray-300 mt-1">
                          <span className="font-medium">Guide:</span> {booking.guideName}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Location:</span> {booking.location}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Date:</span> <DateDisplay date={booking.date} />
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Time:</span> {booking.time}
                        </p>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link href={`/booking/${booking.id}`}>
                            <button className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                              View Details
                            </button>
                          </Link>
                          {!booking.hasReviewed && booking.status !== 'Canceled' && (
                            <Link href={`/write-review/${booking.id}`}>
                              <button className="px-4 py-2 border border-green-500 text-green-400 rounded-md hover:bg-green-900">
                                Write Review
                              </button>
                            </Link>
                          )}
                          {booking.hasReviewed && (
                            <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md cursor-default">
                              Reviewed ✓
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-800 rounded-lg">
                    <h3 className="text-lg font-medium">No past trips</h3>
                    <p className="text-gray-400 mt-2">Your completed trips will appear here</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Saved Guides */}
            {activeTab === 'saved' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Saved Guides</h2>
                
                {userData.savedGuides.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userData.savedGuides.map(guide => (
                      <div key={guide.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-md flex flex-col">
                        <div className="relative h-48">
                          <Image 
                            src={guide.image} 
                            alt={guide.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{ objectFit: "cover" }}
                            unoptimized
                          />
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="font-semibold text-lg">{guide.name}</h3>
                          <p className="text-gray-300 text-sm mb-1">{guide.location}</p>
                          <div className="flex items-center mb-1">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1">{guide.rating.toFixed(1)}</span>
                          </div>
                          <p className="text-gray-400 text-sm mb-4">
                            <span className="font-medium">Specialty:</span> {guide.specialty}
                          </p>
                          <div className="mt-auto pt-4 flex flex-col space-y-2">
                            <Link href={`/guide/${guide.id}`}>
                              <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition">
                                View Profile
                              </button>
                            </Link>
                            <button 
                              className="w-full px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition"
                              onClick={() => removeSavedGuide(guide.id)}
                              disabled={removingGuide === guide.id}
                            >
                              {removingGuide === guide.id ? (
                                <span className="flex items-center justify-center">
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Removing...
                                </span>
                              ) : (
                                'Remove from Saved'
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-800 rounded-lg">
                    <h3 className="text-lg font-medium">No saved guides</h3>
                    <p className="text-gray-400 mt-2">Save your favorite guides to find them quickly later</p>
                    <Link href="/search-guides">
                      <div className="mt-4 inline-block px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                        Explore Guides
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Settings Popup */}
      {userData && (
        <AccountSettingsPopup
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          userData={userData}
        />
      )}
      
      {/* Booking cancellation confirmation modal */}
      {bookingToCancel && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Confirm Cancellation</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setBookingToCancel(null)}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition"
              >
                No, Keep Booking
              </button>
              <button
                onClick={() => cancelBooking(bookingToCancel)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center"
                disabled={!!cancelingBooking}
              >
                {cancelingBooking === bookingToCancel ? (
                  <span>Canceling...</span>
                ) : (
                  <span>Yes, Cancel</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 