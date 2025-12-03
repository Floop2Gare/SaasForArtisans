import Card from '@/components/ui/Card'
import PrimaryButton from '@/components/ui/PrimaryButton'
import Link from 'next/link'

const metrics = [
  { label: 'Devis en attente de réponse', value: '3', tone: 'text-primary', icon: '🧾' },
  { label: 'Factures en attente de paiement', value: '2', tone: 'text-orange-600', icon: '💶' },
  { label: "Chiffre d'affaires du mois", value: '18 400 €', tone: 'text-ink', icon: '📈' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-5 md:p-7 border border-border shadow-soft flex flex-col gap-5">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-bold text-ink">Vue rapide</h1>
          <p className="text-base text-ink-soft">Un coup d’œil pour savoir quoi faire aujourd’hui.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {metrics.map((item) => (
            <Card key={item.label}>
              <div className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden>
                  {item.icon}
                </span>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-ink-soft">{item.label}</p>
                  <p className={`text-3xl font-bold ${item.tone}`}>{item.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-canvas border border-border rounded-2xl p-4">
          <div className="text-left space-y-1">
            <p className="text-lg font-semibold text-ink">Créer un devis en quelques clics</p>
            <p className="text-base text-ink-soft">Client, détails, montant : vous êtes guidé étape par étape.</p>
          </div>
          <Link href="/app/devis" className="w-full md:w-auto">
            <PrimaryButton className="w-full text-lg px-8">Créer un nouveau devis</PrimaryButton>
          </Link>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Mes devis">
          <p className="text-base">Créez un devis clair, envoyez-le par email ou WhatsApp.</p>
        </Card>
        <Card title="Mes factures">
          <p className="text-base">Suivez vos factures et les paiements sans complication.</p>
        </Card>
        <Card title="Mes clients">
          <p className="text-base">Retrouvez facilement les coordonnées de vos clients.</p>
        </Card>
      </div>
    </div>
  )
}
