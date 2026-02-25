import { Router } from 'express'
import { EnquiryController } from '../controllers/enquiry.controller'
import { authMiddleware, requireRole, optionalAuth } from '../middleware/auth.middleware'

const router = Router()

// Public / optional auth: submit new enquiry
router.post('/', optionalAuth, EnquiryController.create)

// Customer: view my enquiries
router.get('/mine', authMiddleware, EnquiryController.listMine)

// Admin: list all enquiries
router.get('/', authMiddleware, requireRole('admin'), EnquiryController.listAll)

// Get single enquiry (admin or owner)
router.get('/:id', authMiddleware, EnquiryController.getOne)

// Admin: submit quote
router.post('/:id/quote', authMiddleware, requireRole('admin'), EnquiryController.submitQuote)

// Customer: accept quote
router.post('/:id/accept', optionalAuth, EnquiryController.acceptQuote)

// Admin: cancel enquiry
router.post('/:id/cancel', authMiddleware, requireRole('admin'), EnquiryController.cancel)

export default router
