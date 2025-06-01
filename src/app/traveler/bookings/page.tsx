import Link from 'next/link';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';

// Mock user for development
const mockUser = {
  _id: '123456789012345678901234',
  name: 'Test Traveler',
  email: 'traveler@example.com',
  role: 'traveler',
};

async function getUserBookings(userId: string) {
  try {
    await connectDB();
    
    // Find all bookings for this user
    const bookings = await Booking.find({ userId })
      .populate({
        path: 'tourId',
        populate: { path: 'guideId', select: 'name' }
      })
      .sort({ bookingDate: -1 });
    
    return { bookings };
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return { error: 'Failed to fetch bookings' };
  }
}

export default async function BookingsPage() {
  // In production, you would use actual authentication
  // const session = await getServerSession();
  // const userId = session?.user?.id;
  
  // For development, use mock user ID
  const userId = mockUser._id;
  
  // Fetch user bookings
  const { bookings, error } = await getUserBookings(userId);
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error loading bookings. Please try again later.
        </div>
      </div>
    );
  }
  
  // Group bookings by status
  const upcomingBookings = bookings?.filter(b => 
    new Date(b.tourId.date) > new Date() && b.status !== 'cancelled'
  ) || [];
  
  const pastBookings = bookings?.filter(b => 
    new Date(b.tourId.date) < new Date() || b.status === 'cancelled'
  ) || [];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      
      {/* Upcoming Bookings */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Upcoming Tours</h2>
        
        {upcomingBookings.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={booking.tourId.image || '/images/default-tour.jpg'}
                      alt={booking.tourId.title}
                      className="w-full h-32 md:h-full object-cover"
                    />
                  </div>
                  <div className="p-4 md:w-2/3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold mb-1">{booking.tourId.title}</h3>
                      <span className={`px-2 py-1 text-xs leading-none font-semibold rounded-full 
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">Guide: {booking.tourId.guideId?.name || 'Unknown'}</p>
                    
                    <div className="flex flex-wrap gap-4 mb-3 text-sm">
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <span className="ml-1 font-medium">{new Date(booking.tourId.date).toLocaleDateString('en-GB')}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Participants:</span>
                        <span className="ml-1 font-medium">{booking.numberOfParticipants}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Total:</span>
                        <span className="ml-1 font-medium">₹{booking.totalAmount}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        <span className="text-gray-500 text-sm">Booked on: </span>
                        <span className="text-sm">{new Date(booking.bookingDate).toLocaleDateString('en-GB')}</span>
                      </div>
                      <Link
                        href={`/traveler/bookings/${booking._id}`}
                        className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-600">You don't have any upcoming bookings.</p>
            <Link href="/traveler/tours" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
              Browse available tours
            </Link>
          </div>
        )}
      </div>
      
      {/* Past Bookings */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Past Tours</h2>
        
        {pastBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pastBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{booking.tourId.title}</div>
                          <div className="text-xs text-gray-500">Guide: {booking.tourId.guideId?.name || 'Unknown'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.tourId.date).toLocaleDateString('en-GB')}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${booking.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.numberOfParticipants}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{booking.totalAmount}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/traveler/bookings/${booking._id}`} className="text-blue-600 hover:text-blue-900">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-600">You don't have any past bookings.</p>
          </div>
        )}
      </div>
    </div>
  );
}