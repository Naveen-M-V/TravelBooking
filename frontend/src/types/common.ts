import { z } from 'zod'

// ============================================================================
// Common Error Types
// ============================================================================

export const ErrorDtoSchema = z.object({
  code: z.string(),
  errorInfo: z.string().optional(),
  errorMessages: z.array(z.string()).optional(),
})

export const ApiErrorSchema = z.object({
  timestamp: z.string().optional(),
  path: z.string().optional(),
  status: z.number().optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
  message: z.string().optional(),
  requestId: z.string().optional(),
  traceId: z.string().optional(),
  trace: z.string().optional(),
  errors: z.array(ErrorDtoSchema).optional(),
})

// ============================================================================
// Authentication Types
// ============================================================================

export const AuthenticationResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  refresh_token: z.string().optional(),
  scope: z.string().optional(),
  expires_in: z.number(),
})

// ============================================================================
// Common Utility Types
// ============================================================================

export const PriceSchema = z.object({
  currency: z.string(),
  total: z.number(),
  base: z.number().optional(),
  tax: z.number().optional(),
  vat: z.number().optional(),
  serviceFee: z.number().optional(),
  extraBaggage: z.number().optional(),
})

export const LocalizedNameSchema = z.object({
  en: z.string().optional(),
  ar: z.string().optional(),
})

export const AddressSchema = z.object({
  countryName: z.object({
    code: z.string(),
  }),
})

export const ContactDetailsSchema = z.object({
  title: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  dialCode: z.string(),
})

// ============================================================================
// TypeScript Types (inferred from Zod)
// ============================================================================

export type ErrorDto = z.infer<typeof ErrorDtoSchema>
export type ApiError = z.infer<typeof ApiErrorSchema>
export type AuthenticationResponse = z.infer<typeof AuthenticationResponseSchema>
export type Price = z.infer<typeof PriceSchema>
export type LocalizedName = z.infer<typeof LocalizedNameSchema>
export type Address = z.infer<typeof AddressSchema>
export type ContactDetails = z.infer<typeof ContactDetailsSchema>

// ============================================================================
// Rate Limit Headers
// ============================================================================

export interface RateLimitHeaders {
  'X-RateLimit-Remaining': number
  'X-RateLimit-Limit': number
  'X-RateLimit-Burst-Capacity': number
  'X-RateLimit-Replenish-Rate': number
}
