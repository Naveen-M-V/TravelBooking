import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class FlightMarkupService {
  /** Get the currently active markup rule (returns null if none set) */
  static async getActive() {
    return prisma.flightMarkup.findFirst({ where: { isActive: true }, orderBy: { updatedAt: 'desc' } })
  }

  /** List all markup rules */
  static async listAll() {
    return prisma.flightMarkup.findMany({ orderBy: { createdAt: 'desc' } })
  }

  /** Create a new markup rule (optionally deactivate all others first) */
  static async create(data: {
    name?: string
    markupType: 'PERCENT' | 'FIXED'
    markupValue: number
    currency?: string
    notes?: string
    isActive?: boolean
  }) {
    if (data.isActive) {
      // Only one active rule at a time
      await prisma.flightMarkup.updateMany({ data: { isActive: false } })
    }
    return prisma.flightMarkup.create({ data: { ...data } })
  }

  /** Update an existing markup rule */
  static async update(id: string, data: Partial<{
    name: string
    markupType: string
    markupValue: number
    currency: string
    notes: string
    isActive: boolean
  }>) {
    if (data.isActive) {
      await prisma.flightMarkup.updateMany({ where: { id: { not: id } }, data: { isActive: false } })
    }
    return prisma.flightMarkup.update({ where: { id }, data })
  }

  /** Activate a specific rule (deactivates all others) */
  static async activate(id: string) {
    await prisma.flightMarkup.updateMany({ data: { isActive: false } })
    return prisma.flightMarkup.update({ where: { id }, data: { isActive: true } })
  }

  /** Delete a markup rule */
  static async delete(id: string) {
    return prisma.flightMarkup.delete({ where: { id } })
  }

  /**
   * Apply the active markup to a price.
   * Returns the marked-up price (original + profit).
   */
  static async applyMarkup(originalPrice: number): Promise<{
    originalPrice: number
    markupAmount: number
    finalPrice: number
    markupType: string
    markupValue: number
  }> {
    const markup = await this.getActive()
    if (!markup) {
      return { originalPrice, markupAmount: 0, finalPrice: originalPrice, markupType: 'PERCENT', markupValue: 0 }
    }

    const value = Number(markup.markupValue)
    let markupAmount = 0

    if (markup.markupType === 'PERCENT') {
      markupAmount = (originalPrice * value) / 100
    } else {
      markupAmount = value
    }

    return {
      originalPrice,
      markupAmount: Math.round(markupAmount * 100) / 100,
      finalPrice: Math.round((originalPrice + markupAmount) * 100) / 100,
      markupType: markup.markupType,
      markupValue: value,
    }
  }

  /**
   * Walk a flight search/pricing response and mark up all price fields in place.
   * Works on the Almosafer polling response structure.
   */
  static async applyMarkupToResults(results: any): Promise<any> {
    const markup = await this.getActive()
    if (!markup || Number(markup.markupValue) === 0) return results

    const value = Number(markup.markupValue)
    const apply = (price: number) => {
      const extra = markup.markupType === 'PERCENT' ? (price * value) / 100 : value
      return Math.round((price + extra) * 100) / 100
    }

    // Deep-clone to avoid mutating the original
    const patched = JSON.parse(JSON.stringify(results))

    const walkItineraries = (items: any[]) => {
      if (!Array.isArray(items)) return
      for (const item of items) {
        // Almosafer uses `price`, `totalPrice`, `amount`, `fare`, `totalFare`
        for (const key of ['price', 'totalPrice', 'amount', 'fare', 'totalFare', 'totalAmount', 'basePrice', 'baseFare']) {
          if (typeof item[key] === 'number') item[key] = apply(item[key])
          if (item[key] && typeof item[key].amount === 'number') item[key].amount = apply(item[key].amount)
          if (item[key] && typeof item[key].total === 'number') item[key].total = apply(item[key].total)
        }
        // Recurse into nested arrays (legs, segments, fares, fareFamilies)
        for (const nested of ['legs', 'segments', 'fares', 'fareFamilies', 'pricingOptions', 'itineraries']) {
          if (Array.isArray(item[nested])) walkItineraries(item[nested])
        }
      }
    }

    if (Array.isArray(patched.itineraries)) walkItineraries(patched.itineraries)
    if (Array.isArray(patched.data?.itineraries)) walkItineraries(patched.data.itineraries)
    if (Array.isArray(patched.results)) walkItineraries(patched.results)

    // Also patch top-level price summary if present
    for (const key of ['price', 'totalPrice', 'amount', 'totalAmount']) {
      if (typeof patched[key] === 'number') patched[key] = apply(patched[key])
    }

    // Tag so the frontend knows markup was applied
    patched._markupApplied = { type: markup.markupType, value }

    return patched
  }
}
