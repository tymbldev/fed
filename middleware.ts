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

// Unified middleware: API CORS, SEO rewrites, and auth redirects
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const path = pathname;

  // 1) CORS for API routes
  if (path.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }
    return response;
  }

  // 2) SEO-friendly listing URL rewrites
  const lowerPath = path.toLowerCase();
  const skipPrefixes = [
    '/_next/',
    '/favicon',
    '/referrals',
    '/companies',
    '/search-referrals',
    '/login',
    '/register',
    '/forgot-password',
    '/profile',
    '/my-referrals',
    '/post-referral',
    '/refer'
  ];

  const isRootLevel = lowerPath.split('/').filter(Boolean).length === 1;
  const isSkippable = skipPrefixes.some(p => lowerPath === p || lowerPath.startsWith(p));
  if (isRootLevel && !isSkippable && lowerPath !== '/') {
    const slug = lowerPath.slice(1);
    const matchesKeywordJobs = slug.endsWith('-jobs');
    const matchesJobsIn = slug.startsWith('jobs-in-');
    const matchesKeywordJobsIn = slug.includes('-jobs-in-');

    if (matchesKeywordJobs || matchesJobsIn || matchesKeywordJobsIn) {
      const url = request.nextUrl.clone();
      url.pathname = '/referrals';
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set('seo', slug);
      url.search = `?${newParams.toString()}`;
      return NextResponse.rewrite(url);
    }
  }

  // 3) Auth redirects for protected/public routes
  const token = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!token;
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicRoute && isAuthenticated) {
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
    '/forgot-password',
    // Catch root-level slugs for SEO (exclude _next and static assets)
    '/((?!_next|.*\..*$).*)'
  ],
};


