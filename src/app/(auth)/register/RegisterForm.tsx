'use client'

import Link from 'next/link'
import { useFormState } from 'react-dom'
import Label from '@/components/form/Label'
import TextInput from '@/components/form/TextInput'
import PrimaryButton from '@/components/ui/PrimaryButton'
import { handleRegister } from './actions'

type FormState = { error?: string }

export default function RegisterForm() {
  const [state, formAction] = useFormState(handleRegister, { error: '' } as FormState)

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
