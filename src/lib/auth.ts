import { cookies } from 'next/headers'
import { createHmac, randomBytes } from 'crypto'
import { prisma } from './prisma'

const SESSION_COOKIE = 'mp_session'
const SESSION_TTL = 60 * 60 * 24 * 7 // 7 jours

function getSecret() {
  const secret = process.env.AUTH_SECRET || 'dev-secret'
  return secret
}

function signToken(payload: string) {
  const secret = getSecret()
  return createHmac('sha256', secret).update(payload).digest('hex')
}

export function createSession(userId: string) {
  const expires = Date.now() + SESSION_TTL * 1000
  const nonce = randomBytes(8).toString('hex')
  const rawPayload = `${userId}:${expires}:${nonce}`
  const signature = signToken(rawPayload)
  const token = `${rawPayload}.${signature}`
  const store = cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(expires),
  })
}

export function clearSession() {
  cookies().delete(SESSION_COOKIE)
}

export async function getSessionUser() {
  const cookie = cookies().get(SESSION_COOKIE)
  if (!cookie?.value) return null

  const [userId, expires, nonce, signature] = cookie.value.split(':').flatMap((chunk) =>
    chunk.split('.')
  )
  if (!userId || !expires || !signature) return null

  const rawPayload = `${userId}:${expires}:${nonce}`
  const expected = signToken(rawPayload)
  if (expected !== signature) return null
  if (Number(expires) < Date.now()) return null

  const user = await prisma.user.findUnique({ where: { id: userId } })
  return user
}

export function requireAuthOrRedirect(pathname: string) {
  const isProtected = pathname.startsWith('/app')
  return isProtected
}
