import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create a test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@halaltravels.com' },
    update: {},
    create: {
      email: 'test@halaltravels.com',
      firstName: 'Ahmed',
      lastName: 'Al-Rashid',
      telephone: '+966501234567',
      nationality: 'SA',
      residency: 'SA',
    },
  })

  console.log('✅ Created test user:', testUser.email)

  // Create a sample flight booking
  const sampleFlightBooking = await prisma.flightBooking.create({
    data: {
      sId: '8e508228-a7d9-4c25-8553-764d7269cd62',
      bId: 'fb123456-7890-1234-5678-90abcdef1234',
      currency: 'SAR',
      totalAmount: 543,
      baseAmount: 450,
      taxAmount: 73,
      serviceFee: 20,
      bookingStatus: 'CONFIRMED',
      searchQuery: {
        segments: [
          {
            from: 'RUH',
            to: 'DXB',
            departureDate: '2026-03-15',
          },
        ],
        travellers: {
          adult: 1,
          child: 0,
          infant: 0,
        },
        cabinClass: 'ECONOMY',
      },
      itineraryId: '2bcdda57,af8ca8cdXY-ba06b792_XY_ONE',
      airline: 'XY',
      origin: 'RUH',
      destination: 'DXB',
      departureDate: new Date('2026-03-15T08:00:00Z'),
      cabinClass: 'ECONOMY',
      contactEmail: 'test@halaltravels.com',
      contactPhone: '+966501234567',
      contactFirstName: 'Ahmed',
      contactLastName: 'Al-Rashid',
      userId: testUser.id,
      passengers: {
        create: [
          {
            passengerIndex: 0,
            type: 'ADT',
            title: 'Mr',
            firstName: 'Ahmed',
            lastName: 'Al-Rashid',
            dateOfBirth: new Date('1990-05-15'),
            isPrimaryContact: true,
            email: 'test@halaltravels.com',
            telephone: '+966501234567',
            idType: 'PASSPORT',
            idNumber: 'P12345678',
            idExpiryDate: new Date('2028-12-31'),
            nationality: 'SA',
            documentIssuingCountry: 'SA',
            eTicketNumber: '6071234567890',
            pnr: 'ABC123',
            ticketStatus: 'TICKETED',
          },
        ],
      },
    },
  })

  console.log('✅ Created sample flight booking:', sampleFlightBooking.bId)

  // Create a sample hotel booking
  const sampleHotelBooking = await prisma.hotelBooking.create({
    data: {
      sId: '855e13c7-0f9c-4051-8df6-7f2f3ccf4dd6',
      bId: 'hb123456-7890-1234-5678-90abcdef5678',
      hotelId: '1404585',
      hotelName: 'Luxury Hotel Dubai',
      countryCode: 'AE',
      bookingReference: 'CONF123456',
      currency: 'SAR',
      totalAmount: 450,
      netPrice: 380,
      vatAmount: 70,
      bookingStatus: 'CONFIRMED',
      checkInDate: new Date('2026-03-15'),
      checkOutDate: new Date('2026-03-18'),
      numberOfRooms: 1,
      numberOfNights: 3,
      searchQuery: {
        currency: 'SAR',
        nationality: 'SA',
        residency: 'SA',
        checkIn: '2026-03-15',
        checkOut: '2026-03-18',
        roomsInfo: [
          {
            adultsCount: 2,
            kidsAges: [],
          },
        ],
      },
      packageDetails: {
        packageId: '534992f8-4833-4951-bad1-ee612a555ef6',
        refundability: 'Refundable',
        roomBasis: 'Room Only',
      },
      userId: testUser.id,
      guests: {
        create: [
          {
            paxId: '11111111-1111-1111-1111-111111111111',
            roomId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            isLeadGuest: true,
            email: 'test@halaltravels.com',
            telephone: '+966501234567',
            namePrefix: 'Mr',
            givenName: 'Ahmed',
            surname: 'Al-Rashid',
            type: '0',
            address: {
              street: '123 King Fahd Road',
              city: 'Riyadh',
              state: 'Riyadh',
              country: 'SA',
              postalCode: '11564',
            },
          },
          {
            paxId: '22222222-2222-2222-2222-222222222222',
            roomId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            isLeadGuest: false,
            email: 'fatima@example.com',
            telephone: '+966509876543',
            namePrefix: 'Mrs',
            givenName: 'Fatima',
            surname: 'Al-Rashid',
            type: '0',
            address: {
              street: '123 King Fahd Road',
              city: 'Riyadh',
              state: 'Riyadh',
              country: 'SA',
              postalCode: '11564',
            },
          },
        ],
      },
    },
  })

  console.log('✅ Created sample hotel booking:', sampleHotelBooking.bId)

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
