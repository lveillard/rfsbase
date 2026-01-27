import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'
import { UserSummarySchema } from './user.js'

// Comment Schema
export const CommentSchema = Type.Object({
  id: Type.String(),
  ideaId: Type.String(),
  author: UserSummarySchema,
  parentId: Type.Optional(Type.String()),
  content: Type.String({ minLength: 1, maxLength: 2000 }),
  upvotes: Type.Integer({ minimum: 0, default: 0 }),
  userUpvoted: Type.Boolean({ default: false }),
  replyCount: Type.Integer({ minimum: 0, default: 0 }),
  replies: Type.Optional(Type.Array(Type.Any(), { default: [] })),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
})

export type Comment = Static<typeof CommentSchema>

// Comment with replies (recursive type for nested comments)
export const CommentWithRepliesSchema: ReturnType<typeof Type.Object> = Type.Object({
  id: Type.String(),
  ideaId: Type.String(),
  author: UserSummarySchema,
  parentId: Type.Optional(Type.String()),
  content: Type.String({ minLength: 1, maxLength: 2000 }),
  upvotes: Type.Integer({ minimum: 0, default: 0 }),
  userUpvoted: Type.Boolean({ default: false }),
  replyCount: Type.Integer({ minimum: 0, default: 0 }),
  replies: Type.Array(Type.Any(), { default: [] }),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
})

// Note: CommentWithReplies uses Type.Any for replies to handle recursive structure
// The actual type ensures replies are CommentWithReplies[]
export interface CommentWithReplies {
  id: string
  ideaId: string
  author: Static<typeof UserSummarySchema>
  parentId?: string
  content: string
  upvotes: number
  userUpvoted: boolean
  replyCount: number
  replies: CommentWithReplies[]
  createdAt: string
  updatedAt: string
}

// Comment creation
export const CommentCreateSchema = Type.Object({
  ideaId: Type.String(),
  parentId: Type.Optional(Type.String()),
  content: Type.String({ minLength: 1, maxLength: 2000 })
})

export type CommentCreate = Static<typeof CommentCreateSchema>

// Comment update
export const CommentUpdateSchema = Type.Object({
  content: Type.String({ minLength: 1, maxLength: 2000 })
})

export type CommentUpdate = Static<typeof CommentUpdateSchema>

// Comment list sort options
export const CommentSortSchema = Type.Union([
  Type.Literal('best'),
  Type.Literal('newest'),
  Type.Literal('oldest')
])

export type CommentSort = Static<typeof CommentSortSchema>
