import { Router } from 'express'
import { CouponController } from '../controllers/coupon.controller'
import { authMiddleware, requireRole } from '../middleware/auth.middleware'

const router = Router()

// Public: validate a coupon code (used at checkout)
router.post('/validate', CouponController.validate)

// Admin only beyond this point
router.use(authMiddleware, requireRole('admin'))

router.get('/', CouponController.listAll)
router.post('/', CouponController.create)
router.put('/:id', CouponController.update)
router.delete('/:id', CouponController.delete)

export default router
