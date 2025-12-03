import ClientsView from './ClientsView'
import { prisma } from '@/lib/prisma'
import { getCurrentUserAndCompany } from '@/lib/current'

export default async function ClientsPage() {
  const { company } = await getCurrentUserAndCompany()
  const clients = await prisma.client.findMany({
    where: { companyId: company.id, archived: false },
    orderBy: { createdAt: 'desc' },
  })

  return <ClientsView clients={clients} />
}
