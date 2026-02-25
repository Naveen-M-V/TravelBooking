import { PrismaClient } from '@prisma/client'
import { EmailService } from './email.service'

const prisma = new PrismaClient()

export interface CreateEnquiryData {
  packageId: string
  packageName: string
  packageDestination: string
  packageDetails: object
  userId?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  nationality?: string
  travelDate?: Date
  flexibleDates?: boolean
  adults?: number
  children?: number
  infants?: number
  specialRequests?: string
}

export class EnquiryService {
  /** Customer submits a new package enquiry */
  static async createEnquiry(data: CreateEnquiryData) {
    const enquiry = await prisma.packageEnquiry.create({
      data: {
        ...data,
        packageDetails: data.packageDetails as any,
        adults: data.adults ?? 2,
        children: data.children ?? 0,
        infants: data.infants ?? 0,
        flexibleDates: data.flexibleDates ?? false,
      },
    })

    // Fire-and-forget emails
    EmailService.sendEnquiryNotificationToAdmin(enquiry).catch(console.error)
    EmailService.sendEnquiryConfirmation(enquiry).catch(console.error)

    return enquiry
  }

  /** Admin: list all enquiries with pagination */
  static async listAll(params: { status?: string; page?: number; limit?: number }) {
    const { status, page = 1, limit = 20 } = params
    const skip = (page - 1) * limit

    const where = status ? { status } : {}
    const [enquiries, total] = await Promise.all([
      prisma.packageEnquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { user: { select: { email: true, firstName: true, lastName: true } } },
      }),
      prisma.packageEnquiry.count({ where }),
    ])

    return { enquiries, total, page, limit, pages: Math.ceil(total / limit) }
  }

  /** Customer: list my enquiries */
  static async listMine(userId: string) {
    return prisma.packageEnquiry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  /** Get enquiries by customer email (for guests without account) */
  static async listByEmail(email: string) {
    return prisma.packageEnquiry.findMany({
      where: { customerEmail: email },
      orderBy: { createdAt: 'desc' },
    })
  }

  /** Get single enquiry by ID */
  static async getById(id: string) {
    return prisma.packageEnquiry.findUnique({
      where: { id },
      include: { user: { select: { email: true, firstName: true, lastName: true } } },
    })
  }

  /** Admin: submit a price quote for an enquiry */
  static async submitQuote(
    id: string,
    basePrice: number,
    markupPercentage: number,
    adminNotes?: string
  ) {
    const markupAmount = (basePrice * markupPercentage) / 100
    const totalPrice = basePrice + markupAmount
    const quotedAt = new Date()
    const quoteValidUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const enquiry = await prisma.packageEnquiry.update({
      where: { id },
      data: {
        basePrice,
        markupPercentage,
        markupAmount,
        totalPrice,
        status: 'QUOTED',
        quotedAt,
        quoteValidUntil,
        adminNotes,
      },
    })

    // Send quote email to customer
    EmailService.sendQuoteToCustomer(enquiry).catch(console.error)

    return enquiry
  }

  /** Customer: accept the quote (moves to ACCEPTED, ready for payment) */
  static async acceptQuote(id: string, userId?: string) {
    const enquiry = await prisma.packageEnquiry.findUnique({ where: { id } })
    if (!enquiry) throw new Error('Enquiry not found')
    if (userId && enquiry.userId && enquiry.userId !== userId) {
      throw new Error('Forbidden: This enquiry does not belong to you')
    }
    if (enquiry.status !== 'QUOTED') throw new Error('No active quote to accept')

    return prisma.packageEnquiry.update({
      where: { id },
      data: { status: 'ACCEPTED' },
    })
  }

  /** Admin: cancel an enquiry */
  static async cancel(id: string) {
    return prisma.packageEnquiry.update({
      where: { id },
      data: { status: 'CANCELLED' },
    })
  }
}
