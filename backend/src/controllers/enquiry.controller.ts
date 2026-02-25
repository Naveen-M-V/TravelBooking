import { Request, Response } from 'express'
import { EnquiryService } from '../services/enquiry.service'

export class EnquiryController {
  /** POST /api/enquiries — Submit a new enquiry (public / optional auth) */
  static async create(req: Request, res: Response) {
    try {
      const userId = req.user?.userId

      const {
        packageId, packageName, packageDestination, packageDetails,
        customerName, customerEmail, customerPhone, nationality,
        travelDate, flexibleDates, adults, children, infants, specialRequests,
      } = req.body

      if (!packageId || !packageName || !customerName || !customerEmail || !customerPhone) {
        return res.status(400).json({ error: 'Missing required fields: packageId, packageName, customerName, customerEmail, customerPhone' })
      }

      const enquiry = await EnquiryService.createEnquiry({
        packageId, packageName, packageDestination, packageDetails: packageDetails || {},
        userId,
        customerName, customerEmail, customerPhone, nationality,
        travelDate: travelDate ? new Date(travelDate) : undefined,
        flexibleDates, adults, children, infants, specialRequests,
      })

      res.status(201).json({ success: true, enquiry })
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create enquiry' })
    }
  }

  /** GET /api/enquiries — Admin: list all enquiries */
  static async listAll(req: Request, res: Response) {
    try {
      const { status, page, limit } = req.query
      const result = await EnquiryService.listAll({
        status: status as string | undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      })
      res.json({ success: true, ...result })
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to list enquiries' })
    }
  }

  /** GET /api/enquiries/mine — Customer: my enquiries */
  static async listMine(req: Request, res: Response) {
    try {
      const userId = req.user?.userId
      if (!userId) return res.status(401).json({ error: 'Unauthorized' })
      const enquiries = await EnquiryService.listMine(userId)
      res.json({ success: true, enquiries })
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to get enquiries' })
    }
  }

  /** GET /api/enquiries/:id — Get single enquiry */
  static async getOne(req: Request, res: Response) {
    try {
      const enquiry = await EnquiryService.getById(req.params.id)
      if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' })
      res.json({ success: true, enquiry })
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to get enquiry' })
    }
  }

  /** POST /api/enquiries/:id/quote — Admin: send a price quote */
  static async submitQuote(req: Request, res: Response) {
    try {
      const { basePrice, markupPercentage, adminNotes } = req.body
      if (basePrice == null || markupPercentage == null) {
        return res.status(400).json({ error: 'basePrice and markupPercentage are required' })
      }
      const enquiry = await EnquiryService.submitQuote(
        req.params.id,
        parseFloat(basePrice),
        parseFloat(markupPercentage),
        adminNotes
      )
      res.json({ success: true, enquiry })
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to submit quote' })
    }
  }

  /** POST /api/enquiries/:id/accept — Customer: accept quote */
  static async acceptQuote(req: Request, res: Response) {
    try {
      const userId = req.user?.userId
      const enquiry = await EnquiryService.acceptQuote(req.params.id, userId)
      res.json({ success: true, enquiry })
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to accept quote' })
    }
  }

  /** POST /api/enquiries/:id/cancel — Admin: cancel enquiry */
  static async cancel(req: Request, res: Response) {
    try {
      const enquiry = await EnquiryService.cancel(req.params.id)
      res.json({ success: true, enquiry })
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to cancel enquiry' })
    }
  }
}
