-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "supabaseId" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "telephone" TEXT,
    "nationality" TEXT,
    "residency" TEXT,
    "role" TEXT NOT NULL DEFAULT 'customer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "originalPrice" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'SAR',
    "category" TEXT NOT NULL DEFAULT 'best',
    "description" TEXT NOT NULL,
    "highlights" JSONB NOT NULL DEFAULT '[]',
    "included" JSONB NOT NULL DEFAULT '[]',
    "itinerary" JSONB NOT NULL DEFAULT '[]',
    "features" JSONB NOT NULL DEFAULT '[]',
    "images" JSONB NOT NULL DEFAULT '[]',
    "coverImage" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT 'PACKAGE',
    "discountType" TEXT NOT NULL DEFAULT 'PERCENT',
    "discountValue" DECIMAL(10,2) NOT NULL,
    "minOrderValue" DECIMAL(10,2),
    "maxDiscount" DECIMAL(10,2),
    "usageLimit" INTEGER,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "perUserLimit" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT NOT NULL DEFAULT '',
    "caption" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_enquiries" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "packageDestination" TEXT NOT NULL,
    "packageDetails" JSONB NOT NULL,
    "userId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "nationality" TEXT,
    "travelDate" TIMESTAMP(3),
    "flexibleDates" BOOLEAN NOT NULL DEFAULT false,
    "adults" INTEGER NOT NULL DEFAULT 2,
    "children" INTEGER NOT NULL DEFAULT 0,
    "infants" INTEGER NOT NULL DEFAULT 0,
    "specialRequests" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "basePrice" DECIMAL(10,2),
    "markupPercentage" DECIMAL(5,2),
    "markupAmount" DECIMAL(10,2),
    "totalPrice" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'SAR',
    "adminNotes" TEXT,
    "quotedAt" TIMESTAMP(3),
    "quoteValidUntil" TIMESTAMP(3),
    "ccavenueOrderId" TEXT,
    "paymentStatus" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "package_enquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight_searches" (
    "id" TEXT NOT NULL,
    "sId" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3),
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "infants" INTEGER NOT NULL DEFAULT 0,
    "cabinClass" TEXT NOT NULL DEFAULT 'ECONOMY',
    "results" JSONB,
    "resultsExpiry" TIMESTAMP(3),
    "userId" TEXT,
    "sessionToken" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flight_searches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight_bookings" (
    "id" TEXT NOT NULL,
    "sId" TEXT NOT NULL,
    "bId" TEXT NOT NULL,
    "pricingId" TEXT,
    "reservationId" TEXT,
    "dsOrderNumber" TEXT,
    "internalReference" TEXT,
    "currency" TEXT NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "baseAmount" DECIMAL(10,2),
    "taxAmount" DECIMAL(10,2),
    "vatAmount" DECIMAL(10,2),
    "serviceFee" DECIMAL(10,2),
    "bookingStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "pnrStatus" TEXT,
    "searchQuery" JSONB NOT NULL,
    "searchResult" JSONB,
    "pricingDetails" JSONB,
    "reservationData" JSONB,
    "bookingData" JSONB,
    "itineraryId" TEXT,
    "fareId" TEXT,
    "airline" TEXT,
    "origin" TEXT,
    "destination" TEXT,
    "departureDate" TIMESTAMP(3),
    "returnDate" TIMESTAMP(3),
    "cabinClass" TEXT,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "contactFirstName" TEXT NOT NULL,
    "contactLastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bookedAt" TIMESTAMP(3),
    "userId" TEXT,

    CONSTRAINT "flight_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight_passengers" (
    "id" TEXT NOT NULL,
    "passengerIndex" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "isPrimaryContact" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "telephone" TEXT,
    "idType" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "idIssueDate" TIMESTAMP(3),
    "idExpiryDate" TIMESTAMP(3),
    "nationality" TEXT NOT NULL,
    "documentIssuingCountry" TEXT NOT NULL,
    "eTicketNumber" TEXT,
    "pnr" TEXT,
    "ticketStatus" TEXT,
    "frequentFlyerPrograms" JSONB,
    "selectedAddOns" JSONB,
    "requiredInformation" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bookingId" TEXT NOT NULL,

    CONSTRAINT "flight_passengers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_bookings" (
    "id" TEXT NOT NULL,
    "sId" UUID NOT NULL,
    "pId" UUID,
    "bId" UUID NOT NULL,
    "spId" UUID,
    "hotelId" TEXT NOT NULL,
    "hotelName" TEXT,
    "countryCode" TEXT,
    "bookingReference" TEXT,
    "dsOrderNumber" TEXT,
    "internalReference" TEXT,
    "segmentNumber" TEXT,
    "currency" TEXT NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "netPrice" DECIMAL(10,2),
    "vatAmount" DECIMAL(10,2),
    "sellingPriceMandatory" BOOLEAN NOT NULL DEFAULT false,
    "bookingStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "pollingStatus" TEXT,
    "checkInDate" TIMESTAMP(3) NOT NULL,
    "checkOutDate" TIMESTAMP(3) NOT NULL,
    "numberOfRooms" INTEGER NOT NULL DEFAULT 1,
    "numberOfNights" INTEGER NOT NULL,
    "searchQuery" JSONB NOT NULL,
    "searchResult" JSONB,
    "availabilityData" JSONB,
    "packageDetails" JSONB NOT NULL,
    "bookingData" JSONB,
    "cancellationPolicy" JSONB,
    "agentRemarks" TEXT,
    "bookingRemarks" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bookedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "userId" TEXT,

    CONSTRAINT "hotel_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_guests" (
    "id" TEXT NOT NULL,
    "paxId" UUID NOT NULL,
    "roomId" UUID NOT NULL,
    "isLeadGuest" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "namePrefix" TEXT NOT NULL,
    "givenName" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "age" INTEGER,
    "type" TEXT NOT NULL,
    "address" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bookingId" TEXT NOT NULL,

    CONSTRAINT "hotel_guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" TEXT NOT NULL,
    "bookingType" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "gatewayOrderId" TEXT,
    "gatewayTrackingId" TEXT,
    "gatewayStatus" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "cardLast4" TEXT,
    "cardBrand" TEXT,
    "status" TEXT NOT NULL DEFAULT 'INITIATED',
    "gatewayResponse" JSONB,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_logs" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "requestBody" JSONB,
    "requestHeaders" JSONB,
    "responseStatus" INTEGER NOT NULL,
    "responseBody" JSONB,
    "responseTime" INTEGER,
    "userId" TEXT,
    "bookingId" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_supabaseId_key" ON "users"("supabaseId");

-- CreateIndex
CREATE INDEX "packages_category_idx" ON "packages"("category");

-- CreateIndex
CREATE INDEX "packages_isActive_idx" ON "packages"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- CreateIndex
CREATE INDEX "coupons_code_idx" ON "coupons"("code");

-- CreateIndex
CREATE INDEX "coupons_isActive_idx" ON "coupons"("isActive");

-- CreateIndex
CREATE INDEX "hero_images_isActive_idx" ON "hero_images"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "package_enquiries_ccavenueOrderId_key" ON "package_enquiries"("ccavenueOrderId");

-- CreateIndex
CREATE INDEX "package_enquiries_userId_idx" ON "package_enquiries"("userId");

-- CreateIndex
CREATE INDEX "package_enquiries_status_idx" ON "package_enquiries"("status");

-- CreateIndex
CREATE INDEX "package_enquiries_customerEmail_idx" ON "package_enquiries"("customerEmail");

-- CreateIndex
CREATE INDEX "package_enquiries_packageId_idx" ON "package_enquiries"("packageId");

-- CreateIndex
CREATE UNIQUE INDEX "flight_searches_sId_key" ON "flight_searches"("sId");

-- CreateIndex
CREATE INDEX "flight_searches_sId_idx" ON "flight_searches"("sId");

-- CreateIndex
CREATE INDEX "flight_searches_userId_idx" ON "flight_searches"("userId");

-- CreateIndex
CREATE INDEX "flight_searches_sessionToken_idx" ON "flight_searches"("sessionToken");

-- CreateIndex
CREATE INDEX "flight_searches_createdAt_idx" ON "flight_searches"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "flight_bookings_bId_key" ON "flight_bookings"("bId");

-- CreateIndex
CREATE INDEX "flight_bookings_sId_idx" ON "flight_bookings"("sId");

-- CreateIndex
CREATE INDEX "flight_bookings_bId_idx" ON "flight_bookings"("bId");

-- CreateIndex
CREATE INDEX "flight_bookings_bookingStatus_idx" ON "flight_bookings"("bookingStatus");

-- CreateIndex
CREATE INDEX "flight_bookings_userId_idx" ON "flight_bookings"("userId");

-- CreateIndex
CREATE INDEX "flight_bookings_createdAt_idx" ON "flight_bookings"("createdAt");

-- CreateIndex
CREATE INDEX "flight_passengers_bookingId_idx" ON "flight_passengers"("bookingId");

-- CreateIndex
CREATE INDEX "flight_passengers_type_idx" ON "flight_passengers"("type");

-- CreateIndex
CREATE INDEX "flight_passengers_email_idx" ON "flight_passengers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "hotel_bookings_bId_key" ON "hotel_bookings"("bId");

-- CreateIndex
CREATE INDEX "hotel_bookings_sId_idx" ON "hotel_bookings"("sId");

-- CreateIndex
CREATE INDEX "hotel_bookings_bId_idx" ON "hotel_bookings"("bId");

-- CreateIndex
CREATE INDEX "hotel_bookings_hotelId_idx" ON "hotel_bookings"("hotelId");

-- CreateIndex
CREATE INDEX "hotel_bookings_bookingStatus_idx" ON "hotel_bookings"("bookingStatus");

-- CreateIndex
CREATE INDEX "hotel_bookings_userId_idx" ON "hotel_bookings"("userId");

-- CreateIndex
CREATE INDEX "hotel_bookings_checkInDate_idx" ON "hotel_bookings"("checkInDate");

-- CreateIndex
CREATE INDEX "hotel_guests_bookingId_idx" ON "hotel_guests"("bookingId");

-- CreateIndex
CREATE INDEX "hotel_guests_paxId_idx" ON "hotel_guests"("paxId");

-- CreateIndex
CREATE INDEX "hotel_guests_email_idx" ON "hotel_guests"("email");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_gatewayOrderId_key" ON "payment_transactions"("gatewayOrderId");

-- CreateIndex
CREATE INDEX "payment_transactions_bookingId_idx" ON "payment_transactions"("bookingId");

-- CreateIndex
CREATE INDEX "payment_transactions_gatewayOrderId_idx" ON "payment_transactions"("gatewayOrderId");

-- CreateIndex
CREATE INDEX "payment_transactions_status_idx" ON "payment_transactions"("status");

-- CreateIndex
CREATE INDEX "api_logs_endpoint_idx" ON "api_logs"("endpoint");

-- CreateIndex
CREATE INDEX "api_logs_userId_idx" ON "api_logs"("userId");

-- CreateIndex
CREATE INDEX "api_logs_createdAt_idx" ON "api_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "package_enquiries" ADD CONSTRAINT "package_enquiries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_searches" ADD CONSTRAINT "flight_searches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_bookings" ADD CONSTRAINT "flight_bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_bookings" ADD CONSTRAINT "flight_bookings_sId_fkey" FOREIGN KEY ("sId") REFERENCES "flight_searches"("sId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_passengers" ADD CONSTRAINT "flight_passengers_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "flight_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_bookings" ADD CONSTRAINT "hotel_bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_guests" ADD CONSTRAINT "hotel_guests_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "hotel_bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
