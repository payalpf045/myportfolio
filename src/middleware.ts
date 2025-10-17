import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_COOKIE_NAME = 'portfolio-auth';

export function middleware(request: NextRequest) {
  // Check if the user is trying to access the admin page
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check if the auth cookie is present
    const isAuthenticated = request.cookies.get(AUTH_COOKIE_NAME)?.value === 'true';

    if (!isAuthenticated) {
      // If not authenticated, redirect to the login page
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect_to', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Allow the request to continue
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
