import { Router } from 'express'
import { FlightMarkupController } from '../controllers/flightMarkup.controller'
import { authMiddleware, requireRole } from '../middleware/auth.middleware'

const router = Router()

// Public: view active markup (frontend needs this to show "from X" prices)
router.get('/active', FlightMarkupController.getActive)

// Admin only: full CRUD
router.get('/', authMiddleware, requireRole('admin'), FlightMarkupController.listAll)
router.post('/', authMiddleware, requireRole('admin'), FlightMarkupController.create)
router.put('/:id', authMiddleware, requireRole('admin'), FlightMarkupController.update)
router.post('/:id/activate', authMiddleware, requireRole('admin'), FlightMarkupController.activate)
router.delete('/:id', authMiddleware, requireRole('admin'), FlightMarkupController.remove)

export default router
