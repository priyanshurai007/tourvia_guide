'use client';

import { useState } from 'react';

export default function TestDatabasePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testDatabase = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/db-test');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectMongoDB = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/direct-mongodb');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const testBooking = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/test-booking');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Database Test Page</h1>
      
      <div className="flex flex-wrap gap-4 mb-8">
        <button 
          onClick={testDatabase}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          Test Database Connection
        </button>
        
        <button 
          onClick={testDirectMongoDB}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          Test Direct MongoDB
        </button>
        
        <button 
          onClick={testBooking}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
        >
          Test Create Booking
        </button>
      </div>
      
      {loading && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <p className="text-gray-700">Loading...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error!</p>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Result:</h2>
          <pre className="whitespace-pre-wrap overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 