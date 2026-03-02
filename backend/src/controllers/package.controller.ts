import { Request, Response } from 'express'
import { PackageService } from '../services/package.service'

export class PackageController {
  static async getAllPackages(req: Request, res: Response) {
    try {
      const { category, isActive } = req.query
      const packages = await PackageService.getAllPackages({
        category: category as string | undefined,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
      })
      res.json({ success: true, packages })
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to get packages' })
    }
  }

  static async getPackageById(req: Request, res: Response) {
    try {
      const pkg = await PackageService.getPackageById(req.params.id)
      if (!pkg) return res.status(404).json({ error: 'Package not found' })
      res.json({ success: true, package: pkg })
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to get package' })
    }
  }

  static async createPackage(req: Request, res: Response) {
    try {
      const { name, destination, country, duration, price, description } = req.body
      if (!name || !destination || !country || !duration || !price || !description) {
        return res.status(400).json({ error: 'Missing required fields: name, destination, country, duration, price, description' })
      }
      const pkg = await PackageService.createPackage(req.body)
      res.status(201).json({ success: true, package: pkg })
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create package' })
    }
  }

  static async updatePackage(req: Request, res: Response) {
    try {
      const pkg = await PackageService.updatePackage(req.params.id, req.body)
      res.json({ success: true, package: pkg })
    } catch (error: any) {
      if (error.code === 'P2025') return res.status(404).json({ error: 'Package not found' })
      res.status(500).json({ error: error.message || 'Failed to update package' })
    }
  }

  static async deletePackage(req: Request, res: Response) {
    try {
      await PackageService.deletePackage(req.params.id)
      res.json({ success: true })
    } catch (error: any) {
      if (error.code === 'P2025') return res.status(404).json({ error: 'Package not found' })
      res.status(500).json({ error: error.message || 'Failed to delete package' })
    }
  }
}

