import { z } from 'zod'
import { ErrorDtoSchema, PriceSchema, LocalizedNameSchema, AddressSchema } from './common'

// ============================================================================
// Hotel Search Types
// ============================================================================

export const RoomInfoSchema = z.object({
  adultsCount: z.number().min(1),
  kidsAges: z.array(z.number()).optional(),
})

export const HotelSearchRequestSchema = z.object({
  currency: z.string(),
  nationality: z.string(),
  residency: z.string(),
  checkIn: z.string(), // YYYY-MM-DD
  checkOut: z.string(), // YYYY-MM-DD
  roomsInfo: z.array(RoomInfoSchema).min(1),
  hotelIds: z.array(z.string()).optional(),
  searchType: z.enum(['search', 'packages']).optional(),
  timeOutInSeconds: z.number().optional(),
})

export const HotelSearchResponseSchema = z.object({
  sId: z.string().uuid(),
  totalResults: z.number().optional(),
  searchStatus: z.string().optional(),
  sessionCreatedAt: z.string().optional(),
  sessionExpiredAt: z.string().optional(),
  currency: z.string().optional(),
  errors: z.array(ErrorDtoSchema).optional(),
})

// ============================================================================
// Room & Package Types
// ============================================================================

export const RoomDetailSchema = z.object({
  roomCode: z.string().optional(),
})

export const RoomRateInfoSchema = z.object({
  total: z.number(),
  roomNightlyRates: z.array(z.object({
    rate: z.number(),
  })).optional(),
})

export const RoomInfoExtendedSchema = z.object({
  kidsAges: z.array(z.number()).optional(),
  numberOfAdults: z.number(),
  rmsDetail: RoomDetailSchema.optional(),
  roomBasis: z.string().optional(),
  roomId: z.string().uuid(),
  originalRoomName: z.string().optional(),
  roomName: LocalizedNameSchema.optional(),
  roomRateInfo: RoomRateInfoSchema.optional(),
})

export const FreeCancellationSchema = z.object({
  freeCancellation: z.string().optional(),
})

export const SearchResultSchema = z.object({
  total: z.number(),
  netPrice: z.number().optional(),
  basePriceNightlyRate: z.number().optional(),
  sellingPriceMandatory: z.boolean(),
  basePriceWithoutVAT: z.number().optional(),
  boards: z.array(z.string()).optional(),
  roomBasis: z.string().optional(),
  freeCancellation: FreeCancellationSchema.optional(),
  hotelId: z.string(),
  countryCode: z.string(),
  rooms: z.array(RoomInfoExtendedSchema),
})

// ============================================================================
// Cancellation Policy Types
// ============================================================================

export const CancellationFeeSchema = z.object({
  currency: z.string(),
  finalPrice: z.number(),
  netPrice: z.number().optional(),
  sellingPriceMandatory: z.boolean().optional(),
})

export const CancellationPolicyDetailSchema = z.object({
  cancellationFee: CancellationFeeSchema,
  dateFrom: z.string(),
  dateTo: z.string(),
  originalDateFrom: z.string().optional(),
})

export const CancellationPolicySchema = z.object({
  bookingRemarks: z.string().optional(),
  cancellationPolicyDetails: z.array(CancellationPolicyDetailSchema).optional(),
})

// ============================================================================
// Package Types
// ============================================================================

export const VatInfoSchema = z.object({
  vatAmount: z.number(),
  percentage: z.number(),
  action: z.enum(['APPLIED', 'NOT_APPLIED']),
})

export const PackageRateInfoSchema = z.object({
  total: z.number(),
  currency: z.string(),
  netPrice: z.number().optional(),
  sellingPriceMandatory: z.boolean(),
  packageNightlyRates: z.array(z.object({
    rate: z.number(),
  })).optional(),
  vatDetail: VatInfoSchema.optional(),
})

export const PackageDetailSchema = z.object({
  packageId: z.string().uuid(),
  refundability: z.string().optional(),
  dynamicRefundability: z.string().optional(),
  cancellationPolicy: CancellationPolicySchema.optional(),
  rooms: z.array(RoomInfoExtendedSchema),
  packageRateInfo: PackageRateInfoSchema,
})

export const PackageResultSchema = z.object({
  currencyCode: z.string().optional(),
  hotelId: z.string(),
  countryCode: z.string().optional(),
  numberOfRooms: z.number().optional(),
  packages: z.array(PackageDetailSchema),
})

// ============================================================================
// Search With Packages Response
// ============================================================================

export const SearchWithPackagesResponseSchema = z.object({
  totalResults: z.number().optional(),
  spId: z.string().uuid().optional(),
  sId: z.string().uuid().optional(),
  searchStatus: z.string().optional(),
  currency: z.string().optional(),
  errors: z.array(ErrorDtoSchema).optional(),
  searchResults: z.array(PackageResultSchema).optional(),
})

