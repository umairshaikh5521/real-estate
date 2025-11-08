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
  
  // Get authentication token from cookies
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  const isAuthenticated = !!(accessToken || refreshToken)

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Check if the current path is an auth page
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    
    // Save the original path to redirect back after login
    loginUrl.searchParams.set('from', pathname)
    
    const response = NextResponse.redirect(loginUrl)
    
    // Optional: Clear any stale cookies
    response.cookies.delete('accessToken')
    response.cookies.delete('refreshToken')
    
    return response
  }

  // Redirect to dashboard if accessing auth pages while authenticated
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Allow the request to continue
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
