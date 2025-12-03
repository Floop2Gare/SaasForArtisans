import Card from '@/components/ui/Card'
import PrimaryButton from '@/components/ui/PrimaryButton'
import Link from 'next/link'

const metrics = [
  { label: 'Devis en attente de réponse', value: '3', tone: 'text-primary' },
  { label: 'Factures en attente de paiement', value: '2', tone: 'text-orange-600' },
  { label: "Chiffre d'affaires du mois", value: '18 400 €', tone: 'text-ink' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-5 md:p-7 border border-border shadow-soft flex flex-col gap-4 text-center">
        <h1 className="text-2xl font-bold text-ink">Vue rapide</h1>
        <p className="text-base text-ink-soft">Tout ce dont vous avez besoin pour suivre vos chantiers en cours.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {metrics.map((item) => (
            <Card key={item.label}>
              <div className="space-y-2 text-center">
                <p className="text-lg font-semibold text-ink-soft">{item.label}</p>
                <p className={`text-3xl font-bold ${item.tone}`}>{item.value}</p>
              </div>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
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
