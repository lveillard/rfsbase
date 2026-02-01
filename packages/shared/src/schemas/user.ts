import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'

// YC Verification Info
export const YCVerificationSchema = Type.Object({
  companyName: Type.String(),
  batch: Type.String(),
  verifiedAt: Type.String({ format: 'date-time' }),
  verificationUrl: Type.Optional(Type.String({ format: 'uri' }))
})

export type YCVerification = Static<typeof YCVerificationSchema>

// User Stats
export const UserStatsSchema = Type.Object({
  ideasCount: Type.Integer({ minimum: 0, default: 0 }),
  votesReceived: Type.Integer({ minimum: 0, default: 0 }),
  votesGiven: Type.Integer({ minimum: 0, default: 0 }),
  commentsCount: Type.Integer({ minimum: 0, default: 0 }),
  followersCount: Type.Integer({ minimum: 0, default: 0 }),
  followingCount: Type.Integer({ minimum: 0, default: 0 })
})

export type UserStats = Static<typeof UserStatsSchema>

// Full User Schema
export const UserSchema = Type.Object({
  id: Type.String(),
  email: Type.String({ format: 'email' }),
  name: Type.String({ minLength: 1, maxLength: 100 }),
  avatar: Type.Optional(Type.String({ format: 'uri' })),
  bio: Type.Optional(Type.String({ maxLength: 500 })),
  isPublic: Type.Boolean({ default: true }),
  verified: Type.Object({
    email: Type.Boolean({ default: false }),
    yc: Type.Optional(YCVerificationSchema)
  }),
  stats: UserStatsSchema,
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
})

export type User = Static<typeof UserSchema>

// User for public display (no email)
export const PublicUserSchema = Type.Omit(UserSchema, ['email'])
export type PublicUser = Static<typeof PublicUserSchema>

// User creation
export const UserCreateSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  name: Type.String({ minLength: 1, maxLength: 100 }),
  avatar: Type.Optional(Type.String({ format: 'uri' }))
})

export type UserCreate = Static<typeof UserCreateSchema>

// User update
export const UserUpdateSchema = Type.Partial(
  Type.Object({
    name: Type.String({ minLength: 1, maxLength: 100 }),
    avatar: Type.Optional(Type.String({ format: 'uri' })),
    bio: Type.Optional(Type.String({ maxLength: 500 })),
    isPublic: Type.Boolean()
  })
)

export type UserUpdate = Static<typeof UserUpdateSchema>

// YC Type enum
export const YCTypeSchema = Type.Union([
  Type.Literal('partner'),
  Type.Literal('alumni'),
  Type.Null()
])

export type YCType = Static<typeof YCTypeSchema>

// User summary for embedding in other objects
export const UserSummarySchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  avatar: Type.Optional(Type.Union([Type.String({ format: 'uri' }), Type.Null()])),
  verified: Type.Boolean({ default: false }),
  ycType: YCTypeSchema
})

export type UserSummary = Static<typeof UserSummarySchema>
