import { Router } from 'express'
import { SupplierController } from '../controllers/supplier.controller'
import { authMiddleware, requireRole } from '../middleware/auth.middleware'

const router = Router()

// All supplier routes require admin auth
router.get('/', authMiddleware, requireRole('admin'), SupplierController.listAll)
router.get('/:id', authMiddleware, requireRole('admin'), SupplierController.getById)
router.post('/', authMiddleware, requireRole('admin'), SupplierController.create)
router.put('/:id', authMiddleware, requireRole('admin'), SupplierController.update)
router.delete('/:id', authMiddleware, requireRole('admin'), SupplierController.delete)
router.patch('/:id/deactivate', authMiddleware, requireRole('admin'), SupplierController.deactivate)

export default router
