import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers)

  // Add security headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Add X-Frame-Options header
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')

  // Add X-Content-Type-Options header
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Add X-XSS-Protection header
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Add Referrer-Policy header
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Add Permissions-Policy header
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Remove X-Powered-By header
  response.headers.delete('X-Powered-By')

  return response
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
