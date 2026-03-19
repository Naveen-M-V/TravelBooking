import { Request, Response } from 'express'
import { testimonialMockData } from '../mocks/testimonial-mock-data'

export class TestimonialController {
  static async getPublicTestimonials(req: Request, res: Response) {
    try {
      const requestedLimit = Number(req.query.limit)
      const limit = Number.isFinite(requestedLimit) && requestedLimit > 0
        ? Math.min(Math.floor(requestedLimit), 20)
        : testimonialMockData.length

      res.json({
        success: true,
        testimonials: testimonialMockData.slice(0, limit),
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to get testimonials' })
    }
  }
}
