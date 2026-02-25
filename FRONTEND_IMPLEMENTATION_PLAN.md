# 🎨 Frontend Implementation Plan - Complete Analysis

## ✅ Backend APIs Available

### 🔐 1. **Authentication APIs** (`/api/auth`)
| Endpoint | Method | Status | Purpose |
|----------|--------|--------|---------|
| `/auth/register` | POST | ⏳ TODO | User registration |
| `/auth/login` | POST | ⏳ TODO | User login |
| `/auth/logout` | POST | ⏳ TODO | User logout |
| `/auth/me` | GET | ⏳ TODO | Get current user |

**Backend Files:**
- Controller: `backend/src/controllers/auth.controller.ts` (4 methods with TODO)
- Service: `backend/src/services/auth.service.ts` (5 methods with TODO)
- Routes: `backend/src/routes/auth.routes.ts` (4 routes registered)

---

### ✈️ 2. **Flight APIs** (`/api/flights`) - **✅ COMPLETE**
| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/flights/search` | POST | No | Initiate async flight search |
| `/flights/search/polling` | POST | No | Poll search results |
| `/flights/fare-families` | POST | No | Get fare family options |
| `/flights/pricing` | POST | No | Validate current pricing |
| `/flights/pricing/fare-rules` | POST | No | Get fare rules & baggage |
| `/flights/reservation` | POST | 🔒 Yes | Create reservation |
| `/flights/booking` | POST | 🔒 Yes | Create booking |
| `/flights/booking/polling` | POST | 🔒 Yes | Poll booking status |
| `/flights/booking/retrieve` | POST | 🔒 Yes | Get booking details |
| `/flights/booking/list` | POST | 🔒 Yes | List all bookings |

**Backend Files:**
- Controller: `backend/src/controllers/flight.controller.ts` ✅ Complete (10 methods)
- Service: `backend/src/services/flight.service.ts` ✅ Complete (10 methods + OAuth2)
- Routes: `backend/src/routes/flight.routes.ts` ✅ Complete (10 routes)

---

### 🏨 3. **Hotel APIs** (`/api/hotels`) - **✅ COMPLETE**

#### Sync APIs (6 endpoints)
| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/hotels/search/sync` | POST | No | Instant hotel search |
| `/hotels/search-with-packages/sync` | POST | No | Search with room packages |
| `/hotels/packages/sync` | POST | No | Get room packages |
| `/hotels/availability` | POST | No | Check room availability |
| `/hotels/sync/booking` | POST | 🔒 Yes | Instant booking |
| `/hotels/booking/cancel` | POST | 🔒 Yes | Cancel booking |

#### Async APIs (6 endpoints)
| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/hotels/search` | POST | No | Initiate async search |
| `/hotels/search/poll/:sId` | GET | No | Poll search results |
| `/hotels/packages` | POST | No | Get packages async |
| `/hotels/packages/poll/:pId` | GET | No | Poll package results |
| `/hotels/booking` | POST | 🔒 Yes | Async booking |
| `/hotels/booking/poll/:bId` | GET | 🔒 Yes | Poll booking status |

#### Order Management (2 endpoints)
| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/hotels/booking/get-order` | POST | 🔒 Yes | Get order details |
| `/hotels/order/list` | POST | 🔒 Yes | List all orders |

**Backend Files:**
- Controller: `backend/src/controllers/hotel.controller.ts` ✅ Complete (14 methods)
- Service: `backend/src/services/hotel.service.ts` ✅ Complete (14 methods)
- Routes: `backend/src/routes/hotel.routes.ts` ✅ Complete (14 routes)

---

### 📦 4. **Package APIs** (`/api/packages`)
| Endpoint | Method | Auth | Status | Purpose |
|----------|--------|------|--------|---------|
| `/packages/` | GET | No | ⏳ TODO | Get all packages |
| `/packages/:id` | GET | No | ⏳ TODO | Get package by ID |
| `/packages/` | POST | 🔒 Yes | ⏳ TODO | Create package (vendor/admin) |
| `/packages/:id` | PUT | 🔒 Yes | ⏳ TODO | Update package (vendor/admin) |
| `/packages/:id` | DELETE | 🔒 Yes | ⏳ TODO | Delete package (admin) |

**Backend Files:**
- Controller: `backend/src/controllers/package.controller.ts` (5 methods with TODO)
- Service: `backend/src/services/package.service.ts` (needs creation)
- Routes: `backend/src/routes/package.routes.ts` (5 routes registered)

---

