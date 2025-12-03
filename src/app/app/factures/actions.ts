'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { computeTotals, LineInput } from '@/lib/calculations'
import { getCurrentUserAndCompany } from '@/lib/current'
import { nextInvoiceNumber } from '@/lib/numbers'
import Decimal from 'decimal.js'

const lineSchema = z.object({
  description: z.string().trim().min(1),
  quantity: z.number().nonnegative(),
  unitPriceHT: z.number().nonnegative(),
  tvaRate: z.number().nonnegative(),
})

const invoiceSchema = z.object({
  clientId: z.string().min(1),
  quoteId: z.string().optional().nullable(),
  lines: z.array(lineSchema).min(1, 'Ajoutez au moins une ligne'),
})

export async function createInvoiceAction(prevState: { error?: string; success?: string }, formData: FormData) {
  try {
    const rawLines = formData.get('lines') as string
    const parsedLines = rawLines ? (JSON.parse(rawLines) as LineInput[]) : []
    const parsed = invoiceSchema.parse({
      clientId: formData.get('clientId'),
      quoteId: formData.get('quoteId') || null,
      lines: parsedLines,
    })

    const { company } = await getCurrentUserAndCompany()
    const number = await nextInvoiceNumber(company.id)
    const totals = computeTotals(parsed.lines)

    await prisma.invoice.create({
      data: {
        companyId: company.id,
        clientId: parsed.clientId,
        quoteId: parsed.quoteId || null,
        number,
        status: 'ENVOYEE',
        totalHT: totals.totalHT,
        totalTVA: totals.totalTVA,
        totalTTC: totals.totalTTC,
        lines: {
          create: totals.computed.map((line) => ({
            description: line.description,
            quantity: new Decimal(line.quantity),
            unitPriceHT: new Decimal(line.unitPriceHT),
            tvaRate: new Decimal(line.tvaRate),
            lineTotalHT: line.lineTotalHT,
            lineTotalTVA: line.lineTotalTVA,
            lineTotalTTC: line.lineTotalTTC,
          })),
        },
      },
    })

    revalidatePath('/app/factures')
    return { success: 'Facture créée.' }
  } catch (error: any) {
    const message = error?.issues?.[0]?.message || 'Impossible d’enregistrer la facture.'
    return { error: message }
  }
}

export async function markInvoicePaidAction(invoiceId: string) {
  const { company } = await getCurrentUserAndCompany()
  await prisma.invoice.update({ where: { id: invoiceId, companyId: company.id }, data: { status: 'PAYEE' } })
  revalidatePath('/app/factures')
}
