"use server"

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/password'
import { createSession } from '@/lib/auth'

// Action serveur responsable de la connexion d'un utilisateur.
// Directive placée en tête de fichier pour une utilisation sûre depuis un composant client.
export async function handleLogin(prevState: { error?: string }, formData: FormData) {
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
