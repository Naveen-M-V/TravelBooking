import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/logout', AuthController.logout)
router.get('/me', authMiddleware, AuthController.getCurrentUser)
router.put('/profile', authMiddleware, AuthController.updateProfile)
router.put('/change-password', authMiddleware, AuthController.changePassword)

export default router
