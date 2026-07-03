import { type NextRequest, NextResponse } from 'next/server';

import { AUTH_COOKIES } from '@tungaos/shared/constants';

import { isAppRoute } from '@/constants/navigation';
import {
  AUTH_PATH_PREFIXES,
  ERROR_ROUTES,
  PUBLIC_ROUTES,
} from '@/constants/routes';

const PUBLIC_PATHS = Object.values(PUBLIC_ROUTES);

/**
 * Edge middleware — tenant resolution, auth guards, protected app routes.
 */
export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(AUTH_COOKIES.accessToken)?.value;

  const isAuthRoute = AUTH_PATH_PREFIXES.some((route) => pathname.startsWith(route));
  const isProtectedRoute = isAppRoute(pathname) || pathname.startsWith('/admin') || pathname.startsWith('/portal');
  const isPublicRoute =
    PUBLIC_PATHS.includes(pathname as (typeof PUBLIC_PATHS)[number]) ||
    pathname.startsWith('/api/public');
  const isErrorRoute = Object.values(ERROR_ROUTES).includes(
    pathname as (typeof ERROR_ROUTES)[keyof typeof ERROR_ROUTES],
  );

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/app/dashboard', request.url));
  }

  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();

  if (isPublicRoute || isProtectedRoute || isErrorRoute) {
    response.headers.set('x-tenant-host', request.headers.get('host') ?? '');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
