'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { deleteCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
  role: string;
  name: string;
}

export default function TravelerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check if user is authenticated using cookies
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        const tokenValue = token.split('=')[1];
        
        // Validate token format before decoding
        if (!tokenValue || typeof tokenValue !== 'string' || tokenValue.split('.').length !== 3) {
          console.warn('Invalid token format in traveler layout');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        const decoded = jwtDecode<DecodedToken>(tokenValue);
        
        if (decoded.exp * 1000 < Date.now()) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        if (decoded.role !== 'traveler') {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        setIsAuthenticated(true);
        
        // Fetch user data from the server
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error loading user:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Separate useEffect for redirection
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = () => {
    // Delete the token cookie
    deleteCookie('token');
    
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    
    // Broadcast logout event
    const event = new Event('userLoggedOut');
    window.dispatchEvent(event);
    
    // Redirect to login page
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // If not authenticated, show loading until the redirect happens in the second useEffect
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
        >
          {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        {/* User info */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={user?.avatar || '/images/default-avatar.png'}
                alt={user?.name || 'User'}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-white font-medium">{user?.name}</h3>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <Link
            href="/traveler/dashboard"
            className="flex items-center space-x-3 text-gray-300 hover:text-white p-2 rounded-md hover:bg-gray-700"
          >
            <FaUser />
            <span>Dashboard</span>
          </Link>
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-gray-300 hover:text-white w-full p-2 rounded-md hover:bg-gray-700"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
} 