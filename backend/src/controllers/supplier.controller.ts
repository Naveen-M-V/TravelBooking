import { Request, Response } from 'express'
import { SupplierService } from '../services/supplier.service'

export class SupplierController {
  static async listAll(req: Request, res: Response) {
    try {
      const suppliers = await SupplierService.listAll()
      res.status(200).json({ success: true, suppliers })
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch suppliers' })
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const supplier = await SupplierService.getById(id)
      if (!supplier) {
        return res.status(404).json({ error: 'Supplier not found' })
      }
      res.status(200).json({ success: true, supplier })
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch supplier' })
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, email, phone, contactPerson, website, notes } = req.body
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' })
      }
      const supplier = await SupplierService.create({
        name,
        email,
        phone,
        contactPerson,
        website,
        notes,
      })
      res.status(201).json({ success: true, supplier })
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create supplier' })
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const data = req.body
      const supplier = await SupplierService.update(id, data)
      res.status(200).json({ success: true, supplier })
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update supplier' })
    }
  }

  static async deactivate(req: Request, res: Response) {
    try {
      const { id } = req.params
      const supplier = await SupplierService.deactivate(id)
      res.status(200).json({ success: true, supplier })
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to deactivate supplier' })
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params
      await SupplierService.delete(id)
      res.status(200).json({ success: true, message: 'Supplier deleted' })
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete supplier' })
    }
  }
}
