import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { prisma } from '@/lib/prisma'

async function buildQuotePdf(id: string) {
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      company: true,
      client: true,
      lines: true,
    },
  })

  if (!quote) return null

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595.28, 841.89]) // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const drawText = (text: string, x: number, y: number, size = 12, bold = false) => {
    page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0), font: font })
  }

  drawText(quote.company.name, 40, 800, 16)
  if (quote.company.address) drawText(String(quote.company.address), 40, 780)
  if (quote.company.phone) drawText(`Téléphone : ${quote.company.phone}`, 40, 760)

  drawText('Devis', 450, 800, 18)
  drawText(`N° ${quote.number}`, 450, 780, 12)
  drawText(`Date : ${quote.date.toLocaleDateString('fr-FR')}`, 450, 760, 12)

  drawText('Client', 40, 720, 14)
  drawText(quote.client.name, 40, 700)
  if (quote.client.address) drawText(quote.client.address, 40, 684)
  if (quote.client.phone) drawText(`Tél : ${quote.client.phone}`, 40, 668)

  let y = 640
  drawText('Description', 40, y, 12)
  drawText('Qté', 300, y, 12)
  drawText('PU HT', 360, y, 12)
  drawText('Total HT', 440, y, 12)
  y -= 20

  quote.lines.forEach((line) => {
    drawText(line.description, 40, y)
    drawText(line.quantity.toString(), 300, y)
    drawText(`${line.unitPriceHT.toString()} €`, 360, y)
    drawText(`${line.lineTotalHT.toString()} €`, 440, y)
    y -= 18
  })

  y -= 10
  drawText(`Total HT : ${quote.totalHT.toString()} €`, 360, y)
  y -= 16
  drawText(`TVA : ${quote.totalTVA.toString()} €`, 360, y)
  y -= 16
  drawText(`Total TTC : ${quote.totalTTC.toString()} €`, 360, y)

  drawText('Merci pour votre confiance.', 40, y - 30, 12)

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const pdf = await buildQuotePdf(params.id)
  if (!pdf) return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 })

  return new NextResponse(Buffer.from(pdf), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="devis.pdf"',
    },
  })
}
