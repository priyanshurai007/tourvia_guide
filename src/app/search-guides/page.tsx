'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Define the guide interface
interface Guide {
  id: string | number;
  name: string;
  location: string;
  languages: string[];
  rating: number;
  reviews: number;
  price: number;
  image: string;
  specialties: string[];
  slug: string;
}

function Call() {
  const searchParams = useSearchParams();
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [language, setLanguage] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [filters, setFilters] = useState({
    priceMin: 500,
    priceMax: 5000,
    rating: 0
  });
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Handle location parameter from destination pages
  useEffect(() => {
    const locationParam = searchParams.get('location');
    if (locationParam) {
      setLocation(locationParam);
    }
  }, [searchParams]);

  // Fetch guides from API
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true);

        let url = '/api/guides';

        // Only apply filters after initial load or when filters change
        if (!initialLoad) {
          // Build query parameters
          const queryParams = new URLSearchParams();
          if (location) queryParams.append('location', location);
          if (language) queryParams.append('language', language);
          if (specialty) queryParams.append('specialty', specialty);
          queryParams.append('priceMin', filters.priceMin.toString());
          queryParams.append('priceMax', filters.priceMax.toString());
          queryParams.append('rating', filters.rating.toString());

          // Add query params to URL if any exist
          const queryString = queryParams.toString();
          if (queryString) {
            url += `?${queryString}`;
          }
        }

        console.log(`Fetching guides from: ${url}`);

        // Fetch guides from API
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch guides: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Received data from API: success=${data.success}, guides count=${data.guides?.length || 0}`);

        if (data.success && Array.isArray(data.guides)) {
          setGuides(data.guides);
          setError(null);

          // Mark initial load as complete after first successful load
          if (initialLoad) {
            setInitialLoad(false);
          }
        } else if (data.error) {
          throw new Error(data.error);
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (err) {
        console.error('Error fetching guides:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setGuides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, [location, language, specialty, filters, initialLoad]);

  // Fallback to mock data if there are no guides or there's an error
  // This ensures the UI always has something to display during development
  const guidesToDisplay = guides.length > 0 ? guides : [];

  return (
    <div className="min-h-screen bg-gray-900 pb-12">
      {/* Search Header */}
      <section className="bg-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Find Your Perfect Guide in India</h1>
          <div className="bg-gray-800 rounded-lg p-4 shadow-md">
            {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">Destination</label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where in India?"
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-orange-500 focus:border-orange-500 placeholder-gray-400"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-1">Language</label>
                <input
                  type="text"
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="Hindi, English, etc."
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-orange-500 focus:border-orange-500 placeholder-gray-400"
                />
              </div>
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-300 mb-1">Specialty</label>
                <input
                  type="text"
                  id="specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="History, Food, Culture, etc."
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-orange-500 focus:border-orange-500 placeholder-gray-400"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => {
                  // Reset focus on search button when clicked
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                  }
                }}
                className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                Search Guides
              </button>
            </div> */}
            <div className="mt-4 flex items-end w-full mx-auto max-w-3xl justify-center gap-4">
              <div className='w-full md:w-1/2'>
                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                  Destination
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where in India?"
                  className="w-full p-2.5 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-orange-500 focus:border-orange-500 placeholder-gray-400"
                />
              </div>
              <div className='w-full md:w-1/2'>
                <label className="block text-sm font-medium text-gray-300 mb-1 invisible">
                  Search
                </label>
                <button
                  onClick={() => {
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                  }}
                  className="w-full p-2.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-medium"
                >
                  Search Guides
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          {/* <div className="w-full md:w-64 bg-gray-800 p-4 rounded-lg shadow-md h-fit">
            <h2 className="font-semibold text-lg mb-4 text-white">Filters</h2>

            <div className="mb-4">
              <h3 className="font-medium mb-2 text-gray-300">Price Range (₹ per day)</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={filters.priceMin}
                  onChange={(e) => setFilters({ ...filters, priceMin: Number(e.target.value) })}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                  min="500"
                />
                <span className="text-gray-300">to</span>
                <input
                  type="number"
                  value={filters.priceMax}
                  onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) })}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                  min="500"
                  max="5000"
                />
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2 text-gray-300">Minimum Rating</h3>
              <select
                value={filters.rating}
                onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
              >
                <option value="0">Any rating</option>
                <option value="3">3+ stars</option>
                <option value="4">4+ stars</option>
                <option value="4.5">4.5+ stars</option>
                <option value="5">5 stars only</option>
              </select>
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2 text-gray-300">Popular Specialties</h3>
              <div className="space-y-2">
                {['History', 'Food', 'Culture', 'Architecture', 'Spirituality', 'Nature', 'Photography'].map((item) => (
                  <div key={item} className="flex items-center">
                    <input
                      id={`specialty-${item}`}
                      type="checkbox"
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-700 rounded bg-gray-700"
                      onChange={() => setSpecialty(specialty === item ? '' : item)}
                      checked={specialty === item}
                    />
                    <label htmlFor={`specialty-${item}`} className="ml-2 text-sm text-gray-300">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setFilters({ priceMin: 500, priceMax: 5000, rating: 0 });
                setSpecialty('');
                setLocation('');
                setLanguage('');
              }}
              className="w-full py-2 text-sm text-orange-400 border border-orange-500 rounded-md hover:bg-gray-700"
            >
              Reset Filters
            </button>
          </div> */}

          {/* Guide Results */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
                <span className="ml-3 text-gray-300">Searching for guides...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-red-900/30 rounded-lg border border-red-700">
                <h3 className="text-lg font-medium text-red-200">Error loading guides</h3>
                <p className="mt-2 text-red-300">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">
                    {guidesToDisplay.length} Guide{guidesToDisplay.length !== 1 ? 's' : ''} Available
                  </h2>
                  <select className="p-2 border border-gray-600 rounded-md bg-gray-700 text-white">
                    <option>Sort by: Recommended</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Rating: High to Low</option>
                    <option>Reviews: Most to Least</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guidesToDisplay.map((guide) => (
                    <Link
                      href={`/guides/${guide.slug || guide.id}`}
                      key={guide.id}
                      onClick={(e) => {
                        // Log the guide information before navigation
                        console.log(`Navigating to guide: ${guide.name}, ID: ${guide.id}, Slug: ${guide.slug}`);

                        // Check if the slug is valid
                        if (!guide.slug && !guide.id) {
                          e.preventDefault();
                          console.error('Invalid guide data: missing slug and id');
                          alert('Unable to view this guide profile. Please try another guide.');
                        }
                      }}
                    >
                      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                        <div className="relative h-48">
                          <Image
                            src={guide.image}
                            alt={`${guide.name}, local guide in ${guide.location}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            style={{ objectFit: "cover" }}
                            unoptimized
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-white">{guide.name}</h3>
                            <div className="flex items-center">
                              <span className="text-yellow-500">★</span>
                              <span className="ml-1 font-medium text-white">{guide.rating}</span>
                              <span className="ml-1 text-gray-400 text-sm">({guide.reviews})</span>
                            </div>
                          </div>
                          <p className="text-gray-300 mt-1">{guide.location}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {guide.specialties.slice(0, 3).map((specialty, idx) => (
                              <span key={idx} className="px-2 py-1 bg-orange-900 text-orange-300 rounded-full text-xs">
                                {specialty}
                              </span>
                            ))}
                          </div>
                          <div className="mt-2 text-sm text-gray-300">
                            Speaks: {guide.languages.join(', ')}
                          </div>
                          <div className="mt-3 flex justify-between items-center">
                            <div className="font-bold text-white">₹{guide.price} <span className="text-sm font-normal text-gray-300">/ day</span></div>
                            <span className="px-3 py-1 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700">
                              View Profile
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {guidesToDisplay.length === 0 && (
                  <div className="text-center py-12 bg-gray-800 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-white">No guides found</h3>
                    <p className="mt-2 text-gray-300">Try adjusting your search filters</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default function SearchGuides() {
  return (
    <Suspense>
      <Call />
    </Suspense>
  )
}