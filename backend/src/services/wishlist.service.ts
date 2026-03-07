import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class WishlistService {
  static async listMine(userId: string) {
    return (prisma as any).wishlistItem.findMany({
      where: { userId },
      include: {
        package: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  static async add(userId: string, packageId: string) {
    return (prisma as any).wishlistItem.upsert({
      where: {
        userId_packageId: {
          userId,
          packageId,
        },
      },
      update: {},
      create: {
        userId,
        packageId,
      },
      include: {
        package: true,
      },
    })
  }

  static async remove(userId: string, packageId: string) {
    const result = await (prisma as any).wishlistItem.deleteMany({
      where: { userId, packageId },
    })
    return result.count > 0
  }

  static async isInWishlist(userId: string, packageId: string) {
    const item = await (prisma as any).wishlistItem.findUnique({
      where: {
        userId_packageId: {
          userId,
          packageId,
        },
      },
      select: { id: true },
    })
    return !!item
  }
}
