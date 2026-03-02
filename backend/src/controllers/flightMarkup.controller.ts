import { Request, Response } from 'express'
import { FlightMarkupService } from '../services/flightMarkup.service'

export class FlightMarkupController {
  /** GET /api/flight-markup — Admin: list all rules; Public: get active markup info */
  static async listAll(req: Request, res: Response) {
    try {
      const rules = await FlightMarkupService.listAll()
      res.json({ success: true, rules })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  /** GET /api/flight-markup/active — Public: get currently active markup */
  static async getActive(req: Request, res: Response) {
    try {
      const markup = await FlightMarkupService.getActive()
      res.json({ success: true, markup })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  /** POST /api/flight-markup — Admin: create a new markup rule */
  static async create(req: Request, res: Response) {
    try {
      const { name, markupType, markupValue, currency, notes, isActive } = req.body
      if (!markupType || markupValue == null) {
        return res.status(400).json({ error: 'markupType and markupValue are required' })
      }
      if (!['PERCENT', 'FIXED'].includes(markupType)) {
        return res.status(400).json({ error: 'markupType must be PERCENT or FIXED' })
      }
      const rule = await FlightMarkupService.create({
        name, markupType, markupValue: parseFloat(markupValue), currency, notes, isActive,
      })
      res.status(201).json({ success: true, rule })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  /** PUT /api/flight-markup/:id — Admin: update a markup rule */
  static async update(req: Request, res: Response) {
    try {
      const { name, markupType, markupValue, currency, notes, isActive } = req.body
      const rule = await FlightMarkupService.update(req.params.id, {
        name,
        markupType,
        markupValue: markupValue != null ? parseFloat(markupValue) : undefined,
        currency,
        notes,
        isActive,
      })
      res.json({ success: true, rule })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  /** POST /api/flight-markup/:id/activate — Admin: activate a specific rule */
  static async activate(req: Request, res: Response) {
    try {
      const rule = await FlightMarkupService.activate(req.params.id)
      res.json({ success: true, rule })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  /** DELETE /api/flight-markup/:id — Admin: delete a rule */
  static async remove(req: Request, res: Response) {
    try {
      await FlightMarkupService.delete(req.params.id)
      res.json({ success: true })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}
