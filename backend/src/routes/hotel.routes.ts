import { Router } from 'express'
import { HotelController } from '../controllers/hotel.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// ==================== HOTEL SYNC API (PUBLIC) ====================

// 1. POST /api/hotels/search/sync - Search Sync
router.post('/search/sync', HotelController.searchSync)

// 2. POST /api/hotels/search-with-packages/sync - Search With Packages Sync
router.post('/search-with-packages/sync', HotelController.searchWithPackagesSync)

// 3. POST /api/hotels/packages/sync - Packages Sync
router.post('/packages/sync', HotelController.getPackagesSync)

// 4. POST /api/hotels/availability - Check Availability
router.post('/availability', HotelController.checkAvailability)

// ==================== HOTEL ASYNC API (PUBLIC) ====================

// 7. POST /api/hotels/search - Async Search
router.post('/search', HotelController.searchAsync)

// 8. GET /api/hotels/search/poll/:sId - Search Poll
router.get('/search/poll/:sId', HotelController.searchPoll)

// 9. POST /api/hotels/packages - Async Packages
router.post('/packages', HotelController.getPackagesAsync)

// 10. GET /api/hotels/packages/poll/:pId - Package Poll
router.get('/packages/poll/:pId', HotelController.packagePoll)

// ==================== AUTHENTICATED ROUTES ====================
router.use(authMiddleware)

// 5. POST /api/hotels/sync/booking - Booking Sync
router.post('/sync/booking', HotelController.bookingSync)

// 6. POST /api/hotels/booking/cancel - Cancel Booking
router.post('/booking/cancel', HotelController.cancelBooking)

// 11. POST /api/hotels/booking - Async Booking
router.post('/booking', HotelController.bookingAsync)

// 12. GET /api/hotels/booking/poll/:bId - Booking Poll
router.get('/booking/poll/:bId', HotelController.bookingPoll)

// ==================== HOTEL ORDER MANAGEMENT API ====================

// 13. POST /api/hotels/booking/get-order - Get Order
router.post('/booking/get-order', HotelController.getOrder)

// 14. POST /api/hotels/order/list - List Orders
router.post('/order/list', HotelController.listOrders)

export default router
