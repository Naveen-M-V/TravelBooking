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

  /** POST /api/flight-markup — Admin: create a new markup rule (percentage only) */
  static async create(req: Request, res: Response) {
    try {
      const { name, percentageValue, notes, isActive } = req.body
      if (percentageValue == null) {
        return res.status(400).json({ error: 'percentageValue is required' })
      }
      const numeric = parseFloat(percentageValue)
      if (Number.isNaN(numeric) || numeric < 0) {
        return res.status(400).json({ error: 'percentageValue must be a valid non-negative number' })
      }
      const rule = await FlightMarkupService.create({
        name,
        percentageValue: numeric,
        notes,
        isActive,
      })
      res.status(201).json({ success: true, rule })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  /** PUT /api/flight-markup/:id — Admin: update a markup rule */
  static async update(req: Request, res: Response) {
    try {
      const { name, percentageValue, notes, isActive } = req.body
      const rule = await FlightMarkupService.update(req.params.id, {
        name,
        percentageValue: percentageValue != null ? parseFloat(percentageValue) : undefined,
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
