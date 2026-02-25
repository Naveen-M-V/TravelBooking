import { Router } from 'express'
import { BookingController } from '../controllers/booking.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

router.use(authMiddleware)

router.get('/', BookingController.getAllBookings)
router.get('/:id', BookingController.getBookingById)
router.post('/', BookingController.createBooking)
router.put('/:id', BookingController.updateBooking)
router.delete('/:id', BookingController.cancelBooking)

export default router
