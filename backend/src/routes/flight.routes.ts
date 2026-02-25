import { Router } from 'express'
import { FlightController } from '../controllers/flight.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// ==================== FLIGHT ASYNC API (PUBLIC) ====================

// 1. POST /api/flights/search - Async Search
router.post('/search', FlightController.asyncSearch)

// 2. POST /api/flights/search/polling - Search Poll
router.post('/search/polling', FlightController.searchPolling)

// 3. POST /api/flights/fare-families - Get Fare Families
router.post('/fare-families', FlightController.getFareFamilies)

// 4. POST /api/flights/pricing - Get Pricing
router.post('/pricing', FlightController.getPricing)

// 5. POST /api/flights/pricing/fare-rules - Get Fare Rules
router.post('/pricing/fare-rules', FlightController.getFareRules)

// ==================== AUTHENTICATED ROUTES ====================
router.use(authMiddleware)

// 6. POST /api/flights/reservation - Create Reservation
router.post('/reservation', FlightController.createReservation)

// 7. POST /api/flights/booking - Async Booking
router.post('/booking', FlightController.asyncBooking)

// 8. POST /api/flights/booking/polling - Booking Poll
router.post('/booking/polling', FlightController.bookingPolling)

// 9. POST /api/flights/booking/retrieve - Retrieve Booking
router.post('/booking/retrieve', FlightController.retrieveBooking)

// 10. POST /api/flights/booking/list - List Bookings
router.post('/booking/list', FlightController.listBookings)

export default router
