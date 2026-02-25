import { Router } from 'express'
import { VendorController } from '../controllers/vendor.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { roleMiddleware } from '../middleware/role.middleware'

const router = Router()

router.use(authMiddleware)

router.get('/', VendorController.getAllVendors)
router.get('/:id', VendorController.getVendorById)
router.post('/', roleMiddleware(['admin']), VendorController.createVendor)
router.put('/:id', roleMiddleware(['admin', 'vendor']), VendorController.updateVendor)
router.delete('/:id', roleMiddleware(['admin']), VendorController.deleteVendor)

export default router
