'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { computeTotals, LineInput } from '@/lib/calculations'
import { getCurrentUserAndCompany } from '@/lib/current'
import { nextInvoiceNumber, nextQuoteNumber } from '@/lib/numbers'
import Decimal from 'decimal.js'

const lineSchema = z.object({
  description: z.string().trim().min(1),
  quantity: z.number().nonnegative(),
  unitPriceHT: z.number().nonnegative(),
  tvaRate: z.number().nonnegative(),
})

const quoteSchema = z.object({
  clientId: z.string().min(1),
  title: z.string().trim().optional().nullable(),
  description: z.string().trim().optional().nullable(),
  workAddress: z.string().trim().optional().nullable(),
  paymentTerms: z.string().trim().optional().nullable(),
  status: z.enum(['BROUILLON', 'ENVOYE', 'ACCEPTE', 'REFUSE']).default('BROUILLON'),
  lines: z.array(lineSchema).min(1, 'Ajoutez au moins une ligne'),
})

export async function createQuoteAction(prevState: { error?: string; success?: string }, formData: FormData) {
  try {
    const rawLines = formData.get('lines') as string
    const parsedLines = rawLines ? (JSON.parse(rawLines) as LineInput[]) : []

    const parsed = quoteSchema.parse({
      clientId: formData.get('clientId'),
      title: formData.get('title') || null,
      description: formData.get('description') || null,
      workAddress: formData.get('workAddress') || null,
      paymentTerms: formData.get('paymentTerms') || null,
      status: formData.get('status') || 'BROUILLON',
      lines: parsedLines,
    })

    const { company } = await getCurrentUserAndCompany()
    const number = await nextQuoteNumber(company.id)
    const totals = computeTotals(parsed.lines)

    await prisma.quote.create({
      data: {
        companyId: company.id,
        clientId: parsed.clientId,
        status: parsed.status,
        number,
        title: parsed.title,
        description: parsed.description,
        workAddress: parsed.workAddress,
        paymentTerms: parsed.paymentTerms,
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

    revalidatePath('/app/devis')
    return { success: 'Devis enregistré.' }
  } catch (error: any) {
    const message = error?.issues?.[0]?.message || 'Impossible d’enregistrer le devis.'
    return { error: message }
  }
}

export async function transformQuoteToInvoiceAction(quoteId: string) {
  const { company } = await getCurrentUserAndCompany()
  const quote = await prisma.quote.findFirst({
    where: { id: quoteId, companyId: company.id },
    include: { lines: true },
  })
  if (!quote) throw new Error('Devis introuvable')

  const number = await nextInvoiceNumber(company.id)
  await prisma.invoice.create({
    data: {
      companyId: company.id,
      clientId: quote.clientId,
      quoteId: quote.id,
      status: 'ENVOYEE',
      number,
      date: new Date(),
      totalHT: quote.totalHT,
      totalTVA: quote.totalTVA,
      totalTTC: quote.totalTTC,
      lines: {
        create: quote.lines.map((line) => ({
          description: line.description,
          quantity: line.quantity,
          unitPriceHT: line.unitPriceHT,
          tvaRate: line.tvaRate,
          lineTotalHT: line.lineTotalHT,
          lineTotalTVA: line.lineTotalTVA,
          lineTotalTTC: line.lineTotalTTC,
        })),
      },
    },
  })

  await prisma.quote.update({ where: { id: quote.id }, data: { status: 'ACCEPTE' } })
  revalidatePath('/app/devis')
  revalidatePath('/app/factures')
}
