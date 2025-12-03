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
    <form action={formAction} className="space-y-6">
      <div className="space-y-4">
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
      <div className="space-y-2 text-center text-base text-ink-soft">
        <p>Vos données restent privées. Aucun paramétrage compliqué.</p>
        <p>
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-primary font-semibold">
            Créer un compte
          </Link>
        </p>
      </div>
      <div className="bg-canvas border border-border rounded-2xl p-4 space-y-2 text-left">
        <p className="font-semibold text-ink">En 3 minutes vous êtes prêt :</p>
        <ul className="list-disc list-inside space-y-1 text-ink-soft text-base">
          <li>Connexion simple avec votre email.</li>
          <li>Vos clients, devis et factures regroupés.</li>
          <li>Interface large et claire sur mobile.</li>
        </ul>
      </div>
    </form>
  )
}

export default function LoginPage() {
  return <LoginForm />
}
