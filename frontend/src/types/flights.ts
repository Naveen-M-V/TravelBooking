import { z } from 'zod'
import { ErrorDtoSchema, PriceSchema, ContactDetailsSchema } from './common'

// ============================================================================
// Flight Search Types
// ============================================================================

export const FlightSegmentRequestSchema = z.object({
  from: z.string(),
  to: z.string(),
  departureDate: z.string(), // YYYY-MM-DD
})

export const FlightTravellersSchema = z.object({
  adult: z.number().min(1),
  child: z.number().min(0).default(0),
  infant: z.number().min(0).default(0),
})

export const FlightSearchRequestSchema = z.object({
  segments: z.array(FlightSegmentRequestSchema).min(1),
  travellers: FlightTravellersSchema,
  cabinClass: z.enum(['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST']),
})

export const FlightSearchResponseSchema = z.object({
  sId: z.string().uuid(),
})

// ============================================================================
// Flight Search Result Types
// ============================================================================

export const BaggageInfoSchema = z.object({
  id: z.string(),
  cabinWeight: z.number().optional(),
  cabinUnit: z.string().optional(),
  cabinDimensions: z.string().optional(),
  checkInWeight: z.number().optional(),
  checkInUnit: z.string().optional(),
  checkInDimensions: z.string().optional(),
  underSeatWeight: z.number().optional(),
  underSeatUnit: z.string().optional(),
  underSeatDimensions: z.string().optional(),
  extraBaggageAvailable: z.boolean().optional(),
})

export const FareInfoSchema = z.object({
  id: z.string(),
  cabin: z.string(),
  availability: z.number().optional(),
  fareBasis: z.string().optional(),
  classOfLeg: z.string().optional(),
  fareFamilyName: z.string().optional(),
  fareFamilyCode: z.string().optional(),
  baggage: BaggageInfoSchema.optional(),
})

export const SegmentSchema = z.object({
  id: z.string(),
  origin: z.string(),
  destination: z.string(),
  departureTerminal: z.string().optional(),
  departureDate: z.string(),
  arrivalTerminal: z.string().optional(),
  arrivalDate: z.string(),
  durationMinutes: z.number(),
  flightCode: z.string(),
  validator: z.string().optional(),
  operator: z.string().optional(),
  airline: z.string(),
})

export const StopDetailSchema = z.object({
  airport: z.string(),
  durationMinutes: z.number(),
  type: z.string(),
  position: z.string(),
  segmentRef: z.string(),
})

export const SegmentReferenceSchema = z.object({
  segmentIndex: z.number(),
  segmentRef: z.string(),
  fareInfoRef: z.string(),
})

export const FlightSchema = z.object({
  flightIndex: z.number(),
  id: z.string(),
  segmentsReference: z.array(SegmentReferenceSchema),
  stopDetails: z.array(StopDetailSchema).optional(),
})

export const ItinerarySchema = z.object({
  id: z.string(),
  airline: z.string(),
  price: PriceSchema,
  flights: z.array(FlightSchema),
  hasFareFamilies: z.boolean().optional(),
  direction: z.string().optional(),
  airlineGroup: z.string().optional(),
})

export const FlightSearchPollingResponseSchema = z.object({
  status: z.enum(['INPROGRESS', 'COMPLETED', 'FAILED']),
  meta: z.object({
    sId: z.string().uuid(),
    totalResults: z.number(),
    currency: z.string(),
    searchQuery: FlightSearchRequestSchema,
  }),
  data: z.object({
    itineraries: z.array(ItinerarySchema).optional(),
    segments: z.array(SegmentSchema).optional(),
    fareInfo: z.array(FareInfoSchema).optional(),
  }),
})

// ============================================================================
// Fare Families Types
// ============================================================================

export const ChargesSchema = z.object({
  airportCheckin: z.number(),
  onlineCheckin: z.number(),
  flightChange: z.number(),
  flightChangeTimeBeforeDeparture: z.number(),
  cancellation: z.number(),
  cancellationTimeBeforeDeparture: z.number(),
  currency: z.string(),
})

export const FareFamilySchema = z.object({
  name: z.string(),
  code: z.string(),
  baggageInfo: BaggageInfoSchema,
  charges: ChargesSchema,
})

export const FareFamilyDetailSchema = z.object({
  itineraryId: z.string(),
  totalPrice: z.number(),
  flights: z.array(z.object({
    id: z.string(),
    fareFamilyName: z.string(),
    fareFamilyCode: z.string(),
    baggageInfo: BaggageInfoSchema,
    charges: ChargesSchema,
    refundableCode: z.string(),
  })),
})

