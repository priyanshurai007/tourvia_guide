import { notFound } from 'next/navigation';
import Link from 'next/link';
import connectDB from '@/lib/db';
import Tour from '@/models/Tour';

async function getTourData(id: string) {
  try {
    await connectDB();
    
    // Find the tour by ID and populate the guide details
    const tour = await Tour.findById(id).populate('guideId');
    
    if (!tour) {
      return { error: 'Tour not found' };
    }
    
    return { tour };
  } catch (error) {
    console.error('Error fetching tour:', error);
    return { error: 'Failed to fetch tour' };
  }
}

export default async function TourDetailPage({ params }: { params: { id: string } }) {
  const { tour, error } = await getTourData(params.id);
  
  if (error) {
    if (error === 'Tour not found') {
      return notFound();
    }
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Tour Details</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error loading tour details. Please try again later.
        </div>
        <Link href="/traveler/tours" className="text-blue-600 hover:text-blue-800">
          ← Back to Tours
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/traveler/tours" className="text-blue-600 hover:text-blue-800 flex items-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Tours
      </Link>
      
      <div className="bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={tour.image || '/images/default-tour.jpg'}
              alt={tour.title}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold mb-2">{tour.title}</h1>
            <div className="flex items-center mb-4">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="mr-2">{tour.guideId?.rating || '4.5'}</span>
              <span className="text-gray-600">{tour.location}</span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Tour Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <p className="font-medium">{tour.duration} hours</p>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <p className="font-medium">{new Date(tour.date).toLocaleDateString('en-GB')}</p>
                </div>
                <div>
                  <span className="text-gray-600">Available Spots:</span>
                  <p className="font-medium">{tour.availableSpots} / {tour.maxParticipants}</p>
                </div>
                <div>
                  <span className="text-gray-600">Price:</span>
                  <p className="font-bold text-blue-600">₹{tour.price}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">About Your Guide</h3>
              <div className="flex items-center">
                <img
                  src={tour.guideId?.avatar || '/images/default-user.jpg'}
                  alt={tour.guideId?.name || 'Guide'}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">{tour.guideId?.name || 'Guide Name'}</p>
                  <p className="text-sm text-gray-600">
                    <span className="text-yellow-500">★</span> {tour.guideId?.rating || '4.5'} ({tour.guideId?.reviewCount || '0'} reviews)
                  </p>
                </div>
              </div>
            </div>
            
            <Link
              href={`/traveler/booking/new?tourId=${tour._id}`}
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Book This Tour
            </Link>
          </div>
        </div>
        
        <div className="p-6 border-t">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">{tour.description}</p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">What to Expect</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Expert guidance from a professional local guide</li>
              <li>Fascinating stories and historical context</li>
              <li>Small group size for a personalized experience</li>
              <li>Flexibility to explore at a comfortable pace</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Meeting Point</h3>
            <p className="text-gray-700">The tour will start at the specified location in {tour.location}. Detailed meeting instructions will be sent after booking.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 