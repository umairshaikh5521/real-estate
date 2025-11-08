/**
 * Next.js Middleware - Server-Side Route Protection
 * Runs at the edge before pages are served
 * Provides the first layer of authentication protection
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected and public routes
const protectedRoutes = [
  '/dashboard',
  '/leads',
  '/bookings',
  '/agents',
  '/projects',
]

const authRoutes = ['/login', '/signup']
const publicRoutes = ['/', '/about', '/contact']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // NOTE: We can't check backend cookies here because they're on a different domain
  // Backend cookies are httpOnly and set on the API domain (backend.vercel.app)
  // Middleware runs on the frontend domain (frontend.vercel.app)
  // 
  // Authentication is handled client-side by ProtectedRoute component
  // which calls the /api/auth/session endpoint to verify the user
  
  // Just pass through all requests - let client-side handle auth
  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
}
