import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  name: string;
  email: string;
  role: string;
  exp: number;
}

export function middleware(request: NextRequest) {
  // Get the token from the cookies
  const token = request.cookies.get('token')?.value;

  // Check if the request is for admin routes
  if (request.nextUrl.pathname === '/admin' || request.nextUrl.pathname.startsWith('/admin/')) {
    // If no token is found, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Decode the token to check if it's expired
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;

      // If token is expired, redirect to login
      if (decoded.exp && decoded.exp < currentTime) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Check if the user has the admin role
      if (decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // If all checks pass, allow the request to proceed
      return NextResponse.next();
    } catch (error) {
      // If there's any error with the token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Check if the request is for the dashboard
  if (request.nextUrl.pathname === '/dashboard' || request.nextUrl.pathname.startsWith('/dashboard/')) {
    // If no token is found, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Decode the token to check if it's expired
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;

      // If token is expired, redirect to login
      if (decoded.exp && decoded.exp < currentTime) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // If all checks pass, allow the request to proceed
      return NextResponse.next();
    } catch (error) {
      // If there's any error with the token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // For guide dashboard routes
  if (request.nextUrl.pathname.startsWith('/guide-dashboard')) {
    // If no token is found, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Decode the token to check if it's expired
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;

      // If token is expired, redirect to login
      if (decoded.exp && decoded.exp < currentTime) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Check if the user has the guide role
      if (decoded.role !== 'guide') {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // If all checks pass, allow the request to proceed
      return NextResponse.next();
    } catch (error) {
      // If there's any error with the token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // For traveler dashboard routes
  if (request.nextUrl.pathname.startsWith('/traveler/')) {
    // If no token is found, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Decode the token to check if it's expired
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;

      // If token is expired, redirect to login
      if (decoded.exp && decoded.exp < currentTime) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Check if the user has the traveler role
      if (decoded.role !== 'traveler') {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // If all checks pass, allow the request to proceed
      return NextResponse.next();
    } catch (error) {
      // If there's any error with the token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // For all other routes, allow the request to proceed
  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/guide-dashboard/:path*', '/traveler/:path*'],
};
