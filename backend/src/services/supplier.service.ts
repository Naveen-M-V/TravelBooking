import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class SupplierService {
  /** Get all active suppliers */
  static async listAll() {
    return prisma.supplier.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })
  }

  /** Get a specific supplier */
  static async getById(id: string) {
    return prisma.supplier.findUnique({ where: { id } })
  }

  /** Create a new supplier */
  static async create(data: {
    name: string
    email: string
    phone?: string
    contactPerson?: string
    website?: string
    notes?: string
  }) {
    // Check for duplicate name and email
    const existing = await prisma.supplier.findFirst({
      where: {
        OR: [{ name: data.name }, { email: data.email }],
      },
    })
    if (existing) {
      throw new Error('A supplier with this name or email already exists')
    }

    return prisma.supplier.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        contactPerson: data.contactPerson || '',
        website: data.website || '',
        notes: data.notes || '',
        isActive: true,
      },
    })
  }

  /** Update an existing supplier */
  static async update(id: string, data: Partial<{
    name: string
    email: string
    phone: string
    contactPerson: string
    website: string
    notes: string
    isActive: boolean
  }>) {
    return prisma.supplier.update({ where: { id }, data })
  }

  /** Soft delete (mark as inactive) */
  static async deactivate(id: string) {
    return prisma.supplier.update({ where: { id }, data: { isActive: false } })
  }

  /** Hard delete */
  static async delete(id: string) {
    return prisma.supplier.delete({ where: { id } })
  }
}
