import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import RegisterServiceWorker from '../components/RegisterServiceWorker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MaçonPro Factures',
  description: 'Facturation et devis simples pour artisans maçons.',
  manifest: '/manifest.json',
  themeColor: '#0049ac',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-canvas text-ink`}>
        {children}
        <RegisterServiceWorker />
      </body>
    </html>
  )
}
