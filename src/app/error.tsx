'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const [isSchemaError, setIsSchemaError] = useState(false);

  useEffect(() => {
    console.error('Application error:', error);
    
    // Check if this is a schema registration error
    if (error.message.includes('Schema hasn\'t been registered for model')) {
      setIsSchemaError(true);
      
      // Try to preload models via ping API
      fetch('/api/ping', { cache: 'no-store' })
        .then(response => response.json())
        .then(data => {
          console.log('Model preload attempt:', data);
          if (data.success) {
            console.log('Models loaded successfully, attempting to reset');
            // Reset the error boundary after models are loaded
            setTimeout(() => reset(), 1500);
          }
        })
        .catch(err => console.error('Failed to preload models:', err));
    }
  }, [error, reset]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center max-w-md bg-gray-800 p-8 rounded-lg">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        
        {isSchemaError ? (
          <>
            <p className="text-gray-300 mb-6">
              We encountered a database model registration error. We're trying to fix this automatically...
            </p>
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mb-4"></div>
          </>
        ) : (
          <p className="text-gray-300 mb-6">
            {error.message || 'An unexpected error occurred'}
          </p>
        )}
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={reset}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
          >
            Try Again
          </button>
          
          <Link href="/">
            <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition">
              Go Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 