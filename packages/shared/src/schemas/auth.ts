import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'
import { UserSchema } from './user.js'

// Login request
export const LoginRequestSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.Optional(Type.String({ minLength: 8 }))
})

export type LoginRequest = Static<typeof LoginRequestSchema>

// Magic link request
export const MagicLinkRequestSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  redirectUrl: Type.Optional(Type.String({ format: 'uri' }))
})

export type MagicLinkRequest = Static<typeof MagicLinkRequestSchema>

// Magic link verify
export const MagicLinkVerifySchema = Type.Object({
  token: Type.String()
})

export type MagicLinkVerify = Static<typeof MagicLinkVerifySchema>

// Register request
export const RegisterRequestSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  name: Type.String({ minLength: 1, maxLength: 100 }),
  password: Type.Optional(Type.String({ minLength: 8 }))
})

export type RegisterRequest = Static<typeof RegisterRequestSchema>

// Auth response
export const AuthResponseSchema = Type.Object({
  user: UserSchema,
  accessToken: Type.String(),
  refreshToken: Type.Optional(Type.String()),
  expiresAt: Type.String({ format: 'date-time' })
})

export type AuthResponse = Static<typeof AuthResponseSchema>

// Refresh token request
export const RefreshTokenRequestSchema = Type.Object({
  refreshToken: Type.String()
})

export type RefreshTokenRequest = Static<typeof RefreshTokenRequestSchema>

// OAuth provider
export const OAuthProviderSchema = Type.Union([
  Type.Literal('google'),
  Type.Literal('github')
])

export type OAuthProvider = Static<typeof OAuthProviderSchema>

// OAuth callback
export const OAuthCallbackSchema = Type.Object({
  code: Type.String(),
  state: Type.Optional(Type.String())
})

export type OAuthCallback = Static<typeof OAuthCallbackSchema>

// YC Verification request
export const YCVerifyRequestSchema = Type.Object({
  verificationUrl: Type.String({ format: 'uri' })
})

export type YCVerifyRequest = Static<typeof YCVerifyRequestSchema>

// Session info
export const SessionSchema = Type.Object({
  id: Type.String(),
  userId: Type.String(),
  userAgent: Type.Optional(Type.String()),
  ip: Type.Optional(Type.String()),
  createdAt: Type.String({ format: 'date-time' }),
  expiresAt: Type.String({ format: 'date-time' })
})

export type Session = Static<typeof SessionSchema>
