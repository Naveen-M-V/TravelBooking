import almosaferClient, { almosaferConfig } from '../config/almosafer'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ==================== HOTEL SYNC & ASYNC APIs (Correct URLs: /hotels/api/v1.0/*) ====================
export class HotelService {
  
  /**
   * Get OAuth2 token (shared with FlightService)
   */
  private static tokenCache: { token: string; expiresAt: number } | null = null

  private static async getAccessToken(): Promise<string> {
    if (this.tokenCache && this.tokenCache.expiresAt > Date.now()) {
      return this.tokenCache.token
    }

    try {
      const response = await almosaferClient.post('/auth/api/v1.0/oauth2/token', 
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: almosaferConfig.clientId,
          client_secret: almosaferConfig.clientSecret,
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      )
      
      const { access_token, expires_in } = response.data
      this.tokenCache = {
        token: access_token,
        expiresAt: Date.now() + (expires_in - 60) * 1000,
      }
      
      return access_token
    } catch (error: any) {
      console.error('[Hotel Auth] Failed:', error.response?.data)
      throw new Error('Authentication failed')
    }
  }

  // ==================== HOTEL SYNC API ====================

  /**
   * 1. POST /hotels/api/v1.0/search/sync - Search (Sync)
   */
  static async searchSync(searchInput: any) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.post('/hotels/api/v1.0/search/sync', searchInput, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    } catch (error: any) {
      console.error('[Hotel] Search sync failed:', error.response?.data)
      throw error
    }
  }

  /**
   * 2. POST /hotels/api/v1.0/search-with-packages/sync - Search With Packages (Sync)
   */
  static async searchWithPackagesSync(searchInput: any) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.post('/hotels/api/v1.0/search-with-packages/sync', searchInput, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    } catch (error: any) {
      console.error('[Hotel] Search with packages sync failed:', error.response?.data)
      throw error
    }
  }

  /**
   * 3. POST /hotels/api/v1.0/packages/sync - Packages (Sync)
   */
  static async getPackagesSync(hotelId: string, checkIn: string, checkOut: string) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.post('/hotels/api/v1.0/packages/sync', 
        { hotelId, checkIn, checkOut },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return response.data
    } catch (error: any) {
      console.error('[Hotel] Get packages sync failed:', error.response?.data)
      throw error
    }
  }

  /**
   * 4. POST /hotels/api/v1.0/availability - Availability
   */
  static async checkAvailability(availabilityInput: any) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.post('/hotels/api/v1.0/availability', availabilityInput, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    } catch (error: any) {
      console.error('[Hotel] Check availability failed:', error.response?.data)
      throw error
    }
  }

  /**
   * 5. POST /hotels/api/v1.0/sync/booking - Booking (Sync)
   */
  static async bookingSync(bookingData: any) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.post('/hotels/api/v1.0/sync/booking', bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Store in database
      const { bId: hotelBId, status } = response.data
      await prisma.hotelBooking.create({
        data: {
          sId: bookingData.sId || '00000000-0000-0000-0000-000000000000',
          bId: hotelBId || '00000000-0000-0000-0000-000000000000',
          hotelId: bookingData.hotelId || '',
          hotelName: bookingData.hotelName || '',
          checkInDate: new Date(bookingData.checkIn),
          checkOutDate: new Date(bookingData.checkOut),
          numberOfRooms: bookingData.rooms || 1,
          numberOfNights: bookingData.nights || 1,
          bookingStatus: status || 'PENDING',
          bookingData: response.data as any,
          searchQuery: bookingData as any,
          packageDetails: bookingData.packageDetails || {},
          currency: bookingData.currency || 'SAR',
          totalAmount: bookingData.totalAmount || 0,
        },
      })

      return response.data
    } catch (error: any) {
      console.error('[Hotel] Booking sync failed:', error.response?.data)
      throw error
    }
  }

  /**
   * 6. POST /hotels/api/v1.0/booking/cancel - Cancel Booking
   */
  static async cancelBooking(bookingId: string, reason?: string) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.post('/hotels/api/v1.0/booking/cancel', 
        { bookingId, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // Update status in database
      await prisma.hotelBooking.updateMany({
        where: { bId: bookingId },
        data: { bookingStatus: 'CANCELLED' },
      })

      return response.data
    } catch (error: any) {
      console.error('[Hotel] Cancel booking failed:', error.response?.data)
      throw error
    }
  }

  // ==================== HOTEL ASYNC API ====================

  /**
   * 7. POST /hotels/api/v1.0/search - Async Search
   */
  static async searchAsync(searchInput: any) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.post('/hotels/api/v1.0/search', searchInput, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const { sId } = response.data
      
      // Store search in database (if table exists)
      // await prisma.hotelSearch.create({ data: { sId, ...searchInput } })

      return response.data
    } catch (error: any) {
      console.error('[Hotel] Async search failed:', error.response?.data)
      throw error
    }
  }

  /**
   * 8. GET /hotels/api/v1.0/search/poll/{sId} - Search Poll
   */
  static async searchPoll(sId: string) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.get(`/hotels/api/v1.0/search/poll/${sId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    } catch (error: any) {
      console.error('[Hotel] Search poll failed:', error.response?.data)
      throw error
    }
  }

  /**
   * 9. POST /hotels/api/v1.0/packages - Async Packages
   */
  static async getPackagesAsync(hotelId: string, checkIn: string, checkOut: string) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.post('/hotels/api/v1.0/packages', 
        { hotelId, checkIn, checkOut },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const { pId } = response.data
      return response.data
    } catch (error: any) {
      console.error('[Hotel] Get packages async failed:', error.response?.data)
      throw error
    }
  }

  /**
   * 10. GET /hotels/api/v1.0/packages/poll/{pId} - Package Poll
   */
  static async packagePoll(pId: string) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.get(`/hotels/api/v1.0/packages/poll/${pId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    } catch (error: any) {
      console.error('[Hotel] Package poll failed:', error.response?.data)
      throw error
    }
  }

  /**
   * 11. POST /hotels/api/v1.0/booking - Async Booking
   */
  static async bookingAsync(bookingData: any) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.post('/hotels/api/v1.0/booking', bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const { bId } = response.data
      
      // Store in database
      await prisma.hotelBooking.create({
        data: {
          sId: bookingData.sId || '00000000-0000-0000-0000-000000000000',
          bId: bId || '00000000-0000-0000-0000-000000000000',
          hotelId: bookingData.hotelId || '',
          hotelName: bookingData.hotelName || '',
          checkInDate: new Date(bookingData.checkIn),
          checkOutDate: new Date(bookingData.checkOut),
          numberOfRooms: bookingData.rooms || 1,
          numberOfNights: bookingData.nights || 1,
          bookingStatus: 'PENDING',
          bookingData: response.data as any,
          searchQuery: bookingData as any,
          packageDetails: bookingData.packageDetails || {},
          currency: bookingData.currency || 'SAR',
          totalAmount: bookingData.totalAmount || 0,
        },
      })

      return response.data
    } catch (error: any) {
      console.error('[Hotel] Async booking failed:', error.response?.data)
      throw error
    }
  }

  /**
   * 12. GET /hotels/api/v1.0/booking/poll/{bId} - Booking Poll
   */
  static async bookingPoll(bId: string) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.get(`/hotels/api/v1.0/booking/poll/${bId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Update booking status
      if (response.data.status) {
        await prisma.hotelBooking.updateMany({
          where: { bId },
          data: { 
            bookingStatus: response.data.status,
            bookingData: response.data as any,
          },
        })
      }

      return response.data
    } catch (error: any) {
      console.error('[Hotel] Booking poll failed:', error.response?.data)
      throw error
    }
  }

  // ==================== HOTEL ORDER MANAGEMENT API ====================

  /**
   * 13. POST /hotels/api/v1.0/booking/get-order - Get Order
   */
  static async getOrder(bookingId: string) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.post('/hotels/api/v1.0/booking/get-order', 
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return response.data
    } catch (error: any) {
      console.error('[Hotel] Get order failed:', error.response?.data)
      throw error
    }
  }

  /**
   * 14. POST /hotels/api/v1.0/order/list - Order List
   */
  static async listOrders(filters?: any) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.post('/hotels/api/v1.0/order/list', filters || {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    } catch (error: any) {
      console.error('[Hotel] List orders failed:', error.response?.data)
      throw error
    }
  }
}