### 📝 5. **Booking APIs** (`/api/bookings`)
| Endpoint | Method | Auth | Status | Purpose |
|----------|--------|------|--------|---------|
| `/bookings/` | GET | 🔒 Yes | ⏳ TODO | Get all bookings |
| `/bookings/:id` | GET | 🔒 Yes | ⏳ TODO | Get booking by ID |
| `/bookings/` | POST | 🔒 Yes | ⏳ TODO | Create booking |
| `/bookings/:id` | PUT | 🔒 Yes | ⏳ TODO | Update booking |
| `/bookings/:id/cancel` | POST | 🔒 Yes | ⏳ TODO | Cancel booking |

**Backend Files:**
- Controller: `backend/src/controllers/booking.controller.ts` (5 methods with TODO)
- Service: `backend/src/services/booking.service.ts` (needs creation)
- Routes: `backend/src/routes/booking.routes.ts` (5 routes registered)

---

### 💳 6. **Payment APIs** (`/api/payments`)
| Endpoint | Method | Auth | Status | Purpose |
|----------|--------|------|--------|---------|
| `/payments/` | POST | 🔒 Yes | ⏳ TODO | Process payment |
| `/payments/verify` | POST | 🔒 Yes | ⏳ TODO | Verify payment |
| `/payments/refund` | POST | 🔒 Yes | ⏳ TODO | Request refund |

**Backend Files:**
- Controller: `backend/src/controllers/payment.controller.ts` (3 methods with TODO)
- Service: `backend/src/services/payment.service.ts` (needs creation)
- Routes: `backend/src/routes/payment.routes.ts` (3 routes registered)

---

### 🏢 7. **Vendor APIs** (`/api/vendors`)
| Endpoint | Method | Auth | Status | Purpose |
|----------|--------|------|--------|---------|
| `/vendors/` | GET | 🔒 Yes | ⏳ TODO | Get all vendors |
| `/vendors/:id` | GET | 🔒 Yes | ⏳ TODO | Get vendor by ID |
| `/vendors/` | POST | 🔒 Admin | ⏳ TODO | Create vendor |
| `/vendors/:id` | PUT | 🔒 Admin/Vendor | ⏳ TODO | Update vendor |
| `/vendors/:id` | DELETE | 🔒 Admin | ⏳ TODO | Delete vendor |

**Backend Files:**
- Controller: `backend/src/controllers/vendor.controller.ts` (5 methods with TODO)
- Service: `backend/src/services/vendor.service.ts` (needs creation)
- Routes: `backend/src/routes/vendor.routes.ts` (5 routes registered)

---

## 📊 Implementation Status Summary

| Category | Total APIs | Complete | TODO | Progress |
|----------|-----------|----------|------|----------|
| Authentication | 4 | 0 | 4 | ⏳ 0% |
| **Flights (Almosafer)** | 10 | 10 | 0 | ✅ 100% |
| **Hotels (Almosafer)** | 14 | 14 | 0 | ✅ 100% |
| Packages | 5 | 0 | 5 | ⏳ 0% |
| Bookings | 5 | 0 | 5 | ⏳ 0% |
| Payments | 3 | 0 | 3 | ⏳ 0% |
| Vendors | 5 | 0 | 5 | ⏳ 0% |
| **TOTAL** | **46** | **24** | **22** | **52%** |

---

## 🎯 Frontend Features to Implement

### Priority 1: Critical Features (Must Have)

#### 1. **Flight Search & Booking Flow** 🔥
**Status:** Backend ✅ Complete | Frontend ⏳ Needs API Integration

**Existing Frontend Pages:**
- ✅ `/app/flights/page.tsx` - Search form (using mock data)
- ✅ `/app/flights/results/page.tsx` - Search results display
- ⏳ `/app/flights/booking/page.tsx` - **MISSING** (needs creation)
- ✅ `/app/checkout/page.tsx` - Checkout form (generic)
- ✅ `/app/confirmation/page.tsx` - Booking confirmation

**Required Frontend Tasks:**
1. **Create Flight API Client** (`frontend/src/lib/api/flights.ts`)
   ```typescript
   export const flightAPI = {
     // Search & Results
     asyncSearch: (searchParams: FlightSearchInput) => 
       axios.post('/api/flights/search', searchParams),
     
     searchPolling: (sId: string) => 
       axios.post('/api/flights/search/polling', { sId }),
     
     getFareFamilies: (sId: string, itineraryId: string) =>
       axios.post('/api/flights/fare-families', { sId, itineraryId }),
     
     getPricing: (sId: string, itineraryId: string, fareFamilyId?: string) =>
       axios.post('/api/flights/pricing', { sId, itineraryId, fareFamilyId }),
     
     getFareRules: (sId: string, itineraryId: string, fareFamilyId?: string) =>
       axios.post('/api/flights/pricing/fare-rules', { sId, itineraryId, fareFamilyId }),
     
     // Booking (Auth Required)
     createReservation: (data: ReservationData) =>
       axios.post('/api/flights/reservation', data, { headers: authHeaders }),
     
     asyncBooking: (data: BookingData) =>
       axios.post('/api/flights/booking', data, { headers: authHeaders }),
     
     bookingPolling: (bId: string) =>
       axios.post('/api/flights/booking/polling', { bId }, { headers: authHeaders }),
     
     retrieveBooking: (bId: string) =>
       axios.post('/api/flights/booking/retrieve', { bId }, { headers: authHeaders }),
     
     listBookings: (filters?: BookingFilters) =>
       axios.post('/api/flights/booking/list', filters, { headers: authHeaders })
   }
   ```

