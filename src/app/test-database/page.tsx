'use client';

import { useState, useEffect } from 'react';

export default function TestDatabasePage() {
  const [loading, setLoading] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<any>(null);
  const [bookingTestResult, setBookingTestResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testDirectConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/db-test');
      const data = await response.json();
      setDbTestResult(data);
    } catch (err) {
      setError(`Error testing database: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const testCreateBooking = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/test-booking');
      const data = await response.json();
      setBookingTestResult(data);
    } catch (err) {
      setError(`Error creating booking: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const initializeDatabase = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/init-db');
      const data = await response.json();
      setDbTestResult(data);
    } catch (err) {
      setError(`Error initializing database: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Database Test Page</h1>
      
      <div className="flex flex-wrap gap-4 mb-8">
        <button 
          onClick={testDirectConnection}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          Test Direct Connection
        </button>
        
        <button 
          onClick={testCreateBooking}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          Test Create Booking
        </button>
        
        <button 
          onClick={initializeDatabase}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
        >
          Initialize Database
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
      
      {dbTestResult && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Database Test Result</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="whitespace-pre-wrap">{JSON.stringify(dbTestResult, null, 2)}</pre>
          </div>
        </div>
      )}
      
      {bookingTestResult && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Booking Test Result</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="whitespace-pre-wrap">{JSON.stringify(bookingTestResult, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
} 