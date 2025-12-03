import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'
import { createSession } from '@/lib/auth'
import Label from '@/components/form/Label'
import TextInput from '@/components/form/TextInput'
import PrimaryButton from '@/components/ui/PrimaryButton'
import { useFormState } from 'react-dom'

async function handleRegister(prevState: { error?: string }, formData: FormData) {
  'use server'
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
  const user = await prisma.user.create({ data: { email, fullName, password: hashed, company: { connect: { id: company.id } } } })

  createSession(user.id)
  redirect('/app/dashboard')
}

function RegisterForm() {
  'use client'
  const [state, formAction] = useFormState(handleRegister, { error: '' })

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nom complet</Label>
          <TextInput id="fullName" name="fullName" placeholder="Jean Dupont" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <TextInput id="email" name="email" type="email" placeholder="vous@chantier.fr" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyName">Nom de l'entreprise</Label>
          <TextInput id="companyName" name="companyName" placeholder="Maçonnerie Dupont" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <TextInput id="password" name="password" type="password" placeholder="••••••••" required />
        </div>
      </div>
      {state.error && <p className="text-base text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">{state.error}</p>}
      <PrimaryButton type="submit" className="w-full text-lg">
        Créer mon compte
      </PrimaryButton>
      <p className="text-base text-center text-ink-soft">
        Déjà inscrit ?{' '}
        <Link href="/login" className="text-primary font-semibold">
          Je me connecte
        </Link>
      </p>
    </form>
  )
}

export default function RegisterPage() {
  return <RegisterForm />
}
