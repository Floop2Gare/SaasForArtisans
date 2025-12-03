import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

const SESSION_COOKIE = 'mp_session'

function isProtectedPath(pathname: string) {
  return pathname.startsWith('/app')
}

function verifyToken(token?: string) {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length < 2) return false
  const signature = parts.pop() as string
  const rawPayload = parts.join('.')
  const secret = process.env.AUTH_SECRET || 'dev-secret'
  const expected = createHmac('sha256', secret).update(rawPayload).digest('hex')
  if (expected !== signature) return false
  const [, expires] = rawPayload.split(':')
  if (!expires) return false
  return Number(expires) > Date.now()
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (!verifyToken(token)) {
    const url = new URL('/login', request.url)
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*'],
}