export const FlightFareFamiliesResponseSchema = z.object({
  status: z.string(),
  errors: z.array(z.string()).optional(),
  meta: z.object({
    sId: z.string().uuid(),
    currency: z.string(),
    originalItineraryId: z.string(),
  }),
  data: z.object({
    fareFamilies: z.array(FareFamilyDetailSchema).optional(),
  }),
})

// ============================================================================
// Pricing Types
// ============================================================================

export const ExtraBaggageOptionSchema = z.object({
  code: z.number(),
  maxQuantity: z.number(),
  price: z.number(),
  currency: z.string(),
  weight: z.number(),
})

export const AddOnsSchema = z.object({
  extraBaggage: z.array(z.object({
    flightId: z.string(),
    options: z.array(ExtraBaggageOptionSchema),
  })).optional(),
})

export const TravellerPricingSchema = z.object({
  index: z.number(),
  type: z.enum(['ADT', 'CHD', 'INF']),
  price: PriceSchema,
  requiredInformation: z.object({
    passportRequired: z.boolean(),
    nationalIdRequired: z.boolean(),
    dateOfBirthRequired: z.boolean(),
    nationalityRequired: z.boolean(),
  }),
})

export const PricingDetailSchema = z.object({
  itineraryId: z.string(),
  fareId: z.string(),
  price: PriceSchema,
  flights: z.array(FlightSchema),
  addOns: AddOnsSchema.optional(),
  travellers: z.array(TravellerPricingSchema),
})

export const FlightPricingResponseSchema = z.object({
  status: z.string(),
  meta: z.object({
    currency: z.string(),
    sId: z.string().uuid(),
    pricingId: z.string().uuid(),
    searchQuery: FlightSearchRequestSchema,
  }),
  data: z.object({
    pricingDetails: z.array(PricingDetailSchema).optional(),
    segments: z.array(SegmentSchema).optional(),
    fareInfo: z.array(FareInfoSchema).optional(),
    fareFamilies: z.array(FareFamilySchema).optional(),
  }),
})

// ============================================================================
// Reservation Types
// ============================================================================

export const TravellerInputSchema = z.object({
  index: z.number(),
  type: z.enum(['ADT', 'CHD', 'INF']),
  title: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string(),
  isPrimaryContact: z.boolean().optional(),
  idType: z.enum(['PASSPORT', 'NATIONAL_ID']),
  idNumber: z.string(),
  idIssueDate: z.string().optional(),
  idExpiryDate: z.string().optional(),
  nationality: z.string(),
  documentIssuingCountry: z.string(),
  frequentFlyerNumber: z.array(z.object({
    airlineCode: z.string(),
    number: z.string(),
  })).optional(),
  selectedAddOns: z.object({
    extraBaggage: z.array(z.object({
      flightId: z.string(),
      addOnId: z.string(),
    })).optional(),
  }).optional(),
})

export const FlightReservationRequestSchema = z.object({
  sId: z.string().uuid(),
  pricingId: z.string().uuid(),
  travellers: z.array(TravellerInputSchema),
  contactDetails: ContactDetailsSchema,
})

export const FlightReservationResponseSchema = z.object({
  status: z.string(),
  errors: z.array(ErrorDtoSchema).optional(),
  meta: z.object({
    currency: z.string(),
    searchId: z.string().uuid(),
    pricingId: z.string().uuid(),
    reservationId: z.string().uuid(),
  }),
  data: z.object({
    reservationDetails: z.array(PricingDetailSchema).optional(),
    segments: z.array(SegmentSchema).optional(),
    fareInfo: z.array(FareInfoSchema).optional(),
    fareFamilies: z.array(FareFamilySchema).optional(),
    travellers: z.array(TravellerInputSchema).optional(),
    contactDetails: ContactDetailsSchema,
  }),
})

// ============================================================================
// Booking Types
// ============================================================================

export const FlightBookRequestSchema = z.object({
  sId: z.string().uuid(),
  reservationId: z.string().uuid(),
  payableAmount: z.array(z.object({
    itineraryId: z.string(),
    amount: z.number(),
    currency: z.string(),
  })),
  internalReference: z.string().optional(),
})

export const FlightBookResponseSchema = z.object({
  bId: z.string().uuid(),
  dsOrderNumber: z.string().optional(),
})

