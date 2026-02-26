// ============================================================================
// UI-Specific Types for Frontend
// ============================================================================

export interface HalalRating {
  score: number // 0-5
  features: string[] // Array of feature names
}

export interface SearchFormData {
  type: 'flight' | 'package'
  
  // Flight-specific
  flightType?: 'one-way' | 'round-trip' | 'multi-city'
  origin?: string
  departureDate?: string
  returnDate?: string
  
  // Package-specific or Flight destination
  destination?: string
  checkIn?: string
  checkOut?: string
  
  // Common
  adults: number
  children: number
  infants: number
  childAges?: number[]
  cabinClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST'
  rooms?: number
}

export interface FilterOptions {
  priceRange: {
    min: number
    max: number
  }
  airlines?: string[]
  stops?: ('direct' | '1-stop' | '2-stops')[]
  departureTime?: ('morning' | 'afternoon' | 'evening' | 'night')[]
  halalRating?: number
  starRating?: number[]
  amenities?: string[]
}

export interface BookingStep {
  step: number
  title: string
  status: 'pending' | 'active' | 'completed'
}

export const BOOKING_STEPS: BookingStep[] = [
  { step: 1, title: 'Passenger Details', status: 'active' },
  { step: 2, title: 'Add-ons & Extras', status: 'pending' },
  { step: 3, title: 'Review & Payment', status: 'pending' },
]

export interface AirportLocation {
  code: string
  name: string
  city: string
  country: string
}

export interface PopularDestination {
  id: string
  name: string
  country: string
  image: string
  halalRating: number
  startingPrice: number
  currency: string
  description: string
  features: string[]
}
