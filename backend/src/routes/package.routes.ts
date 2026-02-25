import { Router } from 'express'
import { PackageController } from '../controllers/package.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { roleMiddleware } from '../middleware/role.middleware'

const router = Router()

router.get('/', PackageController.getAllPackages)
router.get('/:id', PackageController.getPackageById)

router.use(authMiddleware)

router.post('/', roleMiddleware(['vendor', 'admin']), PackageController.createPackage)
router.put('/:id', roleMiddleware(['vendor', 'admin']), PackageController.updatePackage)
router.delete('/:id', roleMiddleware(['vendor', 'admin']), PackageController.deletePackage)

export default router
