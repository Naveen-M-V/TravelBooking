import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class PackageService {
  static async getAllPackages(
    filters?: { category?: string; isActive?: boolean },
    includeSupplierPrivate = false
  ) {
    return prisma.package.findMany({
      where: {
        ...(filters?.category ? { category: filters.category } : {}),
        ...(filters?.isActive !== undefined ? { isActive: filters.isActive } : {}),
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        name: true,
        destination: true,
        country: true,
        duration: true,
        price: true,
        originalPrice: true,
        currency: true,
        category: true,
        description: true,
        highlights: true,
        included: true,
        excluded: true,
        bookingConditions: true,
        itinerary: true,
        features: true,
        halalFacilities: true,
        images: true,
        coverImage: true,
        isActive: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
        ...(includeSupplierPrivate
          ? {
              supplierName: true,
              supplierEmail: true,
              supplierId: true,
              supplier: { select: { id: true, name: true } },
            }
          : {}),
      } as any,
    })
  }

  static async getPackageById(id: string, includeSupplierPrivate = false) {
    return prisma.package.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        destination: true,
        country: true,
        duration: true,
        price: true,
        originalPrice: true,
        currency: true,
        category: true,
        description: true,
        highlights: true,
        included: true,
        excluded: true,
        bookingConditions: true,
        itinerary: true,
        features: true,
        halalFacilities: true,
        images: true,
        coverImage: true,
        isActive: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
        ...(includeSupplierPrivate
          ? {
              supplierName: true,
              supplierEmail: true,
              supplierId: true,
              supplier: { select: { id: true, name: true } },
            }
          : {}),
      } as any,
    })
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
    excluded?: string[]
    bookingConditions?: string[]
    itinerary?: object[]
    features?: string[]
    halalFacilities?: string[]
    images?: string[]
    coverImage?: string
    supplierName?: string
    supplierEmail?: string
    supplierId?: string
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
        excluded: data.excluded ?? [],
        bookingConditions: data.bookingConditions ?? [],
        supplierName: data.supplierName?.trim() || null,
        supplierEmail: data.supplierEmail?.trim() || null,
        supplierId: data.supplierId ?? null,
        included: data.included ?? [],
        itinerary: data.itinerary ?? [],
        features: data.features ?? [],
        halalFacilities: data.halalFacilities ?? [],
        images: data.images ?? [],
        coverImage: data.coverImage ?? '',
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      } as any,
    })
  }

  static async updatePackage(id: string, data: any) {
    const normalized = {
      ...data,
      ...(Object.prototype.hasOwnProperty.call(data, 'supplierName')
        ? { supplierName: data.supplierName?.trim() || null }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(data, 'supplierEmail')
        ? { supplierEmail: data.supplierEmail?.trim() || null }
        : {}),
    }

    return prisma.package.update({
      where: { id },
      data: normalized,
    })
  }

  static async deletePackage(id: string) {
    return prisma.package.delete({ where: { id } })
  }
}
