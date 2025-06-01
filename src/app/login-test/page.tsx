'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginTest() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showDatabase, setShowDatabase] = useState(false);
  const [databaseInfo, setDatabaseInfo] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(false);

  const checkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      // If user exists, try to login
      if (data.exists) {
        const loginResponse = await fetch('/api/auth/direct-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const loginData = await loginResponse.json();
        
        setResult({
          userExists: true,
          userInfo: data.user,
          loginSuccess: loginResponse.ok,
          loginData: loginData,
          loginStatus: loginResponse.status
        });
      } else {
        setResult({
          userExists: false,
          userInfo: null,
          searchedFor: data.searchedFor
        });
      }
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  const initDatabase = async () => {
    setDbLoading(true);
    setDatabaseInfo(null);

    try {
      const response = await fetch('/api/database-init');
      const data = await response.json();
      setDatabaseInfo(data);
    } catch (error) {
      setDatabaseInfo({
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    } finally {
      setDbLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Login Test Tool</h1>
        <p className="mb-6 text-gray-300">
          This tool helps you verify your login credentials and debug any login issues.
        </p>

        <form onSubmit={checkLogin} className="bg-gray-800 p-6 rounded-lg mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md"
          >
            {loading ? 'Checking...' : 'Check Login'}
          </button>
        </form>

        {result && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            {result.error ? (
              <div className="text-red-400 mb-2">Error: {result.error}</div>
            ) : result.userExists ? (
              <div>
                <div className="text-green-400 mb-2">✓ User found in database</div>
                <div className="bg-gray-700 p-3 rounded mb-4">
                  <p><strong>Name:</strong> {result.userInfo.name}</p>
                  <p><strong>Email:</strong> {result.userInfo.email}</p>
                  <p><strong>Role:</strong> {result.userInfo.role}</p>
                </div>
                
                {result.loginSuccess ? (
                  <div>
                    <div className="text-green-400 mb-2">✓ Login successful</div>
                    <Link href="/dashboard">
                      <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md">
                        Go to Dashboard
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <div className="text-red-400 mb-2">✗ Login failed</div>
                    <p className="text-gray-300 mb-2">Status: {result.loginStatus}</p>
                    <p className="text-gray-300 mb-2">Reason: {result.loginData?.error || 'Unknown error'}</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="text-red-400 mb-2">✗ User not found in database</div>
                {result.searchedFor && (
                  <div className="text-gray-300 mb-2">
                    <p>Searched for: {result.searchedFor.join(', ')}</p>
                  </div>
                )}
                <Link href="/signup">
                  <button className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md">
                    Sign Up Instead
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Database Tools</h2>
          <button
            onClick={() => setShowDatabase(!showDatabase)}
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md mb-4"
          >
            {showDatabase ? 'Hide Database Info' : 'Show Database Info'}
          </button>

          {showDatabase && (
            <div className="mt-4">
              <button
                onClick={initDatabase}
                disabled={dbLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
              >
                {dbLoading ? 'Initializing...' : 'Initialize Database'}
              </button>
              
              {databaseInfo && (
                <div className="mt-4 bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Database Information</h3>
                  {databaseInfo.error ? (
                    <div className="text-red-400">Error: {databaseInfo.error}</div>
                  ) : (
                    <div>
                      <p>Status: {databaseInfo.success ? 'Success' : 'Failed'}</p>
                      <p>Message: {databaseInfo.message}</p>
                      {databaseInfo.collections && (
                        <div>
                          <p className="font-semibold mt-2">Collections:</p>
                          <ul className="list-disc pl-5">
                            {databaseInfo.collections.map((col: string) => (
                              <li key={col}>{col}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-orange-400 hover:text-orange-300">
            Return to regular login
          </Link>
        </div>
      </div>
    </div>
  );
} 