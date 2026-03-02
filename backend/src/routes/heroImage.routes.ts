import { Router } from 'express'
import { HeroImageController } from '../controllers/heroImage.controller'
import { authMiddleware, requireRole } from '../middleware/auth.middleware'

const router = Router()

// Public: get active hero images (used on landing page)
router.get('/public', HeroImageController.listAll)

// Admin only
router.use(authMiddleware, requireRole('admin'))

router.get('/', HeroImageController.listAll)
router.post('/', HeroImageController.create)
router.put('/reorder', HeroImageController.reorder)
router.put('/:id', HeroImageController.update)
router.delete('/:id', HeroImageController.delete)

export default router
