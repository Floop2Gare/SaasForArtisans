import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/password'
import { createSession } from '@/lib/auth'
import Label from '@/components/form/Label'
import TextInput from '@/components/form/TextInput'
import PrimaryButton from '@/components/ui/PrimaryButton'
import { useFormState } from 'react-dom'

async function handleLogin(prevState: { error?: string }, formData: FormData) {
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

function LoginForm() {
  'use client'
  const [state, formAction] = useFormState(handleLogin, { error: '' })

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <TextInput id="email" name="email" type="email" placeholder="vous@chantier.fr" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <TextInput id="password" name="password" type="password" placeholder="••••••••" required />
        </div>
      </div>
      {state.error && <p className="text-base text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">{state.error}</p>}
      <PrimaryButton type="submit" className="w-full text-lg">
        Se connecter
      </PrimaryButton>
      <p className="text-base text-ink-soft text-center">Vos données restent privées. Aucun paramétrage compliqué.</p>
      <p className="text-base text-center text-ink-soft">
        Pas encore de compte ?{' '}
        <Link href="/register" className="text-primary font-semibold">
          Créer un compte
        </Link>
      </p>
    </form>
  )
}

export default function LoginPage() {
  return <LoginForm />
}
