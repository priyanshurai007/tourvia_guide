'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';

// Map of guide IDs to slugs
const guideIdToSlug: { [key: string]: string } = {
  '1': 'maria-rodriguez',
  '2': 'sophia-chen',
  '3': 'hiroshi-tanaka',
  '4': 'james-wilson',
  '5': 'raj-mehta',
  '6': 'marco-rossi',
  '7': 'aisha-rahman',
  '8': 'carlos-mendoza',
  '9': 'emma-wilson'
};

function Call() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const guideId = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!guideId) {
      // Redirect to search guides if no ID provided
      console.log('No guide ID provided, redirecting to search page');
      router.replace('/search-guides');
      return;
    }

    const fetchGuideAndRedirect = async () => {
      try {
        setLoading(true);
        console.log(`Fetching guide with ID: ${guideId}`);

        // Check if the ID is a MongoDB ObjectId (24 characters hex string)
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(guideId);
        console.log(`Is ID a MongoDB ObjectId? ${isObjectId}`);

        // Fetch guide from API by ID
        const response = await fetch(`/api/guides/profile?slug=${guideId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add cache control to prevent caching issues
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });

        console.log(`API response status: ${response.status}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Guide not found');
          }

          // Try to get error details from response
          let errorDetail = '';
          try {
            const errorData = await response.json();
            errorDetail = errorData.error || errorData.details || response.statusText;
          } catch (e) {
            errorDetail = response.statusText;
          }

          throw new Error(`Failed to fetch guide: ${errorDetail}`);
        }

        const data = await response.json();
        console.log(`Received data: success=${data.success}`);

        if (data.success && data.guide) {
          // Add a short delay to ensure the guide data is processed by the database
          await new Promise(resolve => setTimeout(resolve, 500));

          console.log(`Redirecting to guide profile: ${data.guide.slug}`);
          // Redirect to the guide profile using the slug
          router.replace(`/guides/${data.guide.slug}`);
        } else if (data.error) {
          throw new Error(data.error);
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (err) {
        console.error('Error fetching guide:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchGuideAndRedirect();
  }, [guideId, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto bg-gray-800 p-8 rounded-lg">
          <h1 className="text-2xl font-bold text-red-400">Error</h1>
          <p className="text-gray-300 mt-4">{error}</p>
          <div className="mt-6 flex flex-col space-y-2">
            <button
              onClick={() => router.push('/search-guides')}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-md"
            >
              Return to Search
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <FaSpinner className="animate-spin text-orange-500 mx-auto mb-4" size={40} />
        <h1 className="text-2xl font-bold mb-4">Redirecting to guide profile...</h1>
        <p>Please wait while we redirect you to the guide's profile page.</p>
      </div>
    </div>
  );
}

export default function GuideProfileRedirect() {
  return (
    <Suspense>
      <Call />
    </Suspense>
  )
} 