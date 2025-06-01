'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setCookie } from 'cookies-next';
import Image from 'next/image';
import { FaUser, FaLock } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [debug, setDebug] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setDebug('');

    try {
      // Check for admin credentials
      if (formData.email === 'admin@admin.com' && formData.password === 'Admin@2022') {
        setSuccess('Admin login successful! Redirecting to admin dashboard...');
        
        // Create admin user object
        const adminUser = {
          _id: 'admin',
          name: 'Administrator',
          email: 'admin@admin.com',
          role: 'admin'
        };

        // Create a proper JWT token for admin - matching the structure expected by jwtDecode
        const adminPayload = {
          id: 'admin',
          name: 'Administrator',
          email: 'admin@admin.com',
          role: 'admin',
          exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days expiration
        };
        
        // Create a base64 encoded JWT-like token (header.payload.signature)
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify(adminPayload));
        const signature = btoa('adminsignature'); // This is a placeholder, not a real signature
        const adminToken = `${header}.${payload}.${signature}`;

        // Store token with admin role
        setCookie('token', adminToken, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });

        // Store admin information in localStorage
        localStorage.setItem('user', JSON.stringify(adminUser));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userName', 'Administrator');

        // Broadcast login event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('userLoggedIn'));
          window.dispatchEvent(new Event('storage'));
        }

        // Redirect to admin dashboard
        setTimeout(() => {
          router.push('/admin');
        }, 500);
        return;
      }

      setDebug('Sending login request to direct-login endpoint...');

      const response = await fetch('/api/auth/direct-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setDebug(prev => `${prev}\nResponse status: ${response.status}`);
      const data = await response.json();
      setDebug(prev => `${prev}\nReceived response: ${JSON.stringify(data, null, 2)}`);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      setSuccess('Login successful! Redirecting to dashboard...');

      // Store token in cookie
      setCookie('token', data.token, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      // Store user information in localStorage for menu access
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', data.user.role || 'traveler');
      localStorage.setItem('userName', data.user.name || '');

      // Broadcast login event to update UI components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('userLoggedIn'));
        window.dispatchEvent(new Event('storage')); // Trigger storage event for components that listen to it
      }

      // Short delay to ensure everything is set before redirect
      setTimeout(() => {
        // Redirect based on user role
        if (data.user && data.user.role) {
          if (data.user.role === 'guide') {
            router.push('/guide-dashboard');
          } else {
            router.push('/dashboard');
          }
        } else {
          router.push('/dashboard');
        }
      }, 500);
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Failed to login');
      setDebug(prev => `${prev}\nError: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-3">
            <div className="bg-orange-500 p-3 rounded-full">
              <FaUser className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-orange-400 hover:text-orange-300 transition-colors">
              Sign up now
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg" role="alert">
              <span className="block sm:inline">{success}</span>
            </div>
          )}

          {debug && process.env.NODE_ENV === 'development' && (
            <pre className="bg-gray-800/50 text-gray-300 p-4 rounded-lg text-xs overflow-auto">
              {debug}
            </pre>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${loading
                  ? 'bg-orange-500/50 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all'
                }`}
            >
              {loading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : null}
              {loading ? 'Signing in...' : 'Sign in to your account'}
            </button>
          </div>

          <div className="flex items-center justify-center mt-4">
            <Link
              href="/forgot-password"
              className="flex items-center text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors"
            >
              <FaLock className="mr-2 h-4 w-4" />
              Forgot your password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 