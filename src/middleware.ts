import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add no-cache headers for shop pages to ensure fresh inventory data
  if (request.nextUrl.pathname.startsWith('/shop')) {
    const response = NextResponse.next();

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/shop/:path*',
};
