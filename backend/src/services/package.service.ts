import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class PackageService {
  static async getAllPackages(filters?: { category?: string; isActive?: boolean }) {
    return prisma.package.findMany({
      where: {
        ...(filters?.category ? { category: filters.category } : {}),
        ...(filters?.isActive !== undefined ? { isActive: filters.isActive } : {}),
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
  }

  static async getPackageById(id: string) {
    return prisma.package.findUnique({ where: { id } })
  }

  static async createPackage(data: {
    name: string
    destination: string
    country: string
    duration: string
    price: number
    originalPrice?: number
    currency?: string
    category?: string
    description: string
    highlights?: string[]
    included?: string[]
    itinerary?: object[]
    features?: string[]
    images?: string[]
    coverImage?: string
    isActive?: boolean
    sortOrder?: number
  }) {
    return prisma.package.create({
      data: {
        name: data.name,
        destination: data.destination,
        country: data.country,
        duration: data.duration,
        price: data.price,
        originalPrice: data.originalPrice ?? null,
        currency: data.currency ?? 'SAR',
        category: data.category ?? 'best',
        description: data.description,
        highlights: data.highlights ?? [],
        included: data.included ?? [],
        itinerary: data.itinerary ?? [],
        features: data.features ?? [],
        images: data.images ?? [],
        coverImage: data.coverImage ?? '',
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
    })
  }

  static async updatePackage(id: string, data: any) {
    return prisma.package.update({ where: { id }, data })
  }

  static async deletePackage(id: string) {
    return prisma.package.delete({ where: { id } })
  }
}
