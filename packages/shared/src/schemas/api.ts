import { Type } from '@sinclair/typebox'
import type { Static, TSchema } from '@sinclair/typebox'

// Pagination request params
export const PaginationParamsSchema = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
  pageSize: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 20 }))
})

export type PaginationParams = Static<typeof PaginationParamsSchema>

// Pagination response info
export const PaginationInfoSchema = Type.Object({
  page: Type.Integer({ minimum: 1 }),
  pageSize: Type.Integer({ minimum: 1 }),
  total: Type.Integer({ minimum: 0 }),
  totalPages: Type.Integer({ minimum: 0 }),
  hasNext: Type.Boolean(),
  hasPrev: Type.Boolean()
})

export type PaginationInfo = Static<typeof PaginationInfoSchema>

// API Error
export const ApiErrorSchema = Type.Object({
  code: Type.String(),
  message: Type.String(),
  details: Type.Optional(Type.Unknown()),
  field: Type.Optional(Type.String())
})

export type ApiError = Static<typeof ApiErrorSchema>

// Generic API Response wrapper
export function createApiResponseSchema<T extends TSchema>(dataSchema: T) {
  return Type.Object({
    success: Type.Boolean(),
    data: Type.Optional(dataSchema),
    error: Type.Optional(ApiErrorSchema),
    pagination: Type.Optional(PaginationInfoSchema)
  })
}

// Success response helper type
export const SuccessResponseSchema = Type.Object({
  success: Type.Literal(true),
  message: Type.Optional(Type.String())
})

export type SuccessResponse = Static<typeof SuccessResponseSchema>

// Common error codes
export const ErrorCode = {
  // Auth errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',

  // Rate limiting
  RATE_LIMITED: 'RATE_LIMITED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',

  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',

  // Feature errors
  FEATURE_DISABLED: 'FEATURE_DISABLED'
} as const

export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode]

// Sort order
export const SortOrderSchema = Type.Union([
  Type.Literal('asc'),
  Type.Literal('desc')
])

export type SortOrder = Static<typeof SortOrderSchema>

// Generic list query params
export const ListQuerySchema = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 1 })),
  pageSize: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
  sortBy: Type.Optional(Type.String()),
  sortOrder: Type.Optional(SortOrderSchema),
  search: Type.Optional(Type.String())
})

export type ListQuery = Static<typeof ListQuerySchema>

// Health check response
export const HealthCheckSchema = Type.Object({
  status: Type.Union([
    Type.Literal('healthy'),
    Type.Literal('degraded'),
    Type.Literal('unhealthy')
  ]),
  version: Type.String(),
  timestamp: Type.String({ format: 'date-time' }),
  services: Type.Object({
    database: Type.Boolean(),
    cache: Type.Optional(Type.Boolean()),
    search: Type.Optional(Type.Boolean())
  })
})

export type HealthCheck = Static<typeof HealthCheckSchema>
