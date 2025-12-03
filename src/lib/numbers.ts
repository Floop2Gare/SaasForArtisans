import { prisma } from './prisma'

function formatNumber(prefix: string, count: number, year: number) {
  const padded = String(count).padStart(4, '0')
  return `${prefix}-${year}-${padded}`
}

export async function nextQuoteNumber(companyId: string) {
  const year = new Date().getFullYear()
  const count = await prisma.quote.count({
    where: {
      companyId,
      date: {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
        lte: new Date(`${year}-12-31T23:59:59.999Z`),
      },
    },
  })
  return formatNumber('DEV', count + 1, year)
}

export async function nextInvoiceNumber(companyId: string) {
  const year = new Date().getFullYear()
  const count = await prisma.invoice.count({
    where: {
      companyId,
      date: {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
        lte: new Date(`${year}-12-31T23:59:59.999Z`),
      },
    },
  })
  return formatNumber('FAC', count + 1, year)
}
