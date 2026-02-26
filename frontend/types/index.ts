export interface User {
  id: string
  email: string
  role: 'customer' | 'vendor' | 'admin'
  createdAt: string
}

export interface Flight {
  id: string
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  price: number
}

export interface Package {
  id: string
  title: string
  description: string
  price: number
  duration: number
  vendorId: string
}

export interface Booking {
  id: string
  userId: string
  type: 'flight' | 'package'
  itemId: string
  status: 'pending' | 'confirmed' | 'cancelled'
  totalAmount: number
  createdAt: string
}
