import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/auth'

export async function POST() {
  clearSession()
  const res = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
  res.cookies.delete('mp_session')
  return res
}
