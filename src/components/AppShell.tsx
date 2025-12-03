'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Route } from 'next'
import { ReactNode } from 'react'
import SecondaryButton from './ui/SecondaryButton'

const navLinks: { href: Route; label: string; icon: string }[] = [
  { href: '/app/dashboard' as Route, label: 'Accueil', icon: '🏠' },
  { href: '/app/clients' as Route, label: 'Clients', icon: '👥' },
  { href: '/app/devis' as Route, label: 'Devis', icon: '🧾' },
  { href: '/app/factures' as Route, label: 'Factures', icon: '💶' },
  { href: '/app/profil' as Route, label: 'Profil', icon: '⚙️' },
]

function currentPageTitle(pathname: string) {
  const match = navLinks.find((link) => pathname.startsWith(link.href))
  return match?.label ?? 'Tableau de bord'
}

function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-white border-r border-border p-6 gap-5">
      <div className="space-y-1">
        <p className="text-primary font-bold text-2xl">MaçonPro</p>
        <p className="text-sm text-ink-soft">Vos devis et factures en clair.</p>
      </div>
      <nav className="flex-1 space-y-1">
        {navLinks.map((link) => {
          const active = pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-xl text-lg font-semibold transition border border-transparent flex items-center gap-3 ${
                active ? 'bg-primary text-white shadow-soft' : 'hover:bg-canvas text-ink hover:border-border'
              }`}
            >
              <span className="text-xl" aria-hidden>
                {link.icon}
              </span>
              <span className="leading-tight">{link.label}</span>
            </Link>
          )
        })}
      </nav>
      <form action="/api/auth/logout" method="post">
        <SecondaryButton type="submit" className="w-full text-lg">
          Se déconnecter
        </SecondaryButton>
      </form>
    </aside>
  )
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border grid grid-cols-5 text-center text-sm shadow-soft">
      {navLinks.map((link) => {
        const active = pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`py-3 font-semibold flex flex-col items-center gap-1 ${active ? 'text-primary' : 'text-ink-soft'}`}
          >
            <span className="text-xl leading-none" aria-hidden>
              {link.icon}
            </span>
            <span className="text-[15px] leading-tight">{link.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex bg-canvas">
      <DesktopNav pathname={pathname} />
      <main className="flex-1 min-h-screen pb-24 lg:pb-10">
        <header className="flex items-center justify-between px-4 lg:px-10 py-4 bg-white border-b border-border sticky top-0 z-20 backdrop-blur">
          <div className="space-y-0.5">
            <p className="text-xs uppercase text-ink-soft tracking-wide">MaçonPro Factures</p>
            <p className="text-xl font-semibold text-ink">{currentPageTitle(pathname)}</p>
            <p className="text-sm text-ink-soft">Tout est regroupé ici pour aller vite.</p>
          </div>
          <form action="/api/auth/logout" method="post" className="hidden lg:block">
            <SecondaryButton type="submit">Déconnexion</SecondaryButton>
          </form>
        </header>
        <div className="px-4 lg:px-10 py-6 flex justify-center">
          <div className="w-full max-w-5xl space-y-6">{children}</div>
        </div>
      </main>
      <MobileNav pathname={pathname} />
    </div>
  )
}