// ============================================================================
// Availability Response
// ============================================================================

export const AvailabilityResponseSchema = z.object({
  totalResults: z.number().optional(),
  pId: z.string().uuid().optional(),
  sId: z.string().uuid().optional(),
  pollingStatus: z.enum(['COMPLETED_SUCCESSFULLY', 'IN_PROGRESS', 'FAILED']).optional(),
  sessionCreatedAt: z.string().optional(),
  sessionExpiredAt: z.string().optional(),
  errors: z.array(ErrorDtoSchema).optional(),
  searchResult: SearchResultSchema.optional(),
  packagesResult: z.object({
    currencyCode: z.string().optional(),
    hotelId: z.string(),
    numberOfRooms: z.number().optional(),
    packages: z.array(PackageDetailSchema),
  }).optional(),
})

// ============================================================================
// Booking Types
// ============================================================================

export const PersonalDetailsSchema = z.object({
  email: z.string().email(),
  telephone: z.string(),
  name: z.object({
    givenName: z.string(),
    namePrefix: z.string(),
    surname: z.string(),
  }),
  age: z.number().optional(),
  type: z.string(), // "0" for adult, "1" for child
})

export const PassengerSchema = z.object({
  address: AddressSchema,
  roomId: z.string().uuid(),
  paxId: z.string().uuid(),
  personDetails: PersonalDetailsSchema,
})

export const BookingPackageSchema = z.object({
  leadPaxId: z.string().uuid(),
  leadPaxRoomId: z.string(),
  packageId: z.string(),
  passengers: z.array(PassengerSchema),
})

export const HotelBookingRequestSchema = z.object({
  sId: z.string().uuid(),
  pId: z.string().uuid(),
  bookingRequest: z.object({
    agentRemarks: z.string().optional(),
    bookingPrice: z.number(),
    internalReference: z.string().optional(),
    hotelId: z.number(),
    packages: z.array(BookingPackageSchema),
  }),
})

export const BookingResultSchema = z.object({
  bookingReference: z.string(),
  bookingRemarks: z.array(z.string()).optional(),
  roomIds: z.array(z.string().uuid()),
  segmentNumber: z.string(),
  dsOrderNumber: z.string(),
  status: z.string(),
  totalPrice: z.object({
    currency: z.string(),
    finalPrice: z.number(),
    netPrice: z.number(),
    sellingPriceMandatory: z.boolean(),
  }),
})

export const HotelBookingResponseSchema = z.object({
  totalResults: z.number().optional(),
  sId: z.string().uuid(),
  bId: z.string().uuid(),
  pollingStatus: z.string().optional(),
  errors: z.array(ErrorDtoSchema).optional(),
  bookingResult: z.object({
    bookingResults: z.array(BookingResultSchema),
  }).optional(),
  createdDate: z.string().optional(),
})

// ============================================================================
// Cancel Booking Types
// ============================================================================

export const CancelBookingRequestSchema = z.object({
  sId: z.string().uuid(),
  bId: z.string().uuid(),
  cancelBookRequest: z.object({
    segmentNumber: z.string(),
  }),
})

export const CancelBookingResponseSchema = z.object({
  errors: z.array(ErrorDtoSchema).optional(),
  cancellationChargesResults: z.object({
    cancellationFee: z.number(),
    currency: z.string(),
    status: z.string(),
    netPrice: z.number().optional(),
    sellingPriceMandatory: z.boolean().optional(),
  }),
  bId: z.string().uuid(),
  sId: z.string().uuid(),
  segmentNumber: z.string(),
  orderNumber: z.string(),
})

// ============================================================================
// Order Management Types
// ============================================================================

export const OrderSegmentSchema = z.object({
  segmentNumber: z.string(),
  hcnNumber: z.string().optional(),
  internalReference: z.string().optional(),
  bookingReference: z.string().optional(),
  bookingRemarks: z.string().optional(),
  cancelDate: z.string().optional(),
  orderDate: z.string().optional(),
  price: z.object({
    currency: z.string(),
    finalPrice: z.number(),
    netPrice: z.number().optional(),
    sellingPriceMandatory: z.boolean(),
  }),
  dsOrderNumber: z.string(),
  rooms: z.array(z.object({
    kidsAges: z.array(z.number()).optional(),
    numberOfAdults: z.number(),
    roomBasis: z.string().optional(),
    roomName: LocalizedNameSchema.optional(),
    originalRoomName: z.string().optional(),
  })),
  cancellationPolicies: z.array(z.object({
    cancellationFee: z.object({
      currency: z.string(),
      finalPrice: z.number(),
    }),
    dateFrom: z.string(),
    dateTo: z.string(),
  })).optional(),
  checkIn: z.string(),
  checkOut: z.string(),
  isPaid: z.boolean().optional(),
  specialRequest: z.string().optional(),
})

