import { Request, Response } from 'express'
import { PaymentService } from '../services/payment.service'

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001'

export class PaymentController {
  /** POST /api/payments/initiate — Initiate CCAvenue payment for a package enquiry */
  static async initiatePayment(req: Request, res: Response) {
    try {
      const { enquiryId } = req.body
      if (!enquiryId) return res.status(400).json({ error: 'enquiryId is required' })

      const paymentData = await PaymentService.initiatePayment(enquiryId)
      res.json({ success: true, ...paymentData })
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to initiate payment' })
    }
  }

  /** POST /api/payments/callback — CCAvenue posts encrypted response here */
  static async handleCallback(req: Request, res: Response) {
    try {
      const encResp = req.body.encResp || req.query.encResp as string
      if (!encResp) return res.status(400).send('Missing encResp')

      const result = await PaymentService.handleCallback(encResp)

      // Redirect browser back to frontend based on status
      if (result.status === 'SUCCESS') {
        res.redirect(`${FRONTEND_URL}/payment/success?enquiryId=${result.enquiry.id}`)
      } else {
        res.redirect(`${FRONTEND_URL}/payment/failed?enquiryId=${result.enquiry.id}&status=${result.status}`)
      }
    } catch (error: any) {
      console.error('[Payment Callback Error]', error)
      res.redirect(`${FRONTEND_URL}/payment/failed?error=${encodeURIComponent(error.message)}`)
    }
  }

  /** GET /api/payments/:id/status — Get payment status for an enquiry */
  static async getPaymentStatus(req: Request, res: Response) {
    try {
      const status = await PaymentService.getPaymentStatus(req.params.id)
      if (!status) return res.status(404).json({ error: 'Enquiry not found' })
      res.json({ success: true, ...status })
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to get payment status' })
    }
  }
}
