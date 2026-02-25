import { Router } from 'express'
import { PaymentController } from '../controllers/payment.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// Initiate payment — customer must be authenticated (or at least accepted the quote)
router.post('/initiate', PaymentController.initiatePayment)

// Callback from CCAvenue — NOT authenticated (CCAvenue posts directly)
router.post('/callback', PaymentController.handleCallback)
router.get('/callback', PaymentController.handleCallback) // some gateways use GET

// Status check — authenticated
router.get('/:id/status', authMiddleware, PaymentController.getPaymentStatus)

export default router
