import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { prisma } from '@/lib/prisma'

async function buildInvoicePdf(id: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      company: true,
      client: true,
      lines: true,
      quote: true,
    },
  })

  if (!invoice) return null

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595.28, 841.89])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const drawText = (text: string, x: number, y: number, size = 12) => {
    page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) })
  }

  drawText(invoice.company.name, 40, 800, 16)
  if (invoice.company.address) drawText(String(invoice.company.address), 40, 780)
  if (invoice.company.phone) drawText(`Téléphone : ${invoice.company.phone}`, 40, 760)

  drawText('Facture', 450, 800, 18)
  drawText(`N° ${invoice.number}`, 450, 780, 12)
  drawText(`Date : ${invoice.date.toLocaleDateString('fr-FR')}`, 450, 760, 12)
  if (invoice.quote?.number) drawText(`Suite au devis ${invoice.quote.number}`, 450, 740, 10)

  drawText('Client', 40, 720, 14)
  drawText(invoice.client.name, 40, 700)
  if (invoice.client.address) drawText(invoice.client.address, 40, 684)
  if (invoice.client.phone) drawText(`Tél : ${invoice.client.phone}`, 40, 668)

  let y = 640
  drawText('Description', 40, y, 12)
  drawText('Qté', 300, y, 12)
  drawText('PU HT', 360, y, 12)
  drawText('Total HT', 440, y, 12)
  y -= 20

  invoice.lines.forEach((line) => {
    drawText(line.description, 40, y)
    drawText(line.quantity.toString(), 300, y)
    drawText(`${line.unitPriceHT.toString()} €`, 360, y)
    drawText(`${line.lineTotalHT.toString()} €`, 440, y)
    y -= 18
  })

  y -= 10
  drawText(`Total HT : ${invoice.totalHT.toString()} €`, 360, y)
  y -= 16
  drawText(`TVA : ${invoice.totalTVA.toString()} €`, 360, y)
  y -= 16
  drawText(`Total TTC : ${invoice.totalTTC.toString()} €`, 360, y)

  drawText('Merci pour votre confiance.', 40, y - 30, 12)

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const pdf = await buildInvoicePdf(params.id)
  if (!pdf) return NextResponse.json({ error: 'Facture introuvable' }, { status: 404 })

  return new NextResponse(Buffer.from(pdf), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="facture.pdf"',
    },
  })
}
