import odisClient from '../config/odis'
import { odisConfig } from '../config/odis'
import { PrismaClient } from '@prisma/client'
import { MOCK_SEARCH_ID, buildMockPollingResponse } from '../mocks/flight-mock-data'
import { getOdisToken, clearOdisTokenCache } from './auth.odis'

const prisma = new PrismaClient()

// ── Rate-limit tracking ──────────────────────────────────────────────────────
/** Epoch ms at which ODIS will accept new requests again. */
let odisRateLimitUntil = 0

/**
 * Parse a Retry-After header value (seconds or HTTP-date string).
 * Returns the epoch ms to wait until.
 */
function parseRetryAfter(header: string | undefined): number {
  if (!header) return Date.now() + 60_000          // default: 1 minute
  const secs = Number(header)
  if (!isNaN(secs)) {
    // Sanity-cap: never wait more than 24 hours from a Retry-After header.
    const waitMs = Math.min(secs, 86_400) * 1_000
    return Date.now() + waitMs
  }
  const parsed = Date.parse(header)                // HTTP-date format
  return isNaN(parsed) ? Date.now() + 60_000 : parsed
}

/** Returns true when we know ODIS will 429 us right now. */
const isRateLimited = () => Date.now() < odisRateLimitUntil

/** Returns true when mock mode is forced via env flag OR ODIS credentials are not configured OR we're rate-limited */
const isMockMode = () =>
  process.env.MOCK_FLIGHTS === 'true' ||
  !odisConfig.username ||
  odisConfig.username === '' ||
  isRateLimited()

// ==================== FLIGHT ASYNC API (Correct URLs: /flights/api/v1.0/*) ====================
export class FlightService {

  /**
   * Expose refresh for controller use if needed
   */
  static async refreshToken(refreshToken: string): Promise<string> {
    const { refreshOdisToken } = await import('./auth.odis')
    return refreshOdisToken(refreshToken)
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
      const token = await getOdisToken()

      // --- Transform flat params into ODIS segments/travellers format ---
      const origin = searchInput.origin || searchInput.originDestinations?.[0]?.origin || searchInput.segments?.[0]?.from || searchInput.segments?.[0]?.origin || ''
      const destination = searchInput.destination || searchInput.originDestinations?.[0]?.destination || searchInput.segments?.[0]?.to || searchInput.segments?.[0]?.destination || ''
      const departureDate = searchInput.departureDate || searchInput.originDestinations?.[0]?.departureDate || searchInput.segments?.[0]?.departureDate || ''
      const returnDate = searchInput.returnDate || searchInput.originDestinations?.[1]?.departureDate || searchInput.segments?.[1]?.departureDate || null

      const segments: any[] = [
        { origin, destination, departureDate },
      ]
      if (returnDate) {
        segments.push({ origin: destination, destination: origin, departureDate: returnDate })
      }

      const odisPayload = {
        segments,
        travellers: {
          adult:  searchInput.adults  ?? searchInput.travellers?.adult  ?? 1,
          child:  searchInput.children ?? searchInput.travellers?.child ?? 0,
          infant: searchInput.infants  ?? searchInput.travellers?.infant ?? 0,
        },
        cabinClass: searchInput.cabinClass || 'ECONOMY',
        currency:   searchInput.currency   || 'SAR',
      }

      const response = await odisClient.post('/flights/api/v1.0/search', odisPayload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const { sId } = response.data
      
      // Store in database
      await prisma.flightSearch.create({
        data: {
          sId,
          origin,
          destination,
          departureDate: new Date(departureDate || Date.now()),
          returnDate: returnDate ? new Date(returnDate) : null,
          adults: searchInput.adults || 1,
          children: searchInput.children || 0,
          infants: searchInput.infants || 0,
          cabinClass: searchInput.cabinClass || 'ECONOMY',
        },
      })

      return response.data
    } catch (error: any) {
      console.error('[ODIS] Async search failed — falling back to mock data:', error.message)
      const status = error.response?.status
      const body   = error.response?.data
      if (status === 401) {
        clearOdisTokenCache()
      } else if (status === 429) {
        odisRateLimitUntil = parseRetryAfter(error.response?.headers?.['retry-after'])
        const resetAt = new Date(odisRateLimitUntil).toISOString()
        console.warn(`[ODIS] Rate-limited (429). Falling back to mock. Quota resets around ${resetAt}`)
      } else if (status === 400) {
        console.error('[ODIS] Bad request (400). Response body:', JSON.stringify(body, null, 2))
      }
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
      const token = await getOdisToken()
      const response = await odisClient.post('/flights/api/v1.0/search/polling', { sId }, {
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
      const token = await getOdisToken()
      const response = await odisClient.post('/flights/api/v1.0/fare-families', 
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
  static async getPricing(sId: string, itineraryId: string | string[], fareFamilyId?: string) {
    try {
      const token = await getOdisToken()
      // ODIS requires itineraryId as an array
      const itineraryIds = Array.isArray(itineraryId) ? itineraryId : [itineraryId]
      const response = await odisClient.post('/flights/api/v1.0/pricing', 
        { sId, itineraryId: itineraryIds },
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
  static async getFareRules(sId: string, pricingId: string) {
    try {
      const token = await getOdisToken()
      const response = await odisClient.post('/flights/api/v1.0/pricing/fare-rules', 
        { sId, pricingId },
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
      const token = await getOdisToken()
      const response = await odisClient.post('/flights/api/v1.0/reservation', reservationData, {
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
      const token = await getOdisToken()
      const response = await odisClient.post('/flights/api/v1.0/booking', bookingData, {
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
  static async bookingPolling(bId: string, sId?: string) {
    try {
      const token = await getOdisToken()
      const response = await odisClient.post('/flights/api/v1.0/booking/polling', { sId, bId }, {
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
      const token = await getOdisToken()
      const response = await odisClient.post('/flights/api/v1.0/booking/retrieve', { bId }, {
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
      const token = await getOdisToken()
      const response = await odisClient.post('/flights/api/v1.0/booking/list', filters || {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    } catch (error: any) {
      console.error('[Flight] List bookings failed:', error.response?.data)
      throw error
    }
  }
}
