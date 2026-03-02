import { Request, Response } from 'express'
import { CouponService } from '../services/coupon.service'

export class CouponController {
  static async listAll(req: Request, res: Response) {
    try {
      const { type, isActive } = req.query
      const coupons = await CouponService.listAll({
        type: type as string | undefined,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
      })
      res.json({ success: true, coupons })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  static async validate(req: Request, res: Response) {
    try {
      const { code, orderValue, type } = req.body
      if (!code || !orderValue || !type) {
        return res.status(400).json({ error: 'code, orderValue and type are required' })
      }
      const result = await CouponService.validate(code, Number(orderValue), type)
      res.json({ success: true, ...result })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { code, discountValue } = req.body
      if (!code || discountValue === undefined) {
        return res.status(400).json({ error: 'code and discountValue are required' })
      }
      const coupon = await CouponService.create(req.body)
      res.status(201).json({ success: true, coupon })
    } catch (error: any) {
      if (error.code === 'P2002') return res.status(409).json({ error: 'Coupon code already exists' })
      res.status(500).json({ error: error.message })
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const coupon = await CouponService.update(req.params.id, req.body)
      res.json({ success: true, coupon })
    } catch (error: any) {
      if (error.code === 'P2025') return res.status(404).json({ error: 'Coupon not found' })
      res.status(500).json({ error: error.message })
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await CouponService.delete(req.params.id)
      res.json({ success: true })
    } catch (error: any) {
      if (error.code === 'P2025') return res.status(404).json({ error: 'Coupon not found' })
      res.status(500).json({ error: error.message })
    }
  }
}
