import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected and public routes
const protectedRoutes = [
  '/profile',
  '/my-referrals',
  '/post-referral',
  '/refer'
];

const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password'
];

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /api/register)
  const path = request.nextUrl.pathname;

  // Get the token from the cookies
  const token = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!token;

  // Only apply CORS to API routes
  if (path.startsWith('/api/')) {
    const response = NextResponse.next();

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }

    return response;
  }

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

  // Redirect logic
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to login if trying to access protected route while not authenticated
    // Include the original URL as a redirect parameter
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicRoute && isAuthenticated) {
    // Redirect to profile if trying to access public route while authenticated
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/profile/:path*',
    '/my-referrals/:path*',
    '/post-referral/:path*',
    '/refer/:path*',
    '/login',
    '/register',
    '/forgot-password'
  ],
};