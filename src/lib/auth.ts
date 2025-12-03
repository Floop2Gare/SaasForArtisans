import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { createSignedToken, verifySignedToken, SESSION_COOKIE } from './session-token'

export function clearSession() {
  cookies().delete(SESSION_COOKIE)
}

export async function getSessionUser() {
  const cookie = cookies().get(SESSION_COOKIE)
  if (!cookie?.value) return null

  const payload = await verifySignedToken(cookie.value)
  if (!payload) return null

  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  return user
}

export function requireAuthOrRedirect(pathname: string) {
  const isProtected = pathname.startsWith('/app')
  return isProtected
}

export async function createSession(userId: string) {
  const { token, expires } = await createSignedToken(userId)
  const store = cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires,
  })
}