export const GetOrderResponseSchema = z.object({
  sId: z.string().uuid(),
  bId: z.string().uuid(),
  dsOrderNumber: z.string().optional(),
  errors: z.array(ErrorDtoSchema).optional(),
  orderResults: z.object({
    hotelId: z.string(),
    orderDetails: z.object({
      errors: z.array(ErrorDtoSchema).optional(),
      orderStatus: z.string(),
      segments: z.array(OrderSegmentSchema),
    }),
  }),
})

// ============================================================================
// Order List Types
// ============================================================================

export const OrderListHotelInfoSchema = z.object({
  atgHotelId: z.string().optional(),
  nameAr: z.string().optional(),
  nameEn: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  starRating: z.number().optional(),
  email: z.string().optional(),
  fax: z.string().optional(),
  phoneNumber: z.string().optional(),
  webSiteUrl: z.string().optional(),
  zipCode: z.string().optional(),
  addressEn: z.string().optional(),
  addressAr: z.string().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  area: z.object({
    id: z.string(),
    nameEn: z.string(),
    nameAr: z.string(),
  }).optional(),
  city: z.object({
    id: z.string(),
    nameEn: z.string(),
    nameAr: z.string(),
  }).optional(),
  countryCode: z.string().optional(),
})

export const OrderListRequestSchema = z.object({
  pageNo: z.number().optional(),
  pageSize: z.number().optional(),
  hotelId: z.string().optional(),
  segmentNumber: z.string().optional(),
  checkInStart: z.string().optional(),
  checkInEnd: z.string().optional(),
  checkOutStart: z.string().optional(),
  checkOutEnd: z.string().optional(),
  orderStatus: z.string().optional(),
  orderDate: z.string().optional(),
  cancellationPolicyDateFrom: z.string().optional(),
  cancellationDate: z.string().optional(),
  supplierReferenceId: z.string().optional(),
})

export const OrderListResponseSchema = z.object({
  pageNo: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  totalResults: z.number(),
  results: z.array(z.object({
    lastModifiedDate: z.string(),
    orderResponse: GetOrderResponseSchema,
    hotelInfo: OrderListHotelInfoSchema,
  })),
  errors: z.array(ErrorDtoSchema).optional(),
})

// ============================================================================
// TypeScript Types (inferred from Zod)
// ============================================================================

export type RoomInfo = z.infer<typeof RoomInfoSchema>
export type HotelSearchRequest = z.infer<typeof HotelSearchRequestSchema>
export type HotelSearchResponse = z.infer<typeof HotelSearchResponseSchema>
export type RoomDetail = z.infer<typeof RoomDetailSchema>
export type RoomRateInfo = z.infer<typeof RoomRateInfoSchema>
export type RoomInfoExtended = z.infer<typeof RoomInfoExtendedSchema>
export type SearchResult = z.infer<typeof SearchResultSchema>
export type CancellationFee = z.infer<typeof CancellationFeeSchema>
export type CancellationPolicyDetail = z.infer<typeof CancellationPolicyDetailSchema>
export type CancellationPolicy = z.infer<typeof CancellationPolicySchema>
export type VatInfo = z.infer<typeof VatInfoSchema>
export type PackageRateInfo = z.infer<typeof PackageRateInfoSchema>
export type PackageDetail = z.infer<typeof PackageDetailSchema>
export type PackageResult = z.infer<typeof PackageResultSchema>
export type SearchWithPackagesResponse = z.infer<typeof SearchWithPackagesResponseSchema>
export type AvailabilityResponse = z.infer<typeof AvailabilityResponseSchema>
export type PersonalDetails = z.infer<typeof PersonalDetailsSchema>
export type Passenger = z.infer<typeof PassengerSchema>
export type BookingPackage = z.infer<typeof BookingPackageSchema>
export type HotelBookingRequest = z.infer<typeof HotelBookingRequestSchema>
export type BookingResult = z.infer<typeof BookingResultSchema>
export type HotelBookingResponse = z.infer<typeof HotelBookingResponseSchema>
export type CancelBookingRequest = z.infer<typeof CancelBookingRequestSchema>
export type CancelBookingResponse = z.infer<typeof CancelBookingResponseSchema>
export type OrderSegment = z.infer<typeof OrderSegmentSchema>
export type GetOrderResponse = z.infer<typeof GetOrderResponseSchema>
export type OrderListHotelInfo = z.infer<typeof OrderListHotelInfoSchema>
export type OrderListRequest = z.infer<typeof OrderListRequestSchema>
export type OrderListResponse = z.infer<typeof OrderListResponseSchema>
