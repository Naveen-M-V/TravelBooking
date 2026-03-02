import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class HeroImageService {
  static async listAll(activeOnly = false) {
    return prisma.heroImage.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
  }

  static async create(data: { url: string; altText?: string; caption?: string; sortOrder?: number; isActive?: boolean }) {
    return prisma.heroImage.create({
      data: {
        url: data.url,
        altText: data.altText ?? '',
        caption: data.caption ?? '',
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
      },
    })
  }

  static async update(id: string, data: any) {
    return prisma.heroImage.update({ where: { id }, data })
  }

  static async delete(id: string) {
    return prisma.heroImage.delete({ where: { id } })
  }

  /** Reorder images given an ordered array of IDs */
  static async reorder(orderedIds: string[]) {
    const updates = orderedIds.map((id, idx) =>
      prisma.heroImage.update({ where: { id }, data: { sortOrder: idx } })
    )
    return Promise.all(updates)
  }
}
