import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/password'
import { createSession } from '@/lib/auth'

// Action serveur responsable de la connexion d'un utilisateur.
// Elle reste dans un module distinct pour permettre à la page et au
// formulaire client de rester bien typés et compatibles avec App Router.
export async function handleLogin(prevState: { error?: string }, formData: FormData) {
  'use server'
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const password = String(formData.get('password') || '')

  if (!email || !password) {
    return { error: 'Merci de remplir les deux champs.' }
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return { error: 'Aucun compte trouvé avec cet email.' }
  }

  const ok = await verifyPassword(password, user.password)
  if (!ok) {
    return { error: 'Mot de passe incorrect.' }
  }

  createSession(user.id)
  redirect('/app/dashboard')
}
