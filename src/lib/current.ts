import { prisma } from './prisma'
import { getSessionUser } from './auth'

export async function getCurrentUserAndCompany() {
  const user = await getSessionUser()
  if (!user) {
    throw new Error('Non authentifié')
  }

  if (user.companyId) {
    const company = await prisma.company.findUnique({ where: { id: user.companyId } })
    if (!company) {
      throw new Error('Entreprise introuvable')
    }
    return { user, company }
  }

  // Fallback : créer une entreprise par défaut pour garder le flux simple
  const company = await prisma.company.create({ data: { name: 'Mon entreprise' } })
  await prisma.user.update({ where: { id: user.id }, data: { companyId: company.id } })
  return { user: { ...user, companyId: company.id }, company }
}
