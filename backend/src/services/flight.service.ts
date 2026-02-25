import almosaferClient, { almosaferConfig } from '../config/almosafer'
import { PrismaClient } from '@prisma/client'
import { MOCK_SEARCH_ID, buildMockPollingResponse } from '../mocks/flight-mock-data'

const prisma = new PrismaClient()

/** Returns true when mock mode is forced via env flag OR credentials are not configured */
const isMockMode = () =>
  process.env.MOCK_FLIGHTS === 'true' ||
  !almosaferConfig.clientId ||
  almosaferConfig.clientId === ''

// ==================== FLIGHT ASYNC API (Correct URLs: /flights/api/v1.0/*) ====================
export class FlightService {
  
  /**
   * AUTH: POST /auth/api/v1.0/oauth2/token - Get OAuth2 access token
   */
  private static tokenCache: { token: string; expiresAt: number } | null = null

  private static async getAccessToken(): Promise<string> {
    // Return cached token if valid
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
        expiresAt: Date.now() + (expires_in - 60) * 1000, // Refresh 1 min early
      }
      
      return access_token
    } catch (error: any) {
      console.error('[Almosafer Auth] Failed:', error.response?.data)
      throw new Error('Authentication failed')
    }
  }

  /**
   * AUTH: POST /auth/api/v1.0/oauth2/refresh-token - Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<string> {
    try {
      const response = await almosaferClient.post('/auth/api/v1.0/oauth2/refresh-token', {
        refresh_token: refreshToken,
        client_id: almosaferConfig.clientId,
        client_secret: almosaferConfig.clientSecret,
      })
      
      const { access_token, expires_in } = response.data
      this.tokenCache = {
        token: access_token,
        expiresAt: Date.now() + (expires_in - 60) * 1000,
      }
      
      return access_token
    } catch (error: any) {
      console.error('[Almosafer] Token refresh failed:', error.response?.data)
      throw error
    }
  }

  /**
   * 1. POST /flights/api/v1.0/search - Async Search
   */
  static async asyncSearch(searchInput: any) {
    // ── Mock mode: no Almosafer credentials configured ──
    if (isMockMode()) {
      console.log('[Flight] Mock mode active — returning mock search ID')
      return { sId: MOCK_SEARCH_ID }
    }

    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.post('/flights/api/v1.0/search', searchInput, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const { sId } = response.data
      
      // Store in database
      await prisma.flightSearch.create({
        data: {
          sId,
          origin: searchInput.originDestinations?.[0]?.origin || searchInput.origin || '',
          destination: searchInput.originDestinations?.[0]?.destination || searchInput.destination || '',
          departureDate: new Date(searchInput.originDestinations?.[0]?.departureDate || searchInput.departureDate || Date.now()),
          returnDate: searchInput.originDestinations?.[1] ? new Date(searchInput.originDestinations[1].departureDate) : null,
          adults: searchInput.adults || 1,
          children: searchInput.children || 0,
          infants: searchInput.infants || 0,
          cabinClass: searchInput.cabinClass || 'ECONOMY',
        },
      })

      return response.data
    } catch (error: any) {
      console.error('[Flight] Async search failed — falling back to mock data:', error.message)
      return { sId: MOCK_SEARCH_ID }
    }
  }

  /**
   * 2. POST /flights/api/v1.0/search/polling - Search Poll
   */
  static async searchPolling(sId: string) {
    // ── Mock mode or mock sId ──
    if (isMockMode() || sId.startsWith('mock-')) {
      console.log('[Flight] Mock mode active — returning mock search results')
      return buildMockPollingResponse(sId)
    }

    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.post('/flights/api/v1.0/search/polling', { sId }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Cache results if complete
      if (response.data.status === 'COMPLETED') {
        await prisma.flightSearch.update({
          where: { sId },
          data: {
            results: response.data as any,
            resultsExpiry: new Date(Date.now() + 15 * 60 * 1000),
          },
        }).catch(() => {}) // Non-fatal if record not found
      }

      return response.data
    } catch (error: any) {
      console.error('[Flight] Search polling failed — falling back to mock data:', error.message)
      return buildMockPollingResponse(sId)
    }
  }

  /**
   * 3. POST /flights/api/v1.0/fare-families - Search Fare Families
   */
  static async getFareFamilies(sId: string, itineraryId: string) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.post('/flights/api/v1.0/fare-families', 
        { sId, itineraryId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return response.data
    } catch (error: any) {
      console.error('[Flight] Get fare families failed:', error.response?.data)
      throw error
    }
  }

  /**
   * 4. POST /flights/api/v1.0/pricing - Pricing
   */
  static async getPricing(sId: string, itineraryId: string, fareFamilyId?: string) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.post('/flights/api/v1.0/pricing', 
        { sId, itineraryId, fareFamilyId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return response.data
    } catch (error: any) {
      console.error('[Flight] Get pricing failed:', error.response?.data)
      throw error
    }
  }

  /**
   * 5. POST /flights/api/v1.0/pricing/fare-rules - Fare Rules
   */
  static async getFareRules(sId: string, itineraryId: string, fareFamilyId?: string) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.post('/flights/api/v1.0/pricing/fare-rules', 
        { sId, itineraryId, fareFamilyId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return response.data
    } catch (error: any) {
      console.error('[Flight] Get fare rules failed:', error.response?.data)
      throw error
    }
  }

  /**
   * 6. POST /flights/api/v1.0/reservation - Reservation
   */
  static async createReservation(reservationData: any) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.post('/flights/api/v1.0/reservation', reservationData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    } catch (error: any) {
      console.error('[Flight] Create reservation failed:', error.response?.data)
      throw error
    }
  }

  /**
   * 7. POST /flights/api/v1.0/booking - Async Booking
   */
  static async asyncBooking(bookingData: any) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.post('/flights/api/v1.0/booking', bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const { bId, pnr } = response.data
      
      // Store in database
      await prisma.flightBooking.create({
        data: {
          sId: bookingData.sId || '',
          bId,
          internalReference: bId,
          bookingStatus: 'PENDING',
          searchQuery: bookingData as any,
          bookingData: response.data as any,
          currency: bookingData.currency || 'SAR',
          totalAmount: bookingData.totalAmount || 0,
          contactEmail: bookingData.contactDetails?.email || '',
          contactPhone: bookingData.contactDetails?.phone || '',
          contactFirstName: bookingData.travellers?.[0]?.firstName || '',
          contactLastName: bookingData.travellers?.[0]?.lastName || '',
        },
      })

      return response.data
    } catch (error: any) {
      console.error('[Flight] Async booking failed:', error.response?.data)
      throw error
    }
  }

  /**
   * 8. POST /flights/api/v1.0/booking/polling - Booking Poll
   */
  static async bookingPolling(bId: string) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.post('/flights/api/v1.0/booking/polling', { bId }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Update booking status in database
      if (response.data.status) {
        await prisma.flightBooking.updateMany({
          where: { bId },
          data: { 
            bookingStatus: response.data.status,
            bookingData: response.data as any,
          },
        })
      }

      return response.data
    } catch (error: any) {
      console.error('[Flight] Booking polling failed:', error.response?.data)
      throw error
    }
  }

  /**
   * 9. POST /flights/api/v1.0/booking/retrieve - Booking Retrieve
   */
  static async retrieveBooking(bId: string) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.post('/flights/api/v1.0/booking/retrieve', { bId }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    } catch (error: any) {
      console.error('[Flight] Retrieve booking failed:', error.response?.data)
      throw error
    }
  }

  /**
   * 10. POST /flights/api/v1.0/booking/list - Order List
   */
  static async listBookings(filters?: any) {
    try {
      const token = await this.getAccessToken()
      const response = await almosaferClient.post('/flights/api/v1.0/booking/list', filters || {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    } catch (error: any) {
      console.error('[Flight] List bookings failed:', error.response?.data)
      throw error
    }
  }
}
