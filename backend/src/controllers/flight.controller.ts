import { Request, Response } from 'express'
import { FlightService } from '../services/flight.service'
import { FlightMarkupService } from '../services/flightMarkup.service'

export class FlightController {
  /**
   * 1. POST /api/flights/search - Async Search
   */
  static async asyncSearch(req: Request, res: Response) {
    try {
      const result = await FlightService.asyncSearch(req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[FlightController] Async search failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to search flights' })
    }
  }

  /**
   * 2. POST /api/flights/search/polling - Search Poll
   */
  static async searchPolling(req: Request, res: Response) {
    try {
      const { sId } = req.body
      const result = await FlightService.searchPolling(sId)
      const patched = await FlightMarkupService.applyMarkupToResults(result)
      res.status(200).json({ success: true, data: patched })
    } catch (error: any) {
      console.error('[FlightController] Search polling failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to poll search' })
    }
  }

  /**
   * 3. POST /api/flights/fare-families - Get Fare Families
   */
  static async getFareFamilies(req: Request, res: Response) {
    try {
      const { sId, itineraryId } = req.body
      const result = await FlightService.getFareFamilies(sId, itineraryId)
      res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[FlightController] Get fare families failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to get fare families' })
    }
  }

  /**
   * 4. POST /api/flights/pricing - Get Pricing
   */
  static async getPricing(req: Request, res: Response) {
    try {
      const { sId, itineraryId, fareFamilyId } = req.body
      const result = await FlightService.getPricing(sId, itineraryId, fareFamilyId)
      const patched = await FlightMarkupService.applyMarkupToResults(result)
      res.status(200).json({ success: true, data: patched })
    } catch (error: any) {
      console.error('[FlightController] Get pricing failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to get pricing' })
    }
  }

  /**
   * 5. POST /api/flights/pricing/fare-rules - Get Fare Rules
   */
  static async getFareRules(req: Request, res: Response) {
    try {
      const { sId, pricingId } = req.body
      const result = await FlightService.getFareRules(sId, pricingId)
      res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[FlightController] Get fare rules failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to get fare rules' })
    }
  }

  /**
   * 6. POST /api/flights/reservation - Create Reservation
   */
  static async createReservation(req: Request, res: Response) {
    try {
      const result = await FlightService.createReservation(req.body)
      res.status(201).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[FlightController] Create reservation failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to create reservation' })
    }
  }

  /**
   * 7. POST /api/flights/booking - Async Booking
   */
  static async asyncBooking(req: Request, res: Response) {
    try {
      const result = await FlightService.asyncBooking(req.body)
      res.status(201).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[FlightController] Async booking failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to book flight' })
    }
  }

  /**
   * 8. POST /api/flights/booking/polling - Booking Poll
   */
  static async bookingPolling(req: Request, res: Response) {
    try {
      const { bId, sId } = req.body
      const result = await FlightService.bookingPolling(bId, sId)
      res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[FlightController] Booking polling failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to poll booking' })
    }
  }

  /**
   * 9. POST /api/flights/booking/retrieve - Retrieve Booking
   */
  static async retrieveBooking(req: Request, res: Response) {
    try {
      const { bId } = req.body
      const result = await FlightService.retrieveBooking(bId)
      res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[FlightController] Retrieve booking failed:', error)
      res.status(404).json({ success: false, error: error.message || 'Booking not found' })
    }
  }

  /**
   * 10. POST /api/flights/booking/list - List Bookings
   */
  static async listBookings(req: Request, res: Response) {
    try {
      const result = await FlightService.listBookings(req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[FlightController] List bookings failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to list bookings' })
    }
  }
}
