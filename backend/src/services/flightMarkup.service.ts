import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class FlightMarkupService {
  /** Get the currently active markup (percentage-only, only one active at a time) */
  static async getActive() {
    return prisma.flightMarkup.findFirst({ where: { isActive: true }, orderBy: { updatedAt: 'desc' } })
  }

  /** List all markup rules */
  static async listAll() {
    return prisma.flightMarkup.findMany({ orderBy: { createdAt: 'desc' } })
  }

  /** Create a new markup (percentage only, deactivates others if this is active) */
  static async create(data: {
    name?: string
    percentageValue: number // e.g., 10 for 10%
    notes?: string
    isActive?: boolean
  }) {
    if (data.isActive) {
      // Only one active markup at a time
      await prisma.flightMarkup.updateMany({ data: { isActive: false } })
    }
    return prisma.flightMarkup.create({ 
      data: { 
        name: data.name || 'Flight Markup',
        percentageValue: data.percentageValue,
        notes: data.notes || '',
        isActive: data.isActive ?? false,
      } 
    })
  }

  /** Update an existing markup */
  static async update(id: string, data: Partial<{
    name: string
    percentageValue: number
    notes: string
    isActive: boolean
  }>) {
    if (data.isActive) {
      await prisma.flightMarkup.updateMany({ where: { id: { not: id } }, data: { isActive: false } })
    }
    return prisma.flightMarkup.update({ where: { id }, data })
  }

  /** Activate a specific markup (deactivates all others) */
  static async activate(id: string) {
    await prisma.flightMarkup.updateMany({ data: { isActive: false } })
    return prisma.flightMarkup.update({ where: { id }, data: { isActive: true } })
  }

  /** Delete a markup */
  static async delete(id: string) {
    return prisma.flightMarkup.delete({ where: { id } })
  }

  /**
   * Apply the active markup percentage to a base price.
   * Returns the marked-up price (original + profit).
   */
  static async applyMarkup(originalPrice: number): Promise<{
    originalPrice: number
    markupPercentage: number
    markupAmount: number
    finalPrice: number
  }> {
    const markup = await this.getActive()
    if (!markup) {
      return { originalPrice, markupPercentage: 0, markupAmount: 0, finalPrice: originalPrice }
    }

    const percentage = Number(markup.percentageValue)
    const markupAmount = (originalPrice * percentage) / 100

    return {
      originalPrice,
      markupPercentage: percentage,
      markupAmount: Math.round(markupAmount * 100) / 100,
      finalPrice: Math.round((originalPrice + markupAmount) * 100) / 100,
    }
  }

  /**
   * Walk a flight search/pricing response and mark up all price fields in place.
   * Works on the Almosafer polling response structure.
   */
  static async applyMarkupToResults(results: any): Promise<any> {
    const markup = await this.getActive()
    if (!markup || Number(markup.percentageValue) === 0) return results

    const percentage = Number(markup.percentageValue)
    const apply = (price: number) => {
      const extra = (price * percentage) / 100
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
