import { Router } from 'express'
import { PackageController } from '../controllers/package.controller'
import { authMiddleware, optionalAuth } from '../middleware/auth.middleware'
import { roleMiddleware } from '../middleware/role.middleware'

const router = Router()

router.get('/', optionalAuth, PackageController.getAllPackages)
router.get('/:id', optionalAuth, PackageController.getPackageById)

router.use(authMiddleware)

router.post('/', roleMiddleware(['vendor', 'admin']), PackageController.createPackage)
router.put('/:id', roleMiddleware(['vendor', 'admin']), PackageController.updatePackage)
router.delete('/:id', roleMiddleware(['vendor', 'admin']), PackageController.deletePackage)

export default router