2. **Update Flight Search Page** (`app/flights/page.tsx`)
   - Replace mock search with `flightAPI.asyncSearch()`
   - Implement polling mechanism with `flightAPI.searchPolling(sId)`
   - Show loading states with progress indicator
   - Handle search expiry (15 min countdown)
   - Redirect to results page with `sId` in URL

3. **Update Flight Results Page** (`app/flights/results/page.tsx`)
   - Get `sId` from URL params
   - Poll results if not complete: `flightAPI.searchPolling(sId)`
   - Display results when status === 'COMPLETE'
   - Add "Get Pricing" button → calls `flightAPI.getPricing()`
   - Add "View Rules" button → calls `flightAPI.getFareRules()`
   - Add "Book Flight" button → redirect to booking page

4. **Create Flight Booking Page** (`app/flights/booking/page.tsx`)
   - Multi-step form: Passenger Details → Review → Payment
   - Get flight details from URL params (sId, itineraryId)
   - Call `flightAPI.createReservation()` first (auth required)
   - Then call `flightAPI.asyncBooking()` with traveler details
   - Poll booking status with `flightAPI.bookingPolling(bId)`
   - Redirect to confirmation when status === 'CONFIRMED'

5. **Add Flight Booking History** (`app/dashboard/customer/bookings/page.tsx`)
   - Call `flightAPI.listBookings()` with filters
   - Display booking cards with status badges
   - "View Details" button → calls `flightAPI.retrieveBooking(bId)`

**Complexity:** High | **Time:** 3-4 days | **Priority:** 🔥 Critical

---

#### 2. **Hotel Search & Booking Flow** 🔥
**Status:** Backend ✅ Complete | Frontend ⏳ Not Started

**Required Frontend Pages (NEW):**
- ⏳ `/app/hotels/page.tsx` - Hotel search form
- ⏳ `/app/hotels/results/page.tsx` - Hotel search results
- ⏳ `/app/hotels/[id]/page.tsx` - Hotel details & room packages
- ⏳ `/app/hotels/booking/page.tsx` - Hotel booking form
- ✅ `/app/checkout/page.tsx` - Reuse existing
- ✅ `/app/confirmation/page.tsx` - Reuse existing

**Required Frontend Tasks:**
1. **Create Hotel API Client** (`frontend/src/lib/api/hotels.ts`)
   ```typescript
   export const hotelAPI = {
     // Sync APIs (faster, direct results)
     searchSync: (searchParams: HotelSearchInput) =>
       axios.post('/api/hotels/search/sync', searchParams),
     
     searchWithPackagesSync: (searchParams: HotelSearchInput) =>
       axios.post('/api/hotels/search-with-packages/sync', searchParams),
     
     getPackagesSync: (hotelId: string, checkIn: string, checkOut: string) =>
       axios.post('/api/hotels/packages/sync', { hotelId, checkIn, checkOut }),
     
     checkAvailability: (availabilityInput: AvailabilityInput) =>
       axios.post('/api/hotels/availability', availabilityInput),
     
     // Async APIs (for large searches)
     searchAsync: (searchParams: HotelSearchInput) =>
       axios.post('/api/hotels/search', searchParams),
     
     searchPoll: (sId: string) =>
       axios.get(`/api/hotels/search/poll/${sId}`),
     
     getPackagesAsync: (hotelId: string, checkIn: string, checkOut: string) =>
       axios.post('/api/hotels/packages', { hotelId, checkIn, checkOut }),
     
     packagePoll: (pId: string) =>
       axios.get(`/api/hotels/packages/poll/${pId}`),
     
     // Booking APIs (Auth Required)
     bookingSync: (data: HotelBookingData) =>
       axios.post('/api/hotels/sync/booking', data, { headers: authHeaders }),
     
     bookingAsync: (data: HotelBookingData) =>
       axios.post('/api/hotels/booking', data, { headers: authHeaders }),
     
     bookingPoll: (bId: string) =>
       axios.get(`/api/hotels/booking/poll/${bId}`, { headers: authHeaders }),
     
     cancelBooking: (bookingId: string, reason?: string) =>
       axios.post('/api/hotels/booking/cancel', { bookingId, reason }, { headers: authHeaders }),
     
     // Order Management (Auth Required)
     getOrder: (bookingId: string) =>
       axios.post('/api/hotels/booking/get-order', { bookingId }, { headers: authHeaders }),
     
     listOrders: (filters?: OrderFilters) =>
       axios.post('/api/hotels/order/list', filters, { headers: authHeaders })
   }
   ```

