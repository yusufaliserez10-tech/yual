import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_WHITELIST = ['admin@yual.com']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    const email = request.cookies.get('admin_email')?.value

    if (!email || !ADMIN_WHITELIST.includes(email)) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
