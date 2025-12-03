import React from 'react'
import { getSessionUser } from '@/lib/auth'
import AppShell from '@/components/AppShell'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser()

  return (
    <AppShell>
      <div className="space-y-2">
        <p className="text-sm text-ink-soft">Connecté en tant que</p>
        <p className="text-lg font-semibold">{user?.fullName ?? 'Utilisateur'}</p>
      </div>
      {children}
    </AppShell>
  )
}