2. **Create Hotel Search Page** (`app/hotels/page.tsx`)
   - Search form: Location, Check-in, Check-out, Guests, Rooms
   - Call `hotelAPI.searchSync()` for simple searches
   - Or `hotelAPI.searchAsync()` + polling for complex searches
   - Show loading state with progress indicator
   - Redirect to results page

3. **Create Hotel Results Page** (`app/hotels/results/page.tsx`)
   - Display hotel cards with images, ratings, price
   - Filter by: Price range, Star rating, Amenities, Location
   - Sort by: Price, Rating, Distance
   - "View Details" button → redirect to hotel detail page

4. **Create Hotel Detail Page** (`app/hotels/[id]/page.tsx`)
   - Display hotel info, images, amenities, map
   - Call `hotelAPI.getPackagesSync(hotelId, checkIn, checkOut)`
   - Display room packages with prices
   - "Check Availability" button → calls `hotelAPI.checkAvailability()`
   - "Book Now" button → redirect to booking page

5. **Create Hotel Booking Page** (`app/hotels/booking/page.tsx`)
   - Multi-step form: Guest Details → Review → Payment
   - Get hotel & package details from URL params
   - Call `hotelAPI.bookingSync()` or `hotelAPI.bookingAsync()`
   - If async, poll with `hotelAPI.bookingPoll(bId)`
   - Redirect to confirmation when complete

6. **Add Hotel Booking History** (`app/dashboard/customer/bookings/page.tsx`)
   - Tab for Hotels alongside Flights
   - Call `hotelAPI.listOrders()` with filters
   - Display booking cards with status badges
   - "View Details" button → calls `hotelAPI.getOrder(bookingId)`
   - "Cancel" button → calls `hotelAPI.cancelBooking(bookingId)`

**Complexity:** High | **Time:** 4-5 days | **Priority:** 🔥 Critical

---

#### 3. **User Authentication System** 🔥
**Status:** Backend ⏳ TODO | Frontend ⏳ Context Ready

**Existing Frontend Files:**
- ✅ `/frontend/context/AuthContext.tsx` - Context skeleton (needs implementation)
- ✅ `/app/login/page.tsx` - Login form UI
- ✅ `/app/register/page.tsx` - Register form UI
- ⏳ Middleware for protected routes - **MISSING**

**Required Backend Tasks (FIRST):**
1. **Implement Auth Service** (`backend/src/services/auth.service.ts`)
   ```typescript
   import { PrismaClient } from '@prisma/client'
   import bcrypt from 'bcrypt'
   import jwt from 'jsonwebtoken'
   
   const prisma = new PrismaClient()
   
   export class AuthService {
     static async register(data: { 
       email: string; 
       password: string; 
       firstName: string; 
       lastName: string;
       role?: 'customer' | 'vendor' | 'admin';
     }) {
       // Hash password
       const hashedPassword = await bcrypt.hash(data.password, 10)
       
       // Create user in database
       const user = await prisma.user.create({
         data: {
           email: data.email,
           password: hashedPassword,
           firstName: data.firstName,
           lastName: data.lastName,
           role: data.role || 'customer'
         }
       })
       
       // Generate JWT token
       const token = jwt.sign(
         { userId: user.id, email: user.email, role: user.role },
         process.env.JWT_SECRET!,
         { expiresIn: '7d' }
       )
       
       return { user, token }
     }
     
     static async login(email: string, password: string) {
       // Find user by email
       const user = await prisma.user.findUnique({ where: { email } })
       if (!user) throw new Error('User not found')
       
       // Verify password
       const isValid = await bcrypt.compare(password, user.password)
       if (!isValid) throw new Error('Invalid password')
       
       // Generate JWT token
       const token = jwt.sign(
         { userId: user.id, email: user.email, role: user.role },
         process.env.JWT_SECRET!,
         { expiresIn: '7d' }
       )
       
       return { user, token }
     }
     
     static async verifyToken(token: string) {
       return jwt.verify(token, process.env.JWT_SECRET!)
     }
   }
   ```

2. **Implement Auth Controllers** (`backend/src/controllers/auth.controller.ts`)
   - Replace TODOs with actual service calls
   - Return user data + JWT token
   - Handle errors properly

3. **Update Auth Middleware** (`backend/src/middleware/auth.middleware.ts`)
   - Verify JWT token from Authorization header
   - Attach user to req.user
   - Return 401 if invalid/missing

