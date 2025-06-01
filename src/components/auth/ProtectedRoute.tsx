'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { getCookie } from 'cookies-next';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
  role: string;
  name: string;
}

export default function ProtectedRoute({ children, allowedRoles = ['traveler'] }: ProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = getCookie('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // Validate token format before decoding
        if (typeof token !== 'string' || token.split('.').length !== 3) {
          console.warn('Invalid token format, redirecting to login');
          router.push('/login');
          return;
        }
        
        // Check token expiration
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 < Date.now()) {
          router.push('/login');
          return;
        }
        
        if (!allowedRoles.includes(decoded.role)) {
          router.push('/');
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
        return;
      }
    };

    checkAuth();
  }, [router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return <>{children}</>;
} 