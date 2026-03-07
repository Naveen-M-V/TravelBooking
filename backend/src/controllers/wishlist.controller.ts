import { Request, Response } from 'express'
import { WishlistService } from '../services/wishlist.service'

export class WishlistController {
  static async listMine(req: Request, res: Response) {
    try {
      const userId = req.user?.userId
      if (!userId) return res.status(401).json({ error: 'Unauthorized' })

      const items = await WishlistService.listMine(userId)
      res.json({ success: true, items })
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to load wishlist' })
    }
  }

  static async add(req: Request, res: Response) {
    try {
      const userId = req.user?.userId
      if (!userId) return res.status(401).json({ error: 'Unauthorized' })

      const { packageId } = req.body
      if (!packageId) return res.status(400).json({ error: 'packageId is required' })

      const item = await WishlistService.add(userId, packageId)
      res.status(201).json({ success: true, item })
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to add to wishlist' })
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      const userId = req.user?.userId
      if (!userId) return res.status(401).json({ error: 'Unauthorized' })

      const packageId = req.params.packageId
      if (!packageId) return res.status(400).json({ error: 'packageId is required' })

      const removed = await WishlistService.remove(userId, packageId)
      res.json({ success: true, removed })
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to remove from wishlist' })
    }
  }

  static async check(req: Request, res: Response) {
    try {
      const userId = req.user?.userId
      if (!userId) return res.status(401).json({ error: 'Unauthorized' })

      const packageId = req.params.packageId
      if (!packageId) return res.status(400).json({ error: 'packageId is required' })

      const inWishlist = await WishlistService.isInWishlist(userId, packageId)
      res.json({ success: true, inWishlist })
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to check wishlist' })
    }
  }
}