**Required Frontend Tasks:**
1. **Create Auth API Client** (`frontend/src/lib/api/auth.ts`)
   ```typescript
   export const authAPI = {
     register: (data: RegisterData) =>
       axios.post('/api/auth/register', data),
     
     login: (email: string, password: string) =>
       axios.post('/api/auth/login', { email, password }),
     
     logout: () =>
       axios.post('/api/auth/logout'),
     
     getCurrentUser: () =>
       axios.get('/api/auth/me', { headers: authHeaders })
   }
   ```

2. **Implement AuthContext** (`frontend/context/AuthContext.tsx`)
   - Replace TODOs with API calls
   - Store token in localStorage
   - Store user in state
   - Implement signIn, signUp, signOut methods
   - Auto-fetch user on mount if token exists

3. **Update Login Page** (`app/login/page.tsx`)
   - Connect form to `authContext.signIn()`
   - Show loading state
   - Handle errors with toast notifications
   - Redirect to dashboard after successful login

4. **Update Register Page** (`app/register/page.tsx`)
   - Connect form to `authContext.signUp()`
   - Add role selection (customer/vendor)
   - Validate form with Zod
   - Redirect to login after successful registration

5. **Create Protected Route Middleware** (`frontend/middleware.ts`)
   ```typescript
   import { NextResponse } from 'next/server'
   import type { NextRequest } from 'next/server'
   
   export function middleware(request: NextRequest) {
     const token = request.cookies.get('token')?.value
     
     // Protected routes
     const protectedRoutes = ['/dashboard', '/checkout']
     const isProtected = protectedRoutes.some(route => 
       request.nextUrl.pathname.startsWith(route)
     )
     
     if (isProtected && !token) {
       return NextResponse.redirect(new URL('/login', request.url))
     }
     
     return NextResponse.next()
   }
   ```

**Complexity:** Medium | **Time:** 2-3 days | **Priority:** 🔥 Critical

---

### Priority 2: Important Features (Should Have)

#### 4. **Package Management System**
**Status:** Backend ⏳ TODO | Frontend ✅ Partial (display only)

**Existing Frontend Pages:**
- ✅ `/app/packages/page.tsx` - Package listing (mock data)
- ✅ `/app/packages/[id]/page.tsx` - Package details
- ✅ `/app/packages/[id]/booking/page.tsx` - Package booking
- ⏳ `/app/dashboard/vendor/packages/page.tsx` - **MISSING** (vendor management)
- ⏳ `/app/dashboard/admin/packages/page.tsx` - **MISSING** (admin approval)

**Required Backend Tasks (FIRST):**
1. **Create Package Service** (`backend/src/services/package.service.ts`)
   ```typescript
   import { PrismaClient } from '@prisma/client'
   
   const prisma = new PrismaClient()
   
   export class PackageService {
     static async getAllPackages(filters?: {
       destination?: string;
       minPrice?: number;
       maxPrice?: number;
       halalRating?: number;
       category?: string;
     }) {
       return await prisma.package.findMany({
         where: {
           status: 'active',
           ...(filters?.destination && { destination: filters.destination }),
           ...(filters?.minPrice && { price: { gte: filters.minPrice } }),
           ...(filters?.maxPrice && { price: { lte: filters.maxPrice } }),
           ...(filters?.halalRating && { halalRating: filters.halalRating }),
           ...(filters?.category && { category: filters.category })
         },
         include: {
           vendor: true,
           reviews: true
         }
       })
     }
     
     static async getPackageById(id: string) {
       return await prisma.package.findUnique({
         where: { id },
         include: {
           vendor: true,
           reviews: { include: { user: true } },
           bookings: { where: { userId: req.user.id } }
         }
       })
     }
     
     static async createPackage(data: PackageData, vendorId: string) {
       return await prisma.package.create({
         data: {
           ...data,
           vendorId,
           status: 'pending' // Admin approval required
         }
       })
     }
     
     static async updatePackage(id: string, data: Partial<PackageData>) {
       return await prisma.package.update({
         where: { id },
         data
       })
     }
     
     static async deletePackage(id: string) {
       return await prisma.package.delete({ where: { id } })
     }
     
     static async getVendorPackages(vendorId: string) {
       return await prisma.package.findMany({
         where: { vendorId },
         include: { bookings: true }
       })
     }
   }
   ```

2. **Implement Package Controllers**
   - Replace TODOs with service calls
   - Add validation for package data

