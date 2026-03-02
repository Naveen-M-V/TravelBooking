import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { authMiddleware, requireRole } from '../middleware/auth.middleware'

const router = Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/logout', AuthController.logout)
router.get('/me', authMiddleware, AuthController.getCurrentUser)
router.put('/profile', authMiddleware, AuthController.updateProfile)
router.put('/change-password', authMiddleware, AuthController.changePassword)

// Email verification
router.get('/verify-email/:token', AuthController.verifyEmail)
router.post('/resend-verification', AuthController.resendVerification)

// Admin invite (sending requires admin; accepting is public)
router.post('/invite-admin', authMiddleware, requireRole('admin'), AuthController.inviteAdmin)
router.post('/accept-invite', AuthController.acceptInvite)

// Admin: user management
router.get('/users', authMiddleware, requireRole('admin'), AuthController.listUsers)
router.put('/users/:id/role', authMiddleware, requireRole('admin'), AuthController.updateUserRole)

export default router
