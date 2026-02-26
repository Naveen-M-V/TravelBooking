import apiClient from './client'

export const flightAPI = {
  /** Start async flight search — returns sId */
  asyncSearch: (params: {
    origin: string
    destination: string
    departureDate: string
    returnDate?: string
    adults?: number
    children?: number
    infants?: number
    cabinClass?: string
    tripType?: string
    currency?: string
  }) => apiClient.post('/flights/search', params).then((r) => r.data),

  /** Poll for search results using sId */
  searchPolling: (sId: string) =>
    apiClient.post('/flights/search/polling', { sId }).then((r) => r.data),

  /** Get available fare families for an itinerary */
  getFareFamilies: (sId: string, itineraryId: string) =>
    apiClient.post('/flights/fare-families', { sId, itineraryId }).then((r) => r.data),

  /** Get pricing for a specific itinerary + fare family */
  getPricing: (sId: string, itineraryId: string, fareFamilyId?: string) =>
    apiClient.post('/flights/pricing', { sId, itineraryId, fareFamilyId }).then((r) => r.data),

  /** Get fare rules — requires pricingId from the pricing step */
  getFareRules: (sId: string, pricingId: string) =>
    apiClient.post('/flights/pricing/fare-rules', { sId, pricingId }).then((r) => r.data),

  /** Create reservation (pre-book) */
  createReservation: (data: object) =>
    apiClient.post('/flights/reservation', data).then((r) => r.data),

  /** Start async booking */
  asyncBooking: (data: object) =>
    apiClient.post('/flights/booking', data).then((r) => r.data),

  /** Poll booking status */
  bookingPolling: (bId: string) =>
    apiClient.post('/flights/booking/polling', { bId }).then((r) => r.data),

  /** Retrieve a booking */
  retrieveBooking: (bId: string) =>
    apiClient.post('/flights/booking/retrieve', { bId }).then((r) => r.data),

  /** List bookings */
  listBookings: (params?: object) =>
    apiClient.post('/flights/booking/list', params || {}).then((r) => r.data),

  /**
   * Initiate a CCAvenue payment session for a flight booking.
   * Returns { encRequest, accessCode, gatewayUrl, bookingId }.
   */
  initiateFlightPayment: (data: {
    itineraryId: string
    sId: string
    passengers: object[]
    contactEmail: string
    contactPhone: string
    amount: number
    currency: string
  }) => apiClient.post('/payments/initiate-flight', data).then((r) => r.data),
}
