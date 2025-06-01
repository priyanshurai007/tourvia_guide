'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestGuideRedirect() {
  const router = useRouter();
  const [status, setStatus] = useState<string>('Setting up test guide account...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const setupGuideAccount = async () => {
      try {
        setStatus('Calling test guide signup endpoint...');
        const response = await fetch('/api/auth/test-guide-signup');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setStatus('Test guide account created successfully!');

        // Store user information in localStorage for the dashboard
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'guide');
        localStorage.setItem('userName', data.user.name);

        // Broadcast login event
        window.dispatchEvent(new Event('userLoggedIn'));
        window.dispatchEvent(new Event('storage'));

        // Redirect after a short delay
        setStatus('Redirecting to guide dashboard...');
        setTimeout(() => {
          router.push('/guide-dashboard');
        }, 1000);
      } catch (err) {
        console.error('Error in test guide redirect:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setStatus('Failed to set up test guide account');
      }
    };

    setupGuideAccount();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-4">Guide Dashboard Redirect Test</h1>
        
        <div className="mb-4">
          <p className="text-gray-300">{status}</p>
          {!error && (
            <div className="mt-4 flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500 mr-3"></div>
              <span className="text-gray-400">This page will automatically redirect...</span>
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded-md">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
} 