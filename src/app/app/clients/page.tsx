import { useFormState } from 'react-dom'
import Card from '@/components/ui/Card'
import PrimaryButton from '@/components/ui/PrimaryButton'
import Label from '@/components/form/Label'
import TextInput from '@/components/form/TextInput'
import { prisma } from '@/lib/prisma'
import { getCurrentUserAndCompany } from '@/lib/current'
import { archiveClientAction, createClientAction } from './actions'

function ClientsView({ clients }: { clients: { id: string; name: string; phone: string | null; email: string | null; address: string | null }[] }) {
  'use client'
  const [state, formAction] = useFormState(createClientAction, { error: undefined, success: undefined })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 bg-white border border-border rounded-2xl p-5 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Mes clients</h1>
            <p className="text-base text-ink-soft">Contacts toujours à portée de main.</p>
          </div>
          <a href="#nouveau-client" className="w-full md:w-auto">
            <PrimaryButton className="w-full md:w-auto text-lg">Nouveau client</PrimaryButton>
          </a>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="bg-canvas rounded-xl border border-border px-4 py-3 text-base text-ink flex items-center gap-3">
            <span className="text-xl" aria-hidden>
              📞
            </span>
            <p>Ajoutez le téléphone pour rappeler en 1 clic.</p>
          </div>
          <div className="bg-canvas rounded-xl border border-border px-4 py-3 text-base text-ink flex items-center gap-3">
            <span className="text-xl" aria-hidden>
              🏠
            </span>
            <p>Notez une adresse ou une ville pour vous repérer.</p>
          </div>
          <div className="bg-canvas rounded-xl border border-border px-4 py-3 text-base text-ink flex items-center gap-3 md:col-span-1">
            <span className="text-xl" aria-hidden>
              ⭐
            </span>
            <p>Tout est sauvegardé automatiquement.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Liste</h2>
        <div className="hidden md:block bg-white border border-border rounded-2xl shadow-soft overflow-hidden">
          <table className="min-w-full text-left">
            <thead className="bg-canvas text-ink-soft text-sm">
              <tr>
                <th className="px-5 py-3 font-semibold">Nom</th>
                <th className="px-5 py-3 font-semibold">Téléphone</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-t border-border">
                  <td className="px-5 py-4 font-semibold text-ink">{client.name}</td>
                  <td className="px-5 py-4 text-ink-soft">{client.phone || '—'}</td>
                  <td className="px-5 py-4 text-ink-soft">{client.email || '—'}</td>
                  <td className="px-5 py-4">
                    <form action={async () => archiveClientAction(client.id)}>
                      <button className="text-primary font-semibold underline underline-offset-2" type="submit">
                        Archiver
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3">
          {clients.map((client) => (
            <Card key={client.id}>
              <div className="flex flex-col gap-2">
                <p className="text-xl font-bold text-ink">{client.name}</p>
                <div className="flex flex-wrap gap-2 text-base text-ink-soft">
                  <span className="inline-flex items-center gap-1 bg-canvas px-3 py-1 rounded-full border border-border">
                    📞 {client.phone || '—'}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-canvas px-3 py-1 rounded-full border border-border">
                    ✉️ {client.email || '—'}
                  </span>
                </div>
                <form action={async () => archiveClientAction(client.id)}>
                  <button className="self-start text-primary font-semibold underline underline-offset-2" type="submit">
                    Archiver
                  </button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div id="nouveau-client" className="bg-white border border-border rounded-2xl p-5 shadow-soft space-y-4">
        <h2 className="text-xl font-semibold">Nouveau client</h2>
        {state.error && <p className="text-red-700 bg-red-50 border border-red-100 rounded-xl p-3 text-base">{state.error}</p>}
        {state.success && <p className="text-green-700 bg-green-50 border border-green-100 rounded-xl p-3 text-base">{state.success}</p>}
        <form action={formAction} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Nom du client *</Label>
              <TextInput id="name" name="name" placeholder="Ex : Mme Martin - rénovation salon" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <TextInput id="phone" name="phone" placeholder="06 00 00 00 00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <TextInput id="email" name="email" type="email" placeholder="client@mail.fr" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Adresse</Label>
              <TextInput id="address" name="address" placeholder="12 rue des Pins, 33000 Bordeaux" />
            </div>
          </div>
          <PrimaryButton type="submit" className="w-full md:w-auto text-lg">
            Enregistrer le client
          </PrimaryButton>
        </form>
      </div>
    </div>
  )
}

export default async function ClientsPage() {
  const { company } = await getCurrentUserAndCompany()
  const clients = await prisma.client.findMany({
    where: { companyId: company.id, archived: false },
    orderBy: { createdAt: 'desc' },
  })

  return <ClientsView clients={clients} />
}
