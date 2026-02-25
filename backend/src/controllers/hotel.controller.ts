import { Request, Response } from 'express'
import { HotelService } from '../services/hotel.service'

export class HotelController {
  // ==================== HOTEL SYNC API ====================

  /**
   * 1. POST /api/hotels/search/sync - Search Sync
   */
  static async searchSync(req: Request, res: Response) {
    try {
      const result = await HotelService.searchSync(req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[HotelController] Search sync failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to search hotels' })
    }
  }

  /**
   * 2. POST /api/hotels/search-with-packages/sync - Search With Packages Sync
   */
  static async searchWithPackagesSync(req: Request, res: Response) {
    try {
      const result = await HotelService.searchWithPackagesSync(req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[HotelController] Search with packages sync failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to search hotels with packages' })
    }
  }

  /**
   * 3. POST /api/hotels/packages/sync - Packages Sync
   */
  static async getPackagesSync(req: Request, res: Response) {
    try {
      const { hotelId, checkIn, checkOut } = req.body
      const result = await HotelService.getPackagesSync(hotelId, checkIn, checkOut)
      res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[HotelController] Get packages sync failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to get packages' })
    }
  }

  /**
   * 4. POST /api/hotels/availability - Check Availability
   */
  static async checkAvailability(req: Request, res: Response) {
    try {
      const result = await HotelService.checkAvailability(req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[HotelController] Check availability failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to check availability' })
    }
  }

  /**
   * 5. POST /api/hotels/sync/booking - Booking Sync
   */
  static async bookingSync(req: Request, res: Response) {
    try {
      const result = await HotelService.bookingSync(req.body)
      res.status(201).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[HotelController] Booking sync failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to book hotel' })
    }
  }

  /**
   * 6. POST /api/hotels/booking/cancel - Cancel Booking
   */
  static async cancelBooking(req: Request, res: Response) {
    try {
      const { bookingId, reason } = req.body
      const result = await HotelService.cancelBooking(bookingId, reason)
      res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[HotelController] Cancel booking failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to cancel booking' })
    }
  }

  // ==================== HOTEL ASYNC API ====================

  /**
   * 7. POST /api/hotels/search - Async Search
   */
  static async searchAsync(req: Request, res: Response) {
    try {
      const result = await HotelService.searchAsync(req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[HotelController] Async search failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to search hotels' })
    }
  }

  /**
   * 8. GET /api/hotels/search/poll/:sId - Search Poll
   */
  static async searchPoll(req: Request, res: Response) {
    try {
      const { sId } = req.params
      const result = await HotelService.searchPoll(sId)
      res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[HotelController] Search poll failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to poll search' })
    }
  }

  /**
   * 9. POST /api/hotels/packages - Async Packages
   */
  static async getPackagesAsync(req: Request, res: Response) {
    try {
      const { hotelId, checkIn, checkOut } = req.body
      const result = await HotelService.getPackagesAsync(hotelId, checkIn, checkOut)
      res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[HotelController] Get packages async failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to get packages' })
    }
  }

  /**
   * 10. GET /api/hotels/packages/poll/:pId - Package Poll
   */
  static async packagePoll(req: Request, res: Response) {
    try {
      const { pId } = req.params
      const result = await HotelService.packagePoll(pId)
      res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[HotelController] Package poll failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to poll package' })
    }
  }

  /**
   * 11. POST /api/hotels/booking - Async Booking
   */
  static async bookingAsync(req: Request, res: Response) {
    try {
      const result = await HotelService.bookingAsync(req.body)
      res.status(201).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[HotelController] Async booking failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to book hotel' })
    }
  }

  /**
   * 12. GET /api/hotels/booking/poll/:bId - Booking Poll
   */
  static async bookingPoll(req: Request, res: Response) {
    try {
      const { bId } = req.params
      const result = await HotelService.bookingPoll(bId)
      res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[HotelController] Booking poll failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to poll booking' })
    }
  }

  // ==================== HOTEL ORDER MANAGEMENT API ====================

  /**
   * 13. POST /api/hotels/booking/get-order - Get Order
   */
  static async getOrder(req: Request, res: Response) {
    try {
      const { bookingId } = req.body
      const result = await HotelService.getOrder(bookingId)
      res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[HotelController] Get order failed:', error)
      res.status(404).json({ success: false, error: error.message || 'Order not found' })
    }
  }

  /**
   * 14. POST /api/hotels/order/list - List Orders
   */
  static async listOrders(req: Request, res: Response) {
    try {
      const result = await HotelService.listOrders(req.body)
      res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      console.error('[HotelController] List orders failed:', error)
      res.status(500).json({ success: false, error: error.message || 'Failed to list orders' })
    }
  }
}
