# Halal Travels - Backend Setup Guide

## 🎯 Prisma ORM Integration

This backend uses **Prisma ORM** as the single source of truth for database operations, integrated with **Supabase PostgreSQL**.

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Supabase)
- Supabase project credentials

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `@prisma/client` - Prisma database client
- `prisma` - Prisma CLI (dev dependency)
- `zod` - Runtime validation
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `express-validator` - Request validation

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your credentials:

```bash
cp .env.example .env
```

**Required Configuration:**

```env
# Supabase Database URL
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Supabase API
SUPABASE_URL="https://[project-ref].supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Almosafer API Credentials
ALMOSAFER_CLIENT_ID="your-client-id"
ALMOSAFER_CLIENT_SECRET="your-client-secret"
ALMOSAFER_API_KEY="your-api-key"
```

### 3. Initialize Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database (first time)
npm run db:push

# OR create a migration (recommended for production)
npm run prisma:migrate
```

### 4. Seed Sample Data (Optional)

```bash
npm run prisma:seed
```

This creates:
- ✅ Test user (test@halaltravels.com)
- ✅ Sample flight booking
- ✅ Sample hotel booking

### 5. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3001`

## 📊 Database Schema Overview

### Core Tables

#### 1. **Users**
```prisma
model User {
  id         String   @id @default(uuid())
  email      String   @unique
  firstName  String?
  lastName   String?
  telephone  String?
  nationality String?
  residency  String?
}
```

#### 2. **FlightBooking** (Single Source of Truth)
```prisma
model FlightBooking {
  id            String   @id @default(uuid())
  
  // Mandatory Almosafer IDs
  sId           String   @db.Uuid  // Search ID
  bId           String   @unique @db.Uuid  // Booking ID
  
  // Pricing
  currency      String
  totalAmount   Decimal
  baseAmount    Decimal?
  taxAmount     Decimal?
  
  // Status
  bookingStatus String   // PENDING, CONFIRMED, CANCELLED
  
  // JSONB Fields (Flexibility)
  searchQuery   Json     // Original search
  searchResult  Json?    // Full Almosafer response
  pricingDetails Json?   // Pricing breakdown
  bookingData   Json?    // Final booking data
  
  // Relations
  passengers    FlightPassenger[]
}
```

#### 3. **FlightPassenger** (Exact Almosafer Schema)
```prisma
model FlightPassenger {
  id                     String   @id @default(uuid())
  passengerIndex         Int
  type                   String   // ADT, CHD, INF
  
  // Personal Info (Almosafer API fields)
  title                  String   // Mr, Mrs, Ms
  firstName              String
  lastName               String
  dateOfBirth            DateTime
  
  // Contact
  isPrimaryContact       Boolean
  email                  String?
  telephone              String?
  
  // Identification
  idType                 String   // PASSPORT, NATIONAL_ID
  idNumber               String
  idExpiryDate           DateTime?
  nationality            String   // ISO alpha-2
  documentIssuingCountry String
  
  // Ticketing
  eTicketNumber          String?
  pnr                    String?
  ticketStatus           String?
  
  // JSONB for nested data
  frequentFlyerPrograms  Json?
  selectedAddOns         Json?
}
```

#### 4. **HotelBooking**
```prisma
model HotelBooking {
  id                String   @id @default(uuid())
  
  // Almosafer IDs
  sId               String   @db.Uuid
  pId               String?  @db.Uuid  // Pricing ID
  bId               String   @unique @db.Uuid
  
  // Hotel Info
  hotelId           String
  bookingReference  String?
  
  // Pricing
  currency          String
  totalAmount       Decimal
  netPrice          Decimal?
  vatAmount         Decimal?
  
  // Stay Details
  checkInDate       DateTime
  checkOutDate      DateTime
  numberOfRooms     Int
  numberOfNights    Int
  
  // JSONB Fields
  searchQuery       Json
  packageDetails    Json
  availabilityData  Json?
  
  // Relations
  guests            HotelGuest[]
}
```

#### 5. **HotelGuest** (Almosafer PersonalDetails)
```prisma
model HotelGuest {
  id         String   @id @default(uuid())
  
  // IDs from Almosafer
  paxId      String   @db.Uuid
  roomId     String   @db.Uuid
  isLeadGuest Boolean
  
  // Personal Details (exact Almosafer schema)
  email      String
  telephone  String
  namePrefix String   // Mr, Mrs, Ms, Dr
  givenName  String
  surname    String
  age        Int?
  type       String   // "0" adult, "1" child
  
  // JSONB for address
  address    Json
}
```

#### 6. **PaymentTransaction**
```prisma
model PaymentTransaction {
  id              String   @id @default(uuid())
  bookingType     String   // FLIGHT, HOTEL
  bookingId       String
  
  // CC Avenue
  gatewayOrderId  String?  @unique
  gatewayStatus   String?
  
  // Amount
  amount          Decimal
  currency        String
  status          String   // INITIATED, COMPLETED, FAILED
}
```

## 🛠️ Prisma Commands

### Development

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create and apply migration
npm run prisma:migrate

# Push schema without migration (dev)
npm run db:push

# Open Prisma Studio (GUI)
npm run prisma:studio

# Seed database
npm run prisma:seed

