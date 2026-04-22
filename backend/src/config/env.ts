import dotenv from 'dotenv'

dotenv.config()

const parseAllowedOrigins = () => {
  const fromEnv = process.env.ALLOWED_ORIGINS
  if (!fromEnv) {
    return [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://travel-booking-2yj1.vercel.app',
    ]
  }

  const parsed = fromEnv
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  return parsed.length
    ? parsed
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://travel-booking-2yj1.vercel.app',
      ]
}

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  allowedOrigins: parseAllowedOrigins(),
  mockFlights: process.env.MOCK_FLIGHTS === 'true',
}
