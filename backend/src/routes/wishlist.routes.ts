import { Router } from 'express'
import { WishlistController } from '../controllers/wishlist.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

router.use(authMiddleware)

router.get('/mine', WishlistController.listMine)
router.get('/check/:packageId', WishlistController.check)
router.post('/', WishlistController.add)
router.delete('/:packageId', WishlistController.remove)

export default router
