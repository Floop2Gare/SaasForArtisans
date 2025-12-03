"use server"

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'
import { createSession } from '@/lib/auth'

// Action serveur d'inscription : création de l'utilisateur et de sa société
// puis redirection vers le tableau de bord. Séparée pour faciliter l'usage
// depuis un composant client dédié.
// Directive placée en tête de fichier pour une utilisation sûre depuis un composant client.
export async function handleRegister(prevState: { error?: string }, formData: FormData) {
  const fullName = String(formData.get('fullName') || '').trim()
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const password = String(formData.get('password') || '')
  const companyName = String(formData.get('companyName') || '').trim()

  if (!fullName || !email || !password || !companyName) {
    return { error: 'Merci de remplir tous les champs.' }
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: 'Un compte existe déjà avec cet email.' }
  }

  const hashed = await hashPassword(password)
  const company = await prisma.company.create({ data: { name: companyName } })
  const user = await prisma.user.create({
    data: { email, fullName, password: hashed, company: { connect: { id: company.id } } },
  })

  await createSession(user.id)
  redirect('/app/dashboard')
}
