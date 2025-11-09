/**
 * Next.js Middleware - Server-Side Route Protection
 * Runs at the edge before pages are served
 * Provides the first layer of authentication protection
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/leads", "/bookings", "/agents", "/projects"];
const authRoutes = ["/login", "/signup"];

const isRouteMatch = (pathname: string, route: string) => {
  if (pathname === route) return true;
  return pathname.startsWith(`${route}/`);
};

const getRedirectPath = (request: NextRequest) => {
  const search = request.nextUrl.search;
  return `${request.nextUrl.pathname}${search}`;
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuthenticated = Boolean(accessToken || refreshToken);

  const isProtectedRoute = protectedRoutes.some((route) =>
    isRouteMatch(pathname, route)
  );
  const isAuthRoute = authRoutes.some((route) => isRouteMatch(pathname, route));

  // Redirect unauthenticated users who try to access protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", getRedirectPath(request));
    return NextResponse.redirect(loginUrl);
  }

  // Prevent authenticated users from accessing login/signup pages
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
