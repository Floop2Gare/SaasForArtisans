import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Connexion | MaçonPro Factures',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-soft p-8 space-y-4 border border-border">
        <div className="text-center space-y-2">
          <p className="text-primary font-semibold tracking-wide uppercase text-sm">MaçonPro Factures</p>
          <h1 className="text-2xl font-bold">Bienvenue</h1>
          <p className="text-sm text-ink-soft">Gérez vos clients, devis et factures en quelques clics.</p>
        </div>
        {children}
        <div className="text-sm text-center text-ink-soft">
          <Link className="hover:text-primary" href="/login">Connexion</Link>
          <span className="mx-2 text-border">•</span>
          <Link className="hover:text-primary" href="/register">Créer un compte</Link>
        </div>
      </div>
    </div>
  )
}
