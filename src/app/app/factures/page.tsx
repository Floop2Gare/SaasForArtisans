'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import PrimaryButton from '@/components/ui/PrimaryButton'
import SecondaryButton from '@/components/ui/SecondaryButton'
import Label from '@/components/form/Label'
import TextInput from '@/components/form/TextInput'

const factures = [
  { numero: 'FA-2024-010', client: 'Chantier Martin', montant: '3 200 € TTC', statut: 'En attente', date: '05/05/2024' },
  { numero: 'FA-2024-011', client: 'SCI Les Pins', montant: '7 440 € TTC', statut: 'Payée', date: '18/05/2024' },
]

const devisList = [
  { numero: 'DV-2024-001', client: 'Chantier Martin', montant: '2 500 € HT' },
  { numero: 'DV-2024-002', client: 'SCI Les Pins', montant: '6 200 € HT' },
  { numero: 'DV-2024-003', client: 'SARL Pierre & Co', montant: '3 850 € HT' },
]

export default function FacturesPage() {
  const [fromDevis, setFromDevis] = useState(false)

  return (
    <div className="space-y-6 pb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white border border-border rounded-2xl p-5 shadow-soft">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Mes factures</h1>
          <p className="text-base text-ink-soft">Encaissez en toute simplicité.</p>
        </div>
        <PrimaryButton className="w-full md:w-auto text-lg">Nouvelle facture</PrimaryButton>
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
              {factures.map((item) => (
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
          {factures.map((item) => (
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

      <div className="bg-white border border-border rounded-2xl shadow-soft p-5 space-y-4">
        <div className="flex flex-wrap gap-3">
          <SecondaryButton type="button" onClick={() => setFromDevis(false)} className={!fromDevis ? 'bg-primary text-white border-primary shadow-soft' : ''}>
            Créer une facture simple
          </SecondaryButton>
          <SecondaryButton type="button" onClick={() => setFromDevis(true)} className={fromDevis ? 'bg-primary text-white border-primary shadow-soft' : ''}>
            Depuis un devis
          </SecondaryButton>
        </div>

        {!fromDevis && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="invoice-title">Objet de la facture</Label>
              <TextInput id="invoice-title" placeholder="Facture chantier Les Pins" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoice-client">Client</Label>
              <TextInput id="invoice-client" placeholder="SCI Les Pins" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoice-amount">Montant TTC (€)</Label>
              <TextInput id="invoice-amount" type="number" placeholder="0" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="invoice-notes">Notes</Label>
              <TextInput id="invoice-notes" placeholder="Conditions de paiement, IBAN..." />
            </div>
          </div>
        )}

        {fromDevis && (
          <div className="space-y-3">
            <p className="text-base text-ink-soft">Sélectionnez un devis pour pré-remplir la facture.</p>
            <div className="space-y-2">
              {devisList.map((item) => (
                <label key={item.numero} className="flex items-center gap-3 bg-canvas border border-border rounded-xl p-3">
                  <input type="radio" name="from-quote" className="w-5 h-5" />
                  <div>
                    <p className="font-semibold text-ink">{item.client}</p>
                    <p className="text-sm text-ink-soft">{item.numero} · {item.montant}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <PrimaryButton type="button" className="text-lg">Enregistrer la facture</PrimaryButton>
          <SecondaryButton type="button">Envoyer plus tard</SecondaryButton>
        </div>
      </div>
    </div>
  )
}