**Required Frontend Tasks:**
1. **Create Package API Client** (`frontend/src/lib/api/packages.ts`)
   ```typescript
   export const packageAPI = {
     getAll: (filters?: PackageFilters) =>
       axios.get('/api/packages', { params: filters }),
     
     getById: (id: string) =>
       axios.get(`/api/packages/${id}`),
     
     create: (data: PackageData) =>
       axios.post('/api/packages', data, { headers: authHeaders }),
     
     update: (id: string, data: Partial<PackageData>) =>
       axios.put(`/api/packages/${id}`, data, { headers: authHeaders }),
     
     delete: (id: string) =>
       axios.delete(`/api/packages/${id}`, { headers: authHeaders })
   }
   ```

2. **Update Package List Page** (`app/packages/page.tsx`)
   - Replace mock data with `packageAPI.getAll()`
   - Implement filters (destination, price, rating)
   - Add search functionality

3. **Update Package Detail Page** (`app/packages/[id]/page.tsx`)
   - Fetch real data with `packageAPI.getById(id)`
   - Display reviews from database
   - Show vendor information

4. **Create Vendor Package Management** (`app/dashboard/vendor/packages/page.tsx`)
   - Display vendor's packages with `packageAPI.getAll({ vendorId })`
   - "Add Package" button → opens create form
   - "Edit" button → opens edit form with pre-filled data
   - "Delete" button → confirmation dialog → `packageAPI.delete(id)`
   - Show package status (pending/approved/rejected)

5. **Create Admin Package Approval** (`app/dashboard/admin/packages/page.tsx`)
   - Display all packages pending approval
   - "Approve" button → updates status to 'active'
   - "Reject" button → updates status to 'rejected' with reason
   - View package details before approval

**Complexity:** Medium | **Time:** 3 days | **Priority:** ⭐ Important

---

#### 5. **Customer Dashboard**
**Status:** Backend Mixed (Auth TODO, Bookings TODO) | Frontend ⏳ Structure Ready

**Required Pages:**
- ⏳ `/app/dashboard/customer/page.tsx` - Overview (bookings, saved trips)
- ⏳ `/app/dashboard/customer/bookings/page.tsx` - Booking history
- ⏳ `/app/dashboard/customer/saved/page.tsx` - Saved packages
- ⏳ `/app/dashboard/customer/reviews/page.tsx` - My reviews
- ⏳ `/app/dashboard/customer/profile/page.tsx` - Profile settings

**Features to Implement:**
1. **Booking History** 
   - Flight bookings from `flightAPI.listBookings()`
   - Hotel bookings from `hotelAPI.listOrders()`
   - Package bookings from `bookingAPI.getMyBookings()`
   - Filter by: Status, Date range, Type
   - Sort by: Date, Price, Status
   - Actions: View details, Download invoice, Cancel

2. **Saved Packages**
   - Save package to wishlist (needs backend API)
   - Display saved packages with cards
   - Remove from saved
   - "Book Now" button

3. **Profile Management**
   - View/edit personal information
   - Change password
   - Manage saved cards (future)
   - Notification preferences

**Complexity:** Medium | **Time:** 2-3 days | **Priority:** ⭐ Important

---

#### 6. **Vendor Dashboard**
**Status:** Backend ⏳ TODO | Frontend ⏳ Not Started

**Required Pages:**
- ⏳ `/app/dashboard/vendor/page.tsx` - Overview (sales, analytics)
- ⏳ `/app/dashboard/vendor/packages/page.tsx` - Package management
- ⏳ `/app/dashboard/vendor/bookings/page.tsx` - Package bookings
- ⏳ `/app/dashboard/vendor/analytics/page.tsx` - Sales analytics
- ⏳ `/app/dashboard/vendor/profile/page.tsx` - Business profile

