import { Request, Response } from 'express'
import { HeroImageService } from '../services/heroImage.service'

export class HeroImageController {
  static async listAll(req: Request, res: Response) {
    try {
      const activeOnly = req.query.activeOnly === 'true'
      const images = await HeroImageService.listAll(activeOnly)
      res.json({ success: true, images })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { url } = req.body
      if (!url) return res.status(400).json({ error: 'url is required' })
      const image = await HeroImageService.create(req.body)
      res.status(201).json({ success: true, image })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const image = await HeroImageService.update(req.params.id, req.body)
      res.json({ success: true, image })
    } catch (error: any) {
      if (error.code === 'P2025') return res.status(404).json({ error: 'Image not found' })
      res.status(500).json({ error: error.message })
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await HeroImageService.delete(req.params.id)
      res.json({ success: true })
    } catch (error: any) {
      if (error.code === 'P2025') return res.status(404).json({ error: 'Image not found' })
      res.status(500).json({ error: error.message })
    }
  }

  static async reorder(req: Request, res: Response) {
    try {
      const { orderedIds } = req.body
      if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'orderedIds must be an array' })
      await HeroImageService.reorder(orderedIds)
      res.json({ success: true })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}
