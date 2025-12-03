import Decimal from 'decimal.js'

export type LineInput = {
  description: string
  quantity: number
  unitPriceHT: number
  tvaRate: number
}

export type LineComputed = LineInput & {
  lineTotalHT: Decimal
  lineTotalTVA: Decimal
  lineTotalTTC: Decimal
}

export function computeLine(line: LineInput): LineComputed {
  const qty = new Decimal(line.quantity || 0)
  const unit = new Decimal(line.unitPriceHT || 0)
  const rate = new Decimal(line.tvaRate || 0)
  const ht = qty.mul(unit)
  const tva = ht.mul(rate).div(100)
  const ttc = ht.add(tva)

  return {
    ...line,
    lineTotalHT: ht,
    lineTotalTVA: tva,
    lineTotalTTC: ttc,
  }
}

export function computeTotals(lines: LineInput[]) {
  const computed = lines.map(computeLine)
  const totalHT = computed.reduce((acc, line) => acc.add(line.lineTotalHT), new Decimal(0))
  const totalTVA = computed.reduce((acc, line) => acc.add(line.lineTotalTVA), new Decimal(0))
  const totalTTC = totalHT.add(totalTVA)

  return { computed, totalHT, totalTVA, totalTTC }
}
