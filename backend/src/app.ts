import express, { Application } from 'express'
import cors from 'cors'
import { config } from './config/env'
import { errorHandler } from './middleware/errorHandler'

// Import routes
import authRoutes from './routes/auth.routes'
import vendorRoutes from './routes/vendor.routes'
import packageRoutes from './routes/package.routes'
import bookingRoutes from './routes/booking.routes'
import paymentRoutes from './routes/payment.routes'
import flightRoutes from './routes/flight.routes'
import hotelRoutes from './routes/hotel.routes'
import enquiryRoutes from './routes/enquiry.routes'
import couponRoutes from './routes/coupon.routes'
import heroImageRoutes from './routes/heroImage.routes'
import flightMarkupRoutes from './routes/flightMarkup.routes'
import supplierRoutes from './routes/supplier.routes'
import wishlistRoutes from './routes/wishlist.routes'
import testimonialRoutes from './routes/testimonial.routes'

const app: Application = express()

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server tools/curl/postman without Origin header
    if (!origin) return callback(null, true)

    const normalizedOrigin = origin.trim()
    const isConfigured = config.allowedOrigins.includes(normalizedOrigin)
    const isLocalhost = /^https?:\/\/localhost(?::\d+)?$/.test(normalizedOrigin)
    const isVercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(normalizedOrigin)

    if (isConfigured || isLocalhost || isVercelPreview) {
      return callback(null, true)
    }

    return callback(new Error(`CORS blocked for origin: ${normalizedOrigin}`))
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Root info route
app.get('/', (_req, res) => {
  res.json({
    service: 'Halal Travels Backend API',
    status: 'ok',
    health: '/health',
    apiBase: '/api',
    timestamp: new Date().toISOString(),
  })
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/vendors', vendorRoutes)
app.use('/api/packages', packageRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/flights', flightRoutes)
app.use('/api/hotels', hotelRoutes)
app.use('/api/enquiries', enquiryRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/hero-images', heroImageRoutes)
app.use('/api/flight-markup', flightMarkupRoutes)
app.use('/api/suppliers', supplierRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/testimonials', testimonialRoutes)

// Error handler (must be last)
app.use(errorHandler)

export default app