export const BookingDetailSchema = z.object({
  itineraryId: z.string(),
  fareId: z.string(),
  pnr: z.string(),
  pnrStatus: z.string(),
  errors: z.array(ErrorDtoSchema).optional(),
  airline: z.string().optional(),
  flightCodes: z.array(z.string()).optional(),
  price: PriceSchema,
  flights: z.array(FlightSchema),
  fareRules: z.array(z.object({
    itineraryId: z.string(),
    origin: z.string(),
    destination: z.string(),
    departureDate: z.string(),
    charges: ChargesSchema,
    refundableCode: z.string(),
  })).optional(),
  travellers: z.array(z.object({
    index: z.number(),
    type: z.string(),
    requiredInformation: z.object({
      passportRequired: z.boolean(),
      nationalIdRequired: z.boolean(),
      dateOfBirthRequired: z.boolean(),
      nationalityRequired: z.boolean(),
    }).optional(),
    tickets: z.object({
      tickets: z.array(z.object({
        eTicketNo: z.string(),
      })),
    }).optional(),
  })),
})

export const FlightBookingPollingResponseSchema = z.object({
  complete: z.boolean(),
  status: z.string(),
  errors: z.array(ErrorDtoSchema).optional(),
  meta: z.object({
    currency: z.string(),
    sId: z.string().uuid(),
    bId: z.string().uuid(),
    createdAt: z.string(),
  }),
  data: z.object({
    totalReservations: z.number(),
    bookings: z.array(z.object({
      itineraryId: z.string(),
      pnr: z.string(),
      pnrStatus: z.string(),
      fareUuid: z.string(),
    })),
  }),
})

// ============================================================================
// Order Retrieve Types
// ============================================================================

export const FlightOrderRetrieveResponseSchema = z.object({
  status: z.string(),
  errors: z.array(ErrorDtoSchema).optional(),
  meta: z.object({
    pricingId: z.string().uuid(),
    reservationId: z.string().uuid(),
    cacheId: z.string().optional(),
    currency: z.string(),
    createdAt: z.string(),
    searchType: z.string().optional(),
    bId: z.string(),
    sId: z.string().uuid(),
  }),
  data: z.object({
    totalReservations: z.number(),
    totalPrice: PriceSchema,
    bookingDetails: z.array(BookingDetailSchema),
    bookingFlags: z.object({
      hasFrequentFlyerOptions: z.boolean(),
      hasMealOptions: z.boolean(),
      hasSpecialRequestOption: z.boolean(),
      isMultiPNR: z.boolean(),
      hasFreeInsurance: z.boolean(),
      hasMixedFareFamily: z.boolean(),
      isDomestic: z.boolean(),
    }).optional(),
    segments: z.array(SegmentSchema).optional(),
    fareInfo: z.array(FareInfoSchema).optional(),
    fareFamilies: z.array(FareFamilySchema).optional(),
    travellers: z.array(TravellerInputSchema).optional(),
    contactDetails: ContactDetailsSchema.optional(),
  }),
})

// ============================================================================
// TypeScript Types (inferred from Zod)
// ============================================================================

export type FlightSegmentRequest = z.infer<typeof FlightSegmentRequestSchema>
export type FlightTravellers = z.infer<typeof FlightTravellersSchema>
export type FlightSearchRequest = z.infer<typeof FlightSearchRequestSchema>
export type FlightSearchResponse = z.infer<typeof FlightSearchResponseSchema>
export type FlightSearchPollingResponse = z.infer<typeof FlightSearchPollingResponseSchema>
export type BaggageInfo = z.infer<typeof BaggageInfoSchema>
export type FareInfo = z.infer<typeof FareInfoSchema>
export type Segment = z.infer<typeof SegmentSchema>
export type StopDetail = z.infer<typeof StopDetailSchema>
export type Flight = z.infer<typeof FlightSchema>
export type Itinerary = z.infer<typeof ItinerarySchema>
export type FareFamily = z.infer<typeof FareFamilySchema>
export type FareFamilyDetail = z.infer<typeof FareFamilyDetailSchema>
export type FlightFareFamiliesResponse = z.infer<typeof FlightFareFamiliesResponseSchema>
export type Charges = z.infer<typeof ChargesSchema>
export type PricingDetail = z.infer<typeof PricingDetailSchema>
export type FlightPricingResponse = z.infer<typeof FlightPricingResponseSchema>
export type TravellerInput = z.infer<typeof TravellerInputSchema>
export type FlightReservationRequest = z.infer<typeof FlightReservationRequestSchema>
export type FlightReservationResponse = z.infer<typeof FlightReservationResponseSchema>
export type FlightBookRequest = z.infer<typeof FlightBookRequestSchema>
export type FlightBookResponse = z.infer<typeof FlightBookResponseSchema>
export type BookingDetail = z.infer<typeof BookingDetailSchema>
export type FlightBookingPollingResponse = z.infer<typeof FlightBookingPollingResponseSchema>
export type FlightOrderRetrieveResponse = z.infer<typeof FlightOrderRetrieveResponseSchema>