# Reset database
npm run db:reset
```

### Production

```bash
# Deploy migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
```

## 🔄 Migration Workflow

### Creating a Migration

1. **Modify** `prisma/schema.prisma`
2. **Run migration:**
   ```bash
   npm run prisma:migrate
   ```
3. **Name your migration** (e.g., "add_payment_table")
4. Prisma will:
   - Generate SQL migration file
   - Apply to database
   - Update Prisma Client

### Viewing Migration History

```bash
npx prisma migrate status
```

## 📝 Usage Examples

### 1. Create Flight Booking

```typescript
import prisma from './lib/prisma'

const booking = await prisma.flightBooking.create({
  data: {
    sId: searchId,
    bId: bookingId,
    currency: 'SAR',
    totalAmount: 543,
    bookingStatus: 'PENDING',
    searchQuery: { /* search params */ },
    contactEmail: 'user@example.com',
    contactPhone: '+966501234567',
    contactFirstName: 'Ahmed',
    contactLastName: 'Al-Rashid',
    passengers: {
      create: [
        {
          passengerIndex: 0,
          type: 'ADT',
          title: 'Mr',
          firstName: 'Ahmed',
          lastName: 'Al-Rashid',
          dateOfBirth: new Date('1990-01-01'),
          idType: 'PASSPORT',
          idNumber: 'P12345678',
          nationality: 'SA',
          documentIssuingCountry: 'SA',
        }
      ]
    }
  },
  include: {
    passengers: true
  }
})
```

### 2. Query Bookings

```typescript
// Get user bookings
const userBookings = await prisma.flightBooking.findMany({
  where: { userId: user.id },
  include: { passengers: true },
  orderBy: { createdAt: 'desc' }
})

// Get booking by bId (Almosafer Booking ID)
const booking = await prisma.flightBooking.findUnique({
  where: { bId: almosaferBookingId },
  include: { passengers: true }
})

// Search bookings
const bookings = await prisma.flightBooking.findMany({
  where: {
    bookingStatus: 'CONFIRMED',
    departureDate: {
      gte: new Date()
    }
  }
})
```

### 3. Update Booking Status

```typescript
await prisma.flightBooking.update({
  where: { bId: bookingId },
  data: {
    bookingStatus: 'CONFIRMED',
    bookedAt: new Date(),
    bookingData: almosaferResponse
  }
})
```

### 4. Create Hotel Booking with Guests

```typescript
const hotelBooking = await prisma.hotelBooking.create({
  data: {
    sId: searchId,
    bId: bookingId,
    hotelId: '1404585',
    currency: 'SAR',
    totalAmount: 450,
    checkInDate: new Date('2026-03-15'),
    checkOutDate: new Date('2026-03-18'),
    numberOfRooms: 1,
    numberOfNights: 3,
    searchQuery: { /* ... */ },
    packageDetails: { /* ... */ },
    guests: {
      create: [
        {
          paxId: guestId,
          roomId: roomId,
          isLeadGuest: true,
          email: 'guest@example.com',
          telephone: '+966501234567',
          namePrefix: 'Mr',
          givenName: 'Ahmed',
          surname: 'Al-Rashid',
          type: '0',
          address: {
            street: '123 Main St',
            city: 'Riyadh',
            country: 'SA',
            postalCode: '11564'
          }
        }
      ]
    }
  },
  include: { guests: true }
})
```

## 🔐 Type Safety

Prisma generates TypeScript types automatically:

```typescript
import { FlightBooking, FlightPassenger } from '@prisma/client'

// Type-safe queries
type BookingWithPassengers = FlightBooking & {
  passengers: FlightPassenger[]
}

const booking: BookingWithPassengers = await prisma.flightBooking.findUnique({
  where: { bId },
  include: { passengers: true }
})
```

## 🎯 Design Decisions

### 1. **Mandatory Fields from Almosafer**
- ✅ `sId` (Search ID) - Always stored
- ✅ `bId` (Booking ID) - Unique, indexed
- ✅ Passenger details match API exactly

### 2. **JSONB for Flexibility**
- `searchQuery` - Original search parameters
- `searchResult` - Full API response (for auditing)
- `pricingDetails` - Pricing breakdown
- `bookingData` - Complete booking response
- `address` - Guest address structure

### 3. **Separate Passenger/Guest Tables**
- Normalized data
- Easy to query individual travelers
- Supports multiple passengers per booking

### 4. **Status Tracking**
- Flight: `PENDING` → `CONFIRMED` → `CANCELLED`
- Payment: `INITIATED` → `COMPLETED` → `FAILED`
- PNR status from airline

### 5. **Audit Logging**
- `ApiLog` table for all API calls
- Request/response tracking
- Error monitoring

## 🔍 Prisma Studio

Visual database browser:

```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

Features:
- Browse tables
- Edit records
- Query data
- View relationships

## 📚 Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase + Prisma Guide](https://supabase.com/docs/guides/integrations/prisma)
- [Schema Reference](./prisma/schema.prisma)

## ✅ Next Steps

1. ✅ Schema created with all Almosafer fields
2. ✅ Prisma client configured
3. ✅ Seed data ready
4. 🔄 Create API endpoints for bookings
5. 🔄 Integrate with Almosafer API
6. 🔄 Add payment processing

---

**Database is now ready!** The schema mirrors the Almosafer API structure exactly, with `sId` and `bId` as mandatory fields, and flexible JSONB for nested data.
