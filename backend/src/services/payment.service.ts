import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'
import { ccAvenueConfig } from '../config/ccavenue'
import { EmailService } from './email.service'

const prisma = new PrismaClient()

export class PaymentService {
  // ─── CCAvenue AES-128-CBC encryption ─────────────────────────────────────

  /** MD5 the working key to get the 128-bit AES key (CCAvenue standard) */
  private static getAesKey(): Buffer {
    return crypto.createHash('md5').update(ccAvenueConfig.workingKey).digest()
  }

  /** Encrypt plain text using AES-128-CBC with zero IV */
  static encrypt(plainText: string): string {
    const key = this.getAesKey()
    const iv = Buffer.alloc(16, 0)
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv)
    let encrypted = cipher.update(plainText, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return encrypted
  }

  /** Decrypt hex-encoded CCAvenue response */
  static decrypt(encryptedHex: string): string {
    const key = this.getAesKey()
    const iv = Buffer.alloc(16, 0)
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }

  // ─── Payment Initiation ──────────────────────────────────────────────────

  /** Build CCAvenue payment request for a package enquiry */
  static async initiatePayment(enquiryId: string) {
    const enquiry = await prisma.packageEnquiry.findUnique({ where: { id: enquiryId } })
    if (!enquiry) throw new Error('Enquiry not found')
    if (!enquiry.totalPrice) throw new Error('This enquiry has no quote yet')
    if (enquiry.status !== 'ACCEPTED') throw new Error('Quote must be accepted before payment')

    // Generate unique order ID
    const orderId = `HT-${Date.now()}-${enquiry.id.slice(0, 6).toUpperCase()}`

    // Build the request parameter string
    const params = [
      `merchant_id=${ccAvenueConfig.merchantId}`,
      `order_id=${orderId}`,
      `currency=${enquiry.currency}`,
      `amount=${Number(enquiry.totalPrice).toFixed(2)}`,
      `redirect_url=${ccAvenueConfig.redirectUrl}`,
      `cancel_url=${ccAvenueConfig.cancelUrl}`,
      `language=EN`,
      `billing_name=${encodeURIComponent(enquiry.customerName)}`,
      `billing_email=${encodeURIComponent(enquiry.customerEmail)}`,
      `billing_tel=${encodeURIComponent(enquiry.customerPhone)}`,
      `billing_country=Saudi Arabia`,
      `merchant_param1=${enquiryId}`, // Pass our enquiry ID for callback lookup
    ].join('&')

    const encRequest = this.encrypt(params)

    // Save order ID against enquiry
    await prisma.packageEnquiry.update({
      where: { id: enquiryId },
      data: { ccavenueOrderId: orderId, paymentStatus: 'PENDING' },
    })

    return {
      orderId,
      encRequest,
      accessCode: ccAvenueConfig.accessCode,
      gatewayUrl: 'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction',
    }
  }

  // ─── Payment Callback ────────────────────────────────────────────────────

  /** Handle encrypted callback from CCAvenue gateway */
  static async handleCallback(encResponse: string) {
    const decrypted = this.decrypt(encResponse)

    // Parse key=value pairs
    const params: Record<string, string> = {}
    decrypted.split('&').forEach((pair) => {
      const idx = pair.indexOf('=')
      if (idx > -1) {
        params[pair.slice(0, idx)] = decodeURIComponent(pair.slice(idx + 1))
      }
    })

    const { order_id, tracking_id, bank_ref_no, order_status, amount, merchant_param1 } = params

    // Look up by our enquiry ID (merchant_param1) or order_id
    const enquiry = await prisma.packageEnquiry.findFirst({
      where: {
        OR: [
          { id: merchant_param1 },
          { ccavenueOrderId: order_id },
        ],
      },
    })

    if (!enquiry) throw new Error('Enquiry not found for order: ' + order_id)

    const paymentStatus = order_status === 'Success' ? 'SUCCESS'
      : order_status === 'Failure' ? 'FAILED'
      : 'CANCELLED'

    const newEnquiryStatus = paymentStatus === 'SUCCESS' ? 'BOOKED' : enquiry.status

    const updated = await prisma.packageEnquiry.update({
      where: { id: enquiry.id },
      data: {
        paymentStatus,
        status: newEnquiryStatus,
        paidAt: paymentStatus === 'SUCCESS' ? new Date() : null,
      },
    })

    // Log payment transaction
    await prisma.paymentTransaction.create({
      data: {
        bookingType: 'PACKAGE',
        bookingId: enquiry.id,
        gatewayOrderId: order_id,
        gatewayTrackingId: tracking_id,
        gatewayStatus: order_status,
        amount: parseFloat(amount || '0'),
        currency: enquiry.currency,
        status: paymentStatus,
        gatewayResponse: params as any,
        completedAt: paymentStatus === 'SUCCESS' ? new Date() : undefined,
      },
    })

    // Send confirmation email on success
    if (paymentStatus === 'SUCCESS') {
      EmailService.sendBookingConfirmation(updated).catch(console.error)
    }

    return { status: paymentStatus, enquiry: updated, params }
  }

  // ─── Status ──────────────────────────────────────────────────────────────

  static async getPaymentStatus(enquiryId: string) {
    return prisma.packageEnquiry.findUnique({
      where: { id: enquiryId },
      select: {
        id: true,
        ccavenueOrderId: true,
        paymentStatus: true,
        status: true,
        totalPrice: true,
        currency: true,
        paidAt: true,
      },
    })
  }
}
