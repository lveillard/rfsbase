import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'
import { UserSummarySchema } from './user'

// Vote counts
export const VoteCountsSchema = Type.Object({
  problem: Type.Integer({ minimum: 0, default: 0 }),
  solution: Type.Integer({ minimum: 0, default: 0 }),
  total: Type.Integer({ minimum: 0, default: 0 })
})

export type VoteCounts = Static<typeof VoteCountsSchema>

// Full Idea Schema
export const IdeaSchema = Type.Object({
  id: Type.String(),
  author: UserSummarySchema,
  title: Type.String({ minLength: 10, maxLength: 100 }),
  problem: Type.String({ minLength: 50, maxLength: 5000 }),
  solution: Type.Optional(Type.String({ maxLength: 5000 })),
  targetAudience: Type.Optional(Type.String({ maxLength: 500 })),
  category: Type.String(),
  tags: Type.Array(Type.String(), { maxItems: 5, default: [] }),
  links: Type.Array(Type.String({ format: 'uri' }), { maxItems: 5, default: [] }),
  votes: VoteCountsSchema,
  commentCount: Type.Integer({ minimum: 0, default: 0 }),
  userVote: Type.Optional(Type.Union([
    Type.Literal('problem'),
    Type.Literal('solution'),
    Type.Null()
  ])),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
})

export type Idea = Static<typeof IdeaSchema>

// Idea creation
export const IdeaCreateSchema = Type.Object({
  title: Type.String({ minLength: 10, maxLength: 100 }),
  problem: Type.String({ minLength: 50, maxLength: 5000 }),
  solution: Type.Optional(Type.String({ maxLength: 5000 })),
  targetAudience: Type.Optional(Type.String({ maxLength: 500 })),
  category: Type.String(),
  tags: Type.Optional(Type.Array(Type.String(), { maxItems: 5 })),
  links: Type.Optional(Type.Array(Type.String({ format: 'uri' }), { maxItems: 5 }))
})

export type IdeaCreate = Static<typeof IdeaCreateSchema>

// Idea update
export const IdeaUpdateSchema = Type.Partial(IdeaCreateSchema)

export type IdeaUpdate = Static<typeof IdeaUpdateSchema>

// Idea card (for list views)
export const IdeaCardSchema = Type.Object({
  id: Type.String(),
  author: UserSummarySchema,
  title: Type.String(),
  problem: Type.String({ description: 'Truncated to ~200 chars for preview' }),
  solution: Type.Optional(Type.String({ description: 'Truncated solution preview' })),
  category: Type.String(),
  tags: Type.Array(Type.String()),
  votes: VoteCountsSchema,
  commentCount: Type.Integer(),
  userVote: Type.Optional(Type.Union([
    Type.Literal('problem'),
    Type.Literal('solution'),
    Type.Null()
  ])),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
})

export type IdeaCard = Static<typeof IdeaCardSchema>

// Vote types
export const VoteTypeSchema = Type.Union([
  Type.Literal('problem'),
  Type.Literal('solution')
])

export type VoteType = Static<typeof VoteTypeSchema>

// Vote request
export const VoteRequestSchema = Type.Object({
  type: VoteTypeSchema
})

export type VoteRequest = Static<typeof VoteRequestSchema>

// Similar idea query
export const SimilarIdeaQuerySchema = Type.Object({
  text: Type.String({ minLength: 20 }),
  threshold: Type.Optional(Type.Number({ minimum: 0, maximum: 1, default: 0.75 })),
  limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 20, default: 5 })),
  excludeId: Type.Optional(Type.String())
})

export type SimilarIdeaQuery = Static<typeof SimilarIdeaQuerySchema>

// Similar idea result
export const SimilarIdeaResultSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  problem: Type.String(),
  category: Type.String(),
  votes: Type.Integer(),
  similarity: Type.Number()
})

export type SimilarIdeaResult = Static<typeof SimilarIdeaResultSchema>

// Idea list filters
export const IdeaListFilterSchema = Type.Object({
  category: Type.Optional(Type.String()),
  tags: Type.Optional(Type.Array(Type.String())),
  authorId: Type.Optional(Type.String()),
  search: Type.Optional(Type.String()),
  sortBy: Type.Optional(Type.Union([
    Type.Literal('hot'),
    Type.Literal('new'),
    Type.Literal('top'),
    Type.Literal('discussed')
  ])),
  timeRange: Type.Optional(Type.Union([
    Type.Literal('day'),
    Type.Literal('week'),
    Type.Literal('month'),
    Type.Literal('year'),
    Type.Literal('all')
  ]))
})

export type IdeaListFilter = Static<typeof IdeaListFilterSchema>
