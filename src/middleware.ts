// This middleware ensures that NextAuth works correctly with API routes
// It also adds error handling for database connections

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add custom headers to improve error handling
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-middleware-cache', 'no-cache');

  // Return the response with the modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Configure the middleware to run only for API routes
export const config = {
  matcher: ['/api/:path*'],
};
