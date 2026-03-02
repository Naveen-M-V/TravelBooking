import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class CouponService {
  static async listAll(filters?: { type?: string; isActive?: boolean }) {
    return prisma.coupon.findMany({
      where: {
        ...(filters?.type ? { type: filters.type } : {}),
        ...(filters?.isActive !== undefined ? { isActive: filters.isActive } : {}),
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  static async getByCode(code: string) {
    return prisma.coupon.findUnique({ where: { code: code.toUpperCase() } })
  }

  static async create(data: {
    code: string
    description?: string
    type?: string
    discountType?: string
    discountValue: number
    minOrderValue?: number
    maxDiscount?: number
    usageLimit?: number
    perUserLimit?: number
    isActive?: boolean
    validFrom?: Date
    validUntil?: Date
  }) {
    return prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        description: data.description ?? '',
        type: data.type ?? 'BOTH',
        discountType: data.discountType ?? 'PERCENT',
        discountValue: data.discountValue,
        minOrderValue: data.minOrderValue ?? null,
        maxDiscount: data.maxDiscount ?? null,
        usageLimit: data.usageLimit ?? null,
        perUserLimit: data.perUserLimit ?? 1,
        isActive: data.isActive ?? true,
        validFrom: data.validFrom ?? new Date(),
        validUntil: data.validUntil ?? null,
      },
    })
  }

  static async update(id: string, data: any) {
    if (data.code) data.code = data.code.toUpperCase()
    return prisma.coupon.update({ where: { id }, data })
  }

  static async delete(id: string) {
    return prisma.coupon.delete({ where: { id } })
  }

  /** Validate a coupon code and calculate the discount amount */
  static async validate(code: string, orderValue: number, type: 'PACKAGE' | 'FLIGHT') {
    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } })

    if (!coupon) return { valid: false, message: 'Coupon not found' }
    if (!coupon.isActive) return { valid: false, message: 'Coupon is inactive' }

    const now = new Date()
    if (coupon.validFrom > now) return { valid: false, message: 'Coupon not yet valid' }
    if (coupon.validUntil && coupon.validUntil < now) return { valid: false, message: 'Coupon has expired' }
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, message: 'Coupon usage limit reached' }
    }
    if (coupon.type !== 'BOTH' && coupon.type !== type) {
      return { valid: false, message: `Coupon is only valid for ${coupon.type.toLowerCase()} bookings` }
    }
    if (coupon.minOrderValue && orderValue < Number(coupon.minOrderValue)) {
      return { valid: false, message: `Minimum order value is ${coupon.minOrderValue}` }
    }

    let discount = 0
    if (coupon.discountType === 'PERCENT') {
      discount = (orderValue * Number(coupon.discountValue)) / 100
      if (coupon.maxDiscount) discount = Math.min(discount, Number(coupon.maxDiscount))
    } else {
      discount = Number(coupon.discountValue)
    }

    return {
      valid: true,
      coupon,
      discount: Math.min(discount, orderValue),
      finalAmount: orderValue - Math.min(discount, orderValue),
    }
  }

  /** Increment the usage counter after a successful booking */
  static async incrementUsage(code: string) {
    return prisma.coupon.update({
      where: { code: code.toUpperCase() },
      data: { usageCount: { increment: 1 } },
    })
  }
}
