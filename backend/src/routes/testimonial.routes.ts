import { Router } from 'express'
import { TestimonialController } from '../controllers/testimonial.controller'

const router = Router()

router.get('/public', TestimonialController.getPublicTestimonials)

export default router
