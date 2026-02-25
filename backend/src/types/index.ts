export interface User {
  id: string
  email: string
  role: 'customer' | 'vendor' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface Vendor {
  id: string
  userId: string
  businessName: string
  contactInfo: string
  approved: boolean
  createdAt: string
  updatedAt: string
}

export interface Package {
  id: string
  vendorId: string
  title: string
  description: string
  price: number
  duration: number
  destination: string
  availability: boolean
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  userId: string
  type: 'flight' | 'package'
  itemId: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  totalAmount: number
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  bookingId: string
  amount: number
  status: 'pending' | 'success' | 'failed' | 'refunded'
  gateway: 'ccavenue'
  transactionId?: string
  createdAt: string
  updatedAt: string
}

export interface Flight {
  id: string
  origin: string
  destination: string
  departureDate: string
  arrivalDate: string
  price: number
  airline: string
  flightNumber: string
}
