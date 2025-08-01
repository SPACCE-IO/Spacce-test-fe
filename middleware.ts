import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/anonymous',
  '/landing-page',
  '/',
  '/_next',
  '/api',
  '/favicon.ico',
]

// Define routes that should redirect to dashboard if authenticated
const authRoutes = [
  '/login',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route) || pathname === route
  )
  
  // Check if the current path is an auth route (login, etc.)
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route) || pathname === route
  )

  // Get the token from cookies
  const token = request.cookies.get('userToken')?.value
  const isAuthenticated = !!token

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 