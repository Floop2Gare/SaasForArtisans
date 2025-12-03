import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white border border-border rounded-2xl shadow-soft p-8 space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">MaçonPro Factures</p>
        <h1 className="text-2xl font-bold text-ink">Page introuvable</h1>
        <p className="text-base text-ink-soft">
          Pas de panique : utilisez les boutons ci-dessous pour revenir à l&apos;application ou vous reconnecter.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/app/dashboard"
            className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-primary text-white font-semibold shadow-soft hover:shadow-md transition"
          >
            Aller au tableau de bord
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-4 py-3 rounded-xl border border-primary text-primary font-semibold hover:bg-primary/5 transition"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  )
}
