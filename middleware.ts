import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, verifySignedToken } from './src/lib/session-token'

function isProtectedPath(pathname: string) {
  return pathname.startsWith('/app')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value
  const isValid = await verifySignedToken(token)
  if (!isValid) {
    const url = new URL('/login', request.url)
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*'],
}
