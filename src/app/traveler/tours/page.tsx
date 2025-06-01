import Link from 'next/link';
import connectDB from '@/lib/db';
import Tour from '@/models/Tour';

async function getToursData() {
  try {
    await connectDB();
    
    // Fetch all available tours
    const tours = await Tour.find({ availableSpots: { $gt: 0 } })
      .populate('guideId', 'name rating')
      .sort({ date: 1 });
    
    return { tours };
  } catch (error) {
    console.error('Error fetching tours:', error);
    return { error: 'Failed to fetch tours' };
  }
}

export default async function ToursPage() {
  const { tours, error } = await getToursData();
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Available Tours</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error loading tours. Please try again later.
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Tours</h1>
      
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              placeholder="Search by location"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <select className="w-full p-2 border rounded-md">
              <option value="">Any Price</option>
              <option value="0-2000">Under ₹2,000</option>
              <option value="2000-5000">₹2,000 - ₹5,000</option>
              <option value="5000-10000">₹5,000 - ₹10,000</option>
              <option value="10000+">Above ₹10,000</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <select className="w-full p-2 border rounded-md">
              <option value="">Any Duration</option>
              <option value="1-3">1-3 hours</option>
              <option value="4-8">Half day (4-8 hours)</option>
              <option value="8-24">Full day (8-24 hours)</option>
              <option value="24+">Multi-day</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
              Search Tours
            </button>
          </div>
        </div>
      </div>
      
      {/* Tour Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours && tours.length > 0 ? (
          tours.map((tour) => (
            <div key={tour._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img
                src={tour.image || '/images/default-tour.jpg'}
                alt={tour.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{tour.title}</h3>
                <p className="text-gray-600 mb-2 line-clamp-2">{tour.description}</p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span>{tour.guideId?.rating || '4.5'}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-600">{tour.location}</span>
                </div>
                <div className="flex items-center mb-4">
                  <span className="text-gray-600 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {tour.duration} hours
                  </span>
                  <span className="text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    {tour.availableSpots} spots left
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">₹{tour.price}</span>
                  <Link 
                    href={`/traveler/tours/${tour._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center p-8 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-gray-600 mb-2">No tours found</h3>
            <p className="text-gray-500">Check back later for new tour offerings.</p>
          </div>
        )}
      </div>
    </div>
  );
}