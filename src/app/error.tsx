'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  const [message, setMessage] = useState('')

  useEffect(() => {
    setMessage(error?.message || 'Une erreur inattendue est survenue.')
    console.error('Erreur capturée (global):', error)
  }, [error])

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white border border-border rounded-2xl shadow-soft p-8 space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">MaçonPro Factures</p>
        <h1 className="text-2xl font-bold text-ink">Un souci est survenu</h1>
        <p className="text-base text-ink-soft">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-primary text-white font-semibold shadow-soft hover:shadow-md transition"
          >
            Réessayer
          </button>
          <Link
            href="/app/dashboard"
            className="inline-flex items-center justify-center px-4 py-3 rounded-xl border border-primary text-primary font-semibold hover:bg-primary/5 transition"
          >
            Retour tableau de bord
          </Link>
        </div>
      </div>
    </div>
  )
}
