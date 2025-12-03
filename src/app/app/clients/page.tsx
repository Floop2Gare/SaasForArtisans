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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white border border-border rounded-2xl p-5 shadow-soft">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Mes clients</h1>
          <p className="text-base text-ink-soft">Contacts toujours à portée de main.</p>
        </div>
        <PrimaryButton className="w-full md:w-auto text-lg">Nouveau client</PrimaryButton>
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
                <p className="text-base text-ink-soft">{client.phone || '—'}</p>
                <p className="text-base text-ink-soft">{client.email || '—'}</p>
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

      <div className="bg-white border border-border rounded-2xl p-5 shadow-soft space-y-4">
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
