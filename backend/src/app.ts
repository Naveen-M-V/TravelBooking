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

const app: Application = express()

// Middleware
app.use(cors({
  origin: config.allowedOrigins,
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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

// Error handler (must be last)
app.use(errorHandler)

export default app
