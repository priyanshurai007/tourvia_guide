'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginFix() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          newPassword,
          adminKey
        }),
      });

      const data = await response.json();
      
      setResult({
        success: response.ok,
        status: response.status,
        message: data.message || data.error || 'Unknown response',
        details: data
      });
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Login Fix Tool</h1>
        <p className="mb-6 text-gray-300">
          This admin tool helps reset user passwords when there are login issues.
        </p>

        <form onSubmit={resetPassword} className="bg-gray-800 p-6 rounded-lg mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
              placeholder="user@example.com"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Admin Key
            </label>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
              placeholder="Admin access key"
              required
            />
            <p className="mt-1 text-xs text-gray-400">
              Default key is 'admin-reset-123' unless changed in environment variables
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md"
          >
            {loading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>

        {result && (
          <div className={`bg-gray-800 p-6 rounded-lg mb-8 ${result.success ? 'border border-green-500/30' : 'border border-red-500/30'}`}>
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <div className={result.success ? 'text-green-400' : 'text-red-400'}>
              {result.success ? '✓ Success' : '✗ Failed'}
            </div>
            <p className="text-gray-300 my-2">{result.message}</p>
            
            {result.success && (
              <div className="mt-4">
                <p className="text-gray-300 mb-4">Password has been reset successfully. User can now log in with the new password.</p>
                <Link href="/login-test">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
                    Test Login Now
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 justify-center mt-6">
          <Link href="/login" className="text-orange-400 hover:text-orange-300">
            Return to login
          </Link>
          <Link href="/login-test" className="text-orange-400 hover:text-orange-300">
            Go to login test
          </Link>
        </div>
      </div>
    </div>
  );
} 