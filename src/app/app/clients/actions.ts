'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCurrentUserAndCompany } from '@/lib/current'

const clientSchema = z.object({
  name: z.string().trim().min(1, 'Veuillez remplir le nom du client.'),
  phone: z.string().trim().optional().nullable(),
  email: z.string().trim().email().optional().nullable(),
  address: z.string().trim().optional().nullable(),
})

export async function createClientAction(prevState: { error?: string; success?: string }, formData: FormData) {
  try {
    const parsed = clientSchema.parse({
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      address: formData.get('address'),
    })

    const { company } = await getCurrentUserAndCompany()
    await prisma.client.create({
      data: {
        companyId: company.id,
        name: parsed.name,
        phone: parsed.phone || null,
        email: parsed.email || null,
        address: parsed.address || null,
      },
    })

    revalidatePath('/app/clients')
    return { success: 'Client enregistré.' }
  } catch (error: any) {
    const message = error?.issues?.[0]?.message || 'Impossible d’enregistrer le client.'
    return { error: message }
  }
}

export async function archiveClientAction(clientId: string) {
  const { company } = await getCurrentUserAndCompany()
  await prisma.client.update({
    where: { id: clientId, companyId: company.id },
    data: { archived: true },
  })
  revalidatePath('/app/clients')
}
