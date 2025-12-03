const SESSION_COOKIE = 'mp_session'
const SESSION_TTL = 60 * 60 * 24 * 7 // 7 jours

const encoder = new TextEncoder()
const secret = process.env.AUTH_SECRET || 'dev-secret'

let cachedKey: Promise<CryptoKey> | null = null

function bufferToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function getKey() {
  if (!cachedKey) {
    cachedKey = crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
  }
  return cachedKey
}

async function signPayload(payload: string) {
  const key = await getKey()
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  return bufferToHex(signature)
}

export async function createSignedToken(userId: string) {
  const expiresMs = Date.now() + SESSION_TTL * 1000
  const nonce = crypto.randomUUID().replace(/-/g, '')
  const rawPayload = `${userId}:${expiresMs}:${nonce}`
  const signature = await signPayload(rawPayload)
  return { token: `${rawPayload}.${signature}`, expires: new Date(expiresMs) }
}

export async function verifySignedToken(token?: string) {
  if (!token) return null
  const parts = token.split(':').flatMap((chunk) => chunk.split('.'))
  const [userId, expires, nonce, signature] = parts
  if (!userId || !expires || !signature) return null

  const rawPayload = `${userId}:${expires}:${nonce}`
  const expected = await signPayload(rawPayload)
  if (expected !== signature) return null
  if (Number(expires) < Date.now()) return null

  return { userId, expires: Number(expires) }
}

export { SESSION_COOKIE, SESSION_TTL }