**Features to Implement:**
1. **Package Management** (See #4 above)

2. **Booking Management**
   - View all bookings for vendor's packages
   - Filter by: Status, Date, Package
   - Actions: Confirm, Cancel, Contact customer
   - Download customer list

3. **Analytics Dashboard**
   - Total sales chart (daily/weekly/monthly)
   - Most popular packages
   - Revenue breakdown
   - Customer demographics
   - Booking trends

4. **Business Profile**
   - Company information
   - Bank details for payouts
   - Tax information
   - Logo & branding

**Complexity:** High | **Time:** 4-5 days | **Priority:** ⭐ Important

---

#### 7. **Admin Dashboard**
**Status:** Backend ⏳ TODO | Frontend ⏳ Not Started

**Required Pages:**
- ⏳ `/app/dashboard/admin/page.tsx` - Overview (platform stats)
- ⏳ `/app/dashboard/admin/packages/page.tsx` - Package approval (See #4)
- ⏳ `/app/dashboard/admin/vendors/page.tsx` - Vendor management
- ⏳ `/app/dashboard/admin/users/page.tsx` - User management
- ⏳ `/app/dashboard/admin/bookings/page.tsx` - All bookings
- ⏳ `/app/dashboard/admin/settings/page.tsx` - Platform settings

**Features to Implement:**
1. **Vendor Management**
   - Approve/reject vendor applications
   - View vendor performance
   - Suspend/activate vendor accounts
   - Payout management

2. **User Management**
   - View all users
   - Search and filter users
   - Suspend/activate accounts
   - View user booking history

3. **Platform Analytics**
   - Total revenue
   - Total bookings (flights, hotels, packages)
   - User growth
   - Vendor performance
   - Top destinations
   - Revenue by category

4. **Platform Settings**
   - Commission rates
   - Email templates
   - Payment gateway settings
   - Feature flags

**Complexity:** High | **Time:** 5-6 days | **Priority:** ⭐ Important

---

### Priority 3: Nice to Have Features

#### 8. **Payment Integration**
- CC Avenue integration (backend TODO)
- Payment flow UI
- Invoice generation
- Refund management

#### 9. **Reviews & Ratings**
- Add review form
- Display reviews on package detail page
- Rating aggregation
- Review moderation (admin)

#### 10. **Email Notifications**
- Booking confirmation emails
- Payment receipts
- Booking reminders
- Promotional emails

#### 11. **Search Enhancements**
- Search history
- Recent searches
- Price alerts
- Flexible dates

#### 12. **Additional Features**
- Multi-language support (Arabic/English)
- Currency converter
- Promo codes & discounts
- Referral program
- Travel insurance integration

---

## 🛠️ Implementation Recommendations

### Phase 1: Core Functionality (Weeks 1-2)
**Goal:** Make the app functional end-to-end

1. **Week 1: Authentication & Flight Booking**
   - ✅ Backend: Implement auth service & controllers
   - ✅ Frontend: Implement AuthContext & login/register
   - ✅ Frontend: Create flight API client
   - ✅ Frontend: Integrate flight search & results pages
   - ✅ Frontend: Create flight booking page
   - ✅ Test: Complete flight booking flow

2. **Week 2: Hotel Booking**
   - ✅ Frontend: Create hotel API client
   - ✅ Frontend: Create hotel search page
   - ✅ Frontend: Create hotel results page
   - ✅ Frontend: Create hotel detail page
   - ✅ Frontend: Create hotel booking page
   - ✅ Test: Complete hotel booking flow

**Deliverable:** Users can search & book flights and hotels

---

### Phase 2: Package System (Week 3)
**Goal:** Enable package browsing and booking

1. **Backend: Package Service**
   - Implement package CRUD operations
   - Add package filters and search
   - Implement vendor package management

2. **Frontend: Package Pages**
   - Update package list with real API
   - Update package detail with real API
   - Integrate package booking with checkout

3. **Frontend: Vendor Dashboard**
   - Create package management UI
   - Add/edit package forms
   - Package analytics

**Deliverable:** Vendors can manage packages, customers can book them

---

### Phase 3: Dashboards (Week 4)
**Goal:** Complete role-based dashboards

1. **Customer Dashboard**
   - Booking history (flights, hotels, packages)
   - Saved packages
   - Profile management

2. **Vendor Dashboard**
   - Package management
   - Booking management
   - Analytics

3. **Admin Dashboard**
   - Package approval
   - Vendor management
   - Platform analytics

**Deliverable:** All user roles have functional dashboards

---

### Phase 4: Payment & Notifications (Week 5)
**Goal:** Add payment processing and notifications

1. **Backend: Payment Service**
   - CC Avenue integration
   - Payment verification
   - Refund processing

2. **Backend: Email Service**
   - Booking confirmations
   - Payment receipts
   - Notifications

3. **Frontend: Payment Flow**
   - Payment gateway integration
   - Invoice download
   - Payment history

**Deliverable:** Complete payment flow with notifications

---

### Phase 5: Polish & Optimization (Week 6)
**Goal:** Improve UX and performance

1. **Testing**
   - Unit tests for services
   - Integration tests for API endpoints
   - E2E tests for critical flows

2. **Performance**
   - Image optimization
   - Code splitting
   - Caching strategies
   - Database query optimization

3. **UX Improvements**
   - Loading states
   - Error boundaries
   - Toast notifications
   - Form validation

4. **Additional Features**
   - Reviews & ratings
   - Search enhancements
   - Multi-language support

**Deliverable:** Production-ready application

---

## 📝 Key Technical Decisions

### 1. **Sync vs Async APIs for Hotels**
**Recommendation:** Use Sync APIs by default

- **Sync APIs:** Faster, simpler, better UX for most searches
- **Async APIs:** Use only when:
  - Large number of hotels (>100)
  - Complex filters
  - Long date ranges

**Implementation:**
```typescript
// Start with sync
const results = await hotelAPI.searchSync(params)

// If results say "use async", switch:
if (results.recommendAsync) {
  const { sId } = await hotelAPI.searchAsync(params)
  // Poll for results
  const results = await pollUntilComplete(sId)
}
```

### 2. **Authentication Strategy**
**Recommendation:** JWT + Refresh Token

- **Access Token:** 1 hour expiry, stored in memory
- **Refresh Token:** 7 days expiry, stored in httpOnly cookie
- **Middleware:** Verify token on protected routes
- **Auto-refresh:** Frontend axios interceptor refreshes token if expired

### 3. **State Management**
**Recommendation:** React Context + SWR

- **Global State:** AuthContext, CartContext (React Context)
- **Server State:** SWR for data fetching, caching, revalidation
- **Form State:** React Hook Form with Zod validation
- **URL State:** Next.js router for search params

### 4. **Error Handling**
**Recommendation:** Global error boundary + toast notifications

```typescript
// API client with interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
      router.push('/login')
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission')
    } else {
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
    return Promise.reject(error)
  }
)
```

### 5. **Database Strategy**
**Recommendation:** Prisma ORM + PostgreSQL (Supabase)

**Why:**
- ✅ Type-safe database queries
- ✅ Auto-generated TypeScript types
- ✅ Migration system
- ✅ Excellent developer experience

**Setup:**
```bash
# Already done
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma studio  # Visual database editor
```

---

## 🎨 UI/UX Recommendations

### 1. **Loading States**
- **Search:** Progress bar showing "Searching 1000+ flights..."
- **Polling:** Spinner with status text "Fetching results... (5s)"
- **Booking:** Multi-step progress indicator
- **Skeleton:** Use skeleton screens for cards

### 2. **Error States**
- **Empty State:** "No results found. Try adjusting filters"
- **Error State:** "Something went wrong. Try again"
- **Expired Session:** "Search expired. Please search again"
- **Network Error:** "Connection lost. Check your internet"

### 3. **Success States**
- **Booking Success:** Confetti animation + confirmation card
- **Payment Success:** Green checkmark + invoice download
- **Save Package:** Toast notification "Package saved!"

### 4. **Responsive Design**
- **Mobile First:** Optimize for mobile (60% traffic)
- **Tablet:** Adjust grid layouts for tablets
- **Desktop:** Multi-column layouts, sidebar filters

### 5. **Accessibility**
- **Keyboard Navigation:** Tab through all interactive elements
- **Screen Readers:** Proper ARIA labels
- **Color Contrast:** WCAG AA compliant
- **Focus Indicators:** Clear focus states

---

## 🚀 Getting Started Checklist

### Backend Setup
- [x] Dependencies installed (`npm install`)
- [x] Prisma generated (`npx prisma generate`)
- [ ] Database connected (update `.env` with DATABASE_URL)
- [ ] Database migrated (`npx prisma migrate dev`)
- [ ] Seed data created (`npx prisma db seed`)
- [ ] Almosafer credentials (update `.env`)
- [ ] JWT secret (update `.env`)
- [x] Server running (`npm run dev`)

### Frontend Setup
- [x] Dependencies installed
- [x] Environment variables (`.env.local`)
- [x] Development server running (`npm run dev`)
- [ ] Create API client files
- [ ] Implement AuthContext
- [ ] Create protected route middleware

### Priority 1 Tasks (This Week)
1. [ ] Implement auth service (backend)
2. [ ] Implement auth controllers (backend)
3. [ ] Create auth API client (frontend)
4. [ ] Implement AuthContext (frontend)
5. [ ] Create flight API client (frontend)
6. [ ] Integrate flight search page
7. [ ] Integrate flight results page
8. [ ] Create flight booking page

---

## 📊 Success Metrics

### Technical Metrics
- **API Response Time:** < 500ms average
- **Page Load Time:** < 2s on 3G
- **TypeScript Coverage:** 100% (strict mode)
- **Test Coverage:** > 80%
- **Lighthouse Score:** > 90

### Business Metrics
- **Conversion Rate:** % of searches → bookings
- **Booking Success Rate:** % of booking attempts successful
- **User Retention:** % of users who return
- **Average Order Value:** Total revenue / bookings
- **Customer Satisfaction:** Rating + reviews

---

## 🤝 Need Help?

**Documentation:**
- [ALMOSAFER_API_COMPLETE.md](./ALMOSAFER_API_COMPLETE.md) - All 36 API endpoints
- [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md) - Security best practices
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Complete project structure

**Key Files:**
- **Backend:** All services in `backend/src/services/`
- **Frontend:** Context in `frontend/context/`
- **Database:** Schema in `backend/prisma/schema.prisma`

**Next Steps:**
1. Review this document
2. Start with Phase 1, Week 1
3. Create feature branches for each task
4. Test thoroughly before merging
5. Deploy to staging environment

---

**✨ Let's build an amazing Halal travel platform! ✨**
