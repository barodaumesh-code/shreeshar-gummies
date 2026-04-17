import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession, ADMIN_COOKIE_NAME } from '@/lib/admin-auth';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin/** pages, not /api/admin/login or the login page itself
  if (!pathname.startsWith('/admin')) return NextResponse.next();
  if (pathname === '/admin/login') return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!verifyAdminSession(token)) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
