'use client'

import { useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import PrimaryButton from '@/components/ui/PrimaryButton'
import SecondaryButton from '@/components/ui/SecondaryButton'
import Label from '@/components/form/Label'
import TextInput from '@/components/form/TextInput'

const devisList = [
  { numero: 'DV-2024-001', client: 'Chantier Martin', montant: '2 500 € HT', statut: 'Brouillon', date: '12/04/2024' },
  { numero: 'DV-2024-002', client: 'SCI Les Pins', montant: '6 200 € HT', statut: 'Envoyé', date: '20/04/2024' },
  { numero: 'DV-2024-003', client: 'SARL Pierre & Co', montant: '3 850 € HT', statut: 'Accepté', date: '02/05/2024' },
]

const clients = ['Chantier Martin', 'SCI Les Pins', 'SARL Pierre & Co']

export default function DevisPage() {
  const [step, setStep] = useState(1)
  const [selectedClient, setSelectedClient] = useState(clients[0])
  const [quickClient, setQuickClient] = useState({ name: '', phone: '' })
  const [details, setDetails] = useState({ title: '', description: '', address: '' })
  const [lines, setLines] = useState([
    { description: 'Préparation du chantier', qty: 1, price: 500, tva: 10 },
    { description: 'Maçonnerie murs porteurs', qty: 2, price: 850, tva: 20 },
  ])

  const totals = useMemo(() => {
    const totalHT = lines.reduce((acc, l) => acc + l.qty * l.price, 0)
    const totalTVA = lines.reduce((acc, l) => acc + l.qty * l.price * (l.tva / 100), 0)
    const totalTTC = totalHT + totalTVA
    return { totalHT, totalTVA, totalTTC }
  }, [lines])

  return (
    <div className="space-y-6 pb-4">
      <div className="flex flex-col gap-4 bg-white border border-border rounded-2xl p-5 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Mes devis</h1>
            <p className="text-base text-ink-soft">Suivi clair des propositions.</p>
          </div>
          <PrimaryButton className="w-full md:w-auto text-lg">Nouveau devis</PrimaryButton>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="bg-canvas rounded-xl border border-border px-4 py-3 text-base text-ink flex items-center gap-3">
            <span className="text-xl" aria-hidden>
              ✍️
            </span>
            <p>Renseignez un client puis les lignes : rien de plus.</p>
          </div>
          <div className="bg-canvas rounded-xl border border-border px-4 py-3 text-base text-ink flex items-center gap-3">
            <span className="text-xl" aria-hidden>
              ⏱️
            </span>
            <p>Chaque étape prend moins d’une minute.</p>
          </div>
          <div className="bg-canvas rounded-xl border border-border px-4 py-3 text-base text-ink flex items-center gap-3 md:col-span-1">
            <span className="text-xl" aria-hidden>
              ✅
            </span>
            <p>Le total est calculé automatiquement.</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Liste rapide</h2>
        <div className="hidden md:block bg-white border border-border rounded-2xl shadow-soft overflow-hidden">
          <table className="min-w-full text-left">
            <thead className="bg-canvas text-ink-soft text-sm">
              <tr>
                <th className="px-5 py-3 font-semibold">Statut</th>
                <th className="px-5 py-3 font-semibold">Client</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Montant</th>
              </tr>
            </thead>
            <tbody>
              {devisList.map((item) => (
                <tr key={item.numero} className="border-t border-border">
                  <td className="px-5 py-4 font-semibold text-ink">{item.statut}</td>
                  <td className="px-5 py-4 text-ink-soft">{item.client}</td>
                  <td className="px-5 py-4 text-ink-soft">{item.date}</td>
                  <td className="px-5 py-4 text-ink font-bold">{item.montant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3">
          {devisList.map((item) => (
            <Card key={item.numero}>
              <div className="flex flex-col gap-1">
                <p className="text-xl font-bold text-ink">{item.client}</p>
                <p className="text-base text-ink-soft">{item.statut} · {item.date}</p>
                <p className="text-lg font-semibold">{item.montant}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-soft p-5 space-y-5">
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              className={`px-4 py-2 rounded-full text-base font-semibold border flex items-center gap-2 ${
                step === s ? 'bg-primary text-white border-primary shadow-soft' : 'bg-canvas text-ink-soft border-border'
              }`}
              onClick={() => setStep(s)}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-white/40 bg-white/10 text-sm font-bold">
                {s}
              </span>
              {s === 1 && 'Client'}
              {s === 2 && 'Détails du chantier'}
              {s === 3 && 'Lignes du devis'}
            </button>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Client</h3>
            <div className="space-y-2">
              <Label htmlFor="client">Choisir un client</Label>
              <select
                id="client"
                className="w-full border border-border rounded-xl px-4 py-3 bg-white text-base"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
              >
                {clients.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="quick-name">Ou client rapide</Label>
                <TextInput
                  id="quick-name"
                  placeholder="Nom du client"
                  value={quickClient.name}
                  onChange={(e) => setQuickClient({ ...quickClient, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quick-phone">Téléphone</Label>
                <TextInput
                  id="quick-phone"
                  placeholder="06 00 00 00 00"
                  value={quickClient.phone}
                  onChange={(e) => setQuickClient({ ...quickClient, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <SecondaryButton type="button" onClick={() => setStep(2)}>
                Étape suivante
              </SecondaryButton>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Détails du chantier</h3>
            <div className="space-y-2">
              <Label htmlFor="title">Titre du devis</Label>
              <TextInput
                id="title"
                placeholder="Extension maison - salon"
                value={details.title}
                onChange={(e) => setDetails({ ...details, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description du chantier</Label>
              <textarea
                id="description"
                className="w-full border border-border rounded-xl px-4 py-3 text-base bg-white"
                rows={3}
                placeholder="Travaux prévus, matériaux, délai..."
                value={details.description}
                onChange={(e) => setDetails({ ...details, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse du chantier</Label>
              <TextInput
                id="address"
                placeholder="12 rue des Pins, Bordeaux"
                value={details.address}
                onChange={(e) => setDetails({ ...details, address: e.target.value })}
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <SecondaryButton type="button" onClick={() => setStep(1)}>
                Retour client
              </SecondaryButton>
              <SecondaryButton type="button" onClick={() => setStep(3)}>
                Étape suivante
              </SecondaryButton>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Lignes du devis</h3>
            <div className="space-y-3">
              {lines.map((line, idx) => (
                <div key={idx} className="grid md:grid-cols-5 gap-3 items-start">
                  <div className="md:col-span-2 space-y-2">
                    <Label>Description</Label>
                    <TextInput
                      value={line.description}
                      onChange={(e) => {
                        const copy = [...lines]
                        copy[idx] = { ...copy[idx], description: e.target.value }
                        setLines(copy)
                      }}
                      placeholder="Travaux..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantité</Label>
                    <TextInput
                      type="number"
                      min={0}
                      value={line.qty}
                      onChange={(e) => {
                        const copy = [...lines]
                        copy[idx] = { ...copy[idx], qty: Number(e.target.value) }
                        setLines(copy)
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Prix unitaire HT (€)</Label>
                    <TextInput
                      type="number"
                      min={0}
                      value={line.price}
                      onChange={(e) => {
                        const copy = [...lines]
                        copy[idx] = { ...copy[idx], price: Number(e.target.value) }
                        setLines(copy)
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>TVA (%)</Label>
                    <TextInput
                      type="number"
                      min={0}
                      value={line.tva}
                      onChange={(e) => {
                        const copy = [...lines]
                        copy[idx] = { ...copy[idx], tva: Number(e.target.value) }
                        setLines(copy)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap">
              <SecondaryButton
                type="button"
                onClick={() =>
                  setLines((prev) => [...prev, { description: 'Nouvelle ligne', qty: 1, price: 0, tva: 20 }])
                }
              >
                Ajouter une ligne
              </SecondaryButton>
            </div>
            <div className="grid md:grid-cols-3 gap-3 bg-canvas rounded-2xl p-4 text-lg font-semibold">
              <p>Total HT : {totals.totalHT.toFixed(2)} €</p>
              <p>TVA : {totals.totalTVA.toFixed(2)} €</p>
              <p>Total TTC : {totals.totalTTC.toFixed(2)} €</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <SecondaryButton type="button" onClick={() => setStep(2)}>
                Retour détails
              </SecondaryButton>
              <PrimaryButton type="button" className="text-lg">
                Enregistrer en brouillon
              </PrimaryButton>
              <PrimaryButton type="button" className="bg-primary-muted text-lg">
                Valider le devis
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
