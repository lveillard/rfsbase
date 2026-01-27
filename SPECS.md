# RFSbase - Complete Product Specification v2

## Overview
RFSbase is a "Request for Startup" idea board inspired by YC's RFS concept. It's a living platform where founders and entrepreneurs share problems they're facing, propose solutions, and the community votes and comments to surface the best ideas for new startups.

---

## Tech Stack (2025 Best Practices)

### Frontend
- **Next.js 16** (App Router, Server Components, Server Actions)
- **React 19** with Server Components & use() hook
- **Tailwind CSS 4** with CSS-first configuration
- **Vercel AI SDK 6.x** for AI features (streaming, embeddings, completions)
- **TypeBox** for runtime type validation (shared with backend)

### Backend
- **Axum** (Rust) - High-performance async web framework
- **SurrealDB 2.x** - Multi-model database with:
  - Native authentication system
  - Vector embeddings for semantic search (MTREE index)
  - Real-time subscriptions (Live queries)
  - Graph relationships for social features
- **TypeBox schemas** compiled to JSON for Rust validation

### Authentication
- **SurrealDB Auth** as primary auth layer (DEFINE ACCESS)
- **Better Auth v1.x** integration for:
  - Magic link (passwordless email)
  - Google OAuth
  - GitHub OAuth
  - Custom YC-style verification provider

### Testing
- **Vitest** - Unit & integration tests
- **Playwright** - E2E tests
- **MSW** - API mocking

### Deployment
- **Docker** with docker-compose
- Multi-stage builds for optimization
- SurrealDB as containerized service

---

## Architecture Principles

### 1. Colocation
Everything lives close to where it's used:
- Components with their styles, tests, and types
- Route handlers with their validation schemas
- Features as self-contained modules

### 2. Config-Driven Development
JSON configuration files as single source of truth:
- `config/app.config.json` - App settings
- `config/theme.config.json` - Design tokens
- `config/categories.config.json` - Categories & tags
- `config/routes.config.json` - Route definitions
- `config/features.config.json` - Feature flags

### 3. TypeBox Unified Types
Single schema definition used for:
- TypeScript types (frontend)
- Runtime validation (frontend & backend)
- OpenAPI spec generation
- Database schema documentation

### 4. Marketing/App Split
- `(marketing)` - Public SEO-optimized pages
- `(app)` - Authenticated application

---

## Configuration Files

### config/app.config.json
```json
{
  "$schema": "./schemas/app.schema.json",
  "name": "RFSbase",
  "tagline": "Where startup ideas come to life",
  "description": "A living idea board where founders share problems and solutions",
  "domain": "rfsbase.com",
  "social": {
    "twitter": "@rfsbase",
    "github": "rfsbase/rfsbase"
  },
  "features": {
    "magicLink": true,
    "googleOAuth": true,
    "githubOAuth": true,
    "ycVerification": true,
    "aiAssistant": true,
    "semanticSearch": true,
    "notifications": true
  },
  "limits": {
    "titleMaxLength": 100,
    "problemMaxLength": 5000,
    "solutionMaxLength": 5000,
    "commentMaxLength": 2000,
    "tagsMax": 5,
    "linksMax": 5
  },
  "pagination": {
    "defaultPageSize": 20,
    "maxPageSize": 100
  },
  "similarity": {
    "threshold": 0.8,
    "maxResults": 5
  }
}
```

### config/theme.config.json
```json
{
  "$schema": "./schemas/theme.schema.json",
  "colors": {
    "light": {
      "background": "#FAFAF9",
      "surface": "#FFFFFF",
      "surfaceAlt": "#F5F5F4",
      "border": "#E5E5E5",
      "borderHover": "#D4D4D4",
      "text": "#1D1D1F",
      "textSecondary": "#6B6B6B",
      "textMuted": "#9B9B9B",
      "primary": "#F54E00",
      "primaryHover": "#E04500",
      "primaryMuted": "#FFF1EB",
      "success": "#36B37E",
      "successMuted": "#E6F7EF",
      "warning": "#FFAB00",
      "warningMuted": "#FFF8E6",
      "error": "#FF5630",
      "errorMuted": "#FFEBE6"
    },
    "dark": {
      "background": "#0D0D0D",
      "surface": "#1D1D1F",
      "surfaceAlt": "#2D2D2F",
      "border": "#3D3D3F",
      "borderHover": "#4D4D4F",
      "text": "#EEEFE9",
      "textSecondary": "#9B9B9B",
      "textMuted": "#6B6B6B",
      "primary": "#F54E00",
      "primaryHover": "#FF6B2C",
      "primaryMuted": "#2D1A10",
      "success": "#36B37E",
      "successMuted": "#1A2E23",
      "warning": "#FFAB00",
      "warningMuted": "#2E2510",
      "error": "#FF5630",
      "errorMuted": "#2E1A17"
    }
  },
  "typography": {
    "fontFamily": {
      "sans": "Inter Variable, system-ui, -apple-system, sans-serif",
      "mono": "JetBrains Mono, Menlo, monospace"
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem"
    },
    "fontWeight": {
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700"
    },
    "lineHeight": {
      "tight": "1.25",
      "normal": "1.5",
      "relaxed": "1.75"
    }
  },
  "spacing": {
    "unit": "4px",
    "containerMax": "1200px",
    "cardPadding": "24px",
    "sectionGap": "48px"
  },
  "radius": {
    "sm": "6px",
    "md": "8px",
    "lg": "12px",
    "xl": "16px",
    "full": "9999px"
  },
  "shadow": {
    "sm": "0 1px 2px rgba(0,0,0,0.05)",
    "md": "0 4px 6px rgba(0,0,0,0.07)",
    "lg": "0 10px 15px rgba(0,0,0,0.1)",
    "xl": "0 20px 25px rgba(0,0,0,0.15)"
  },
  "animation": {
    "fast": "150ms",
    "normal": "200ms",
    "slow": "300ms",
    "easing": "cubic-bezier(0.4, 0, 0.2, 1)"
  }
}
```

### config/categories.config.json
```json
{
  "$schema": "./schemas/categories.schema.json",
  "categories": [
    { "id": "ai-ml", "label": "AI/ML", "icon": "brain", "color": "#8B5CF6" },
    { "id": "devtools", "label": "Developer Tools", "icon": "code", "color": "#06B6D4" },
    { "id": "fintech", "label": "Fintech", "icon": "dollar-sign", "color": "#10B981" },
    { "id": "healthcare", "label": "Healthcare", "icon": "heart-pulse", "color": "#EF4444" },
    { "id": "climate", "label": "Climate/Energy", "icon": "leaf", "color": "#22C55E" },
    { "id": "consumer", "label": "Consumer", "icon": "users", "color": "#F59E0B" },
    { "id": "b2b-saas", "label": "B2B SaaS", "icon": "building", "color": "#3B82F6" },
    { "id": "education", "label": "Education", "icon": "graduation-cap", "color": "#EC4899" },
    { "id": "marketplace", "label": "Marketplaces", "icon": "store", "color": "#F97316" },
    { "id": "hardware", "label": "Hardware", "icon": "cpu", "color": "#6366F1" },
    { "id": "other", "label": "Other", "icon": "sparkles", "color": "#71717A" }
  ],
  "popularTags": [
    "open-source", "api", "automation", "productivity", "mobile",
    "web3", "security", "analytics", "collaboration", "infrastructure"
  ]
}
```

### config/routes.config.json
```json
{
  "$schema": "./schemas/routes.schema.json",
  "marketing": {
    "home": "/",
    "about": "/about",
    "pricing": "/pricing",
    "blog": "/blog",
    "changelog": "/changelog",
    "terms": "/terms",
    "privacy": "/privacy"
  },
  "app": {
    "dashboard": "/app",
    "ideas": "/app/ideas",
    "ideaNew": "/app/ideas/new",
    "ideaDetail": "/app/ideas/[id]",
    "profile": "/app/profile/[id]",
    "settings": "/app/settings",
    "notifications": "/app/notifications"
  },
  "auth": {
    "login": "/login",
    "signup": "/signup",
    "verify": "/auth/verify",
    "callback": "/auth/callback/[provider]"
  },
  "api": {
    "prefix": "/api/v1",
    "auth": "/api/v1/auth",
    "ideas": "/api/v1/ideas",
    "users": "/api/v1/users",
    "comments": "/api/v1/comments",
    "notifications": "/api/v1/notifications"
  }
}
```

### config/features.config.json
```json
{
  "$schema": "./schemas/features.schema.json",
  "flags": {
    "enableAIAssistant": true,
    "enableSemanticSearch": true,
    "enableRealTimeUpdates": true,
    "enableEmailDigest": false,
    "enableReferrals": false,
    "maintenanceMode": false
  },
  "rollout": {
    "newEditor": { "percentage": 100 },
    "betaFeatures": { "percentage": 0, "allowList": [] }
  }
}
```

---

## Shared Types (TypeBox)

### packages/shared/src/schemas/user.ts
```typescript
import { Type, Static } from '@sinclair/typebox'

export const UserSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  email: Type.String({ format: 'email' }),
  name: Type.String({ minLength: 1, maxLength: 100 }),
  avatar: Type.Optional(Type.String({ format: 'uri' })),
  bio: Type.Optional(Type.String({ maxLength: 500 })),
  verified: Type.Object({
    email: Type.Boolean({ default: false }),
    yc: Type.Optional(Type.Object({
      companyName: Type.String(),
      batch: Type.String(),
      verifiedAt: Type.String({ format: 'date-time' })
    }))
  }),
  stats: Type.Object({
    ideasCount: Type.Integer({ minimum: 0, default: 0 }),
    votesReceived: Type.Integer({ minimum: 0, default: 0 }),
    commentsCount: Type.Integer({ minimum: 0, default: 0 }),
    followersCount: Type.Integer({ minimum: 0, default: 0 }),
    followingCount: Type.Integer({ minimum: 0, default: 0 })
  }),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
})

export type User = Static<typeof UserSchema>

export const UserCreateSchema = Type.Pick(UserSchema, ['email', 'name'])
export type UserCreate = Static<typeof UserCreateSchema>

export const UserUpdateSchema = Type.Partial(
  Type.Pick(UserSchema, ['name', 'avatar', 'bio'])
)
export type UserUpdate = Static<typeof UserUpdateSchema>
```

### packages/shared/src/schemas/idea.ts
```typescript
import { Type, Static } from '@sinclair/typebox'
import appConfig from '../../../../config/app.config.json'

export const IdeaSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  author: Type.Object({
    id: Type.String({ format: 'uuid' }),
    name: Type.String(),
    avatar: Type.Optional(Type.String({ format: 'uri' })),
    verified: Type.Boolean()
  }),
  title: Type.String({
    minLength: 10,
    maxLength: appConfig.limits.titleMaxLength
  }),
  problem: Type.String({
    minLength: 50,
    maxLength: appConfig.limits.problemMaxLength
  }),
  solution: Type.Optional(Type.String({
    maxLength: appConfig.limits.solutionMaxLength
  })),
  targetAudience: Type.Optional(Type.String({ maxLength: 500 })),
  category: Type.String(),
  tags: Type.Array(Type.String(), {
    maxItems: appConfig.limits.tagsMax
  }),
  links: Type.Array(Type.String({ format: 'uri' }), {
    maxItems: appConfig.limits.linksMax
  }),
  votes: Type.Object({
    problem: Type.Integer({ minimum: 0, default: 0 }),
    solution: Type.Integer({ minimum: 0, default: 0 }),
    total: Type.Integer({ minimum: 0, default: 0 })
  }),
  commentCount: Type.Integer({ minimum: 0, default: 0 }),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
})

export type Idea = Static<typeof IdeaSchema>

export const IdeaCreateSchema = Type.Object({
  title: IdeaSchema.properties.title,
  problem: IdeaSchema.properties.problem,
  solution: Type.Optional(IdeaSchema.properties.solution),
  targetAudience: Type.Optional(IdeaSchema.properties.targetAudience),
  category: IdeaSchema.properties.category,
  tags: Type.Optional(IdeaSchema.properties.tags),
  links: Type.Optional(IdeaSchema.properties.links)
})

export type IdeaCreate = Static<typeof IdeaCreateSchema>

export const IdeaUpdateSchema = Type.Partial(IdeaCreateSchema)
export type IdeaUpdate = Static<typeof IdeaUpdateSchema>

export const IdeaSimilarityQuerySchema = Type.Object({
  text: Type.String({ minLength: 20 }),
  threshold: Type.Optional(Type.Number({ minimum: 0, maximum: 1 })),
  limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 20 }))
})

export type IdeaSimilarityQuery = Static<typeof IdeaSimilarityQuerySchema>
```

### packages/shared/src/schemas/comment.ts
```typescript
import { Type, Static } from '@sinclair/typebox'
import appConfig from '../../../../config/app.config.json'

export const CommentSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  ideaId: Type.String({ format: 'uuid' }),
  author: Type.Object({
    id: Type.String({ format: 'uuid' }),
    name: Type.String(),
    avatar: Type.Optional(Type.String({ format: 'uri' })),
    verified: Type.Boolean()
  }),
  parentId: Type.Optional(Type.String({ format: 'uuid' })),
  content: Type.String({
    minLength: 1,
    maxLength: appConfig.limits.commentMaxLength
  }),
  upvotes: Type.Integer({ minimum: 0, default: 0 }),
  replies: Type.Optional(Type.Array(Type.Ref('CommentSchema'))),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
})

export type Comment = Static<typeof CommentSchema>

export const CommentCreateSchema = Type.Object({
  ideaId: CommentSchema.properties.ideaId,
  parentId: Type.Optional(CommentSchema.properties.parentId),
  content: CommentSchema.properties.content
})

export type CommentCreate = Static<typeof CommentCreateSchema>
```

### packages/shared/src/schemas/api.ts
```typescript
import { Type, Static } from '@sinclair/typebox'

// Pagination
export const PaginationSchema = Type.Object({
  page: Type.Integer({ minimum: 1, default: 1 }),
  pageSize: Type.Integer({ minimum: 1, maximum: 100, default: 20 }),
  total: Type.Integer({ minimum: 0 }),
  totalPages: Type.Integer({ minimum: 0 }),
  hasNext: Type.Boolean(),
  hasPrev: Type.Boolean()
})

export type Pagination = Static<typeof PaginationSchema>

// API Response wrapper
export const ApiResponseSchema = <T extends TSchema>(dataSchema: T) =>
  Type.Object({
    success: Type.Boolean(),
    data: Type.Optional(dataSchema),
    error: Type.Optional(Type.Object({
      code: Type.String(),
      message: Type.String(),
      details: Type.Optional(Type.Unknown())
    })),
    pagination: Type.Optional(PaginationSchema)
  })

// List query params
export const ListQuerySchema = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 1 })),
  pageSize: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
  sortBy: Type.Optional(Type.String()),
  sortOrder: Type.Optional(Type.Union([
    Type.Literal('asc'),
    Type.Literal('desc')
  ])),
  search: Type.Optional(Type.String()),
  category: Type.Optional(Type.String()),
  tags: Type.Optional(Type.Array(Type.String()))
})

export type ListQuery = Static<typeof ListQuerySchema>
```

---

## File Structure (Colocation Architecture)

```
rfsbase/
├── config/                          # Config-driven source of truth
│   ├── schemas/                     # JSON Schema for config validation
│   │   ├── app.schema.json
│   │   ├── theme.schema.json
│   │   ├── categories.schema.json
│   │   ├── routes.schema.json
│   │   └── features.schema.json
│   ├── app.config.json
│   ├── theme.config.json
│   ├── categories.config.json
│   ├── routes.config.json
│   └── features.config.json
│
├── packages/
│   └── shared/                      # Shared TypeBox schemas
│       ├── src/
│       │   ├── schemas/
│       │   │   ├── user.ts
│       │   │   ├── idea.ts
│       │   │   ├── comment.ts
│       │   │   ├── vote.ts
│       │   │   ├── notification.ts
│       │   │   └── api.ts
│       │   ├── index.ts
│       │   └── validators.ts        # TypeBox validators
│       ├── dist/                    # Compiled JSON schemas for Rust
│       ├── package.json
│       └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx           # Root layout
│   │   │   ├── globals.css          # Global styles (Tailwind 4)
│   │   │   │
│   │   │   ├── (marketing)/         # Public SEO-optimized pages
│   │   │   │   ├── layout.tsx       # Marketing layout (header, footer)
│   │   │   │   ├── page.tsx         # Landing page
│   │   │   │   ├── page.test.tsx    # Colocated test
│   │   │   │   ├── about/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── page.test.tsx
│   │   │   │   ├── pricing/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── blog/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── changelog/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── (legal)/
│   │   │   │       ├── terms/page.tsx
│   │   │   │       └── privacy/page.tsx
│   │   │   │
│   │   │   ├── (auth)/              # Auth pages (public but minimal)
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── login/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── page.test.tsx
│   │   │   │   │   └── _components/
│   │   │   │   │       ├── LoginForm.tsx
│   │   │   │   │       └── LoginForm.test.tsx
│   │   │   │   ├── signup/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── verify/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── (app)/               # Authenticated app
│   │   │   │   ├── layout.tsx       # App layout (sidebar, auth check)
│   │   │   │   ├── page.tsx         # Dashboard / Feed
│   │   │   │   │
│   │   │   │   ├── ideas/
│   │   │   │   │   ├── page.tsx     # Ideas list
│   │   │   │   │   ├── page.test.tsx
│   │   │   │   │   ├── _components/
│   │   │   │   │   │   ├── IdeaCard.tsx
│   │   │   │   │   │   ├── IdeaCard.test.tsx
│   │   │   │   │   │   ├── IdeaList.tsx
│   │   │   │   │   │   ├── IdeaFilters.tsx
│   │   │   │   │   │   └── IdeaSkeleton.tsx
│   │   │   │   │   ├── _hooks/
│   │   │   │   │   │   ├── useIdeas.ts
│   │   │   │   │   │   └── useIdeas.test.ts
│   │   │   │   │   ├── _actions/
│   │   │   │   │   │   └── ideas.ts  # Server Actions
│   │   │   │   │   │
│   │   │   │   │   ├── new/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── page.test.tsx
│   │   │   │   │   │   └── _components/
│   │   │   │   │   │       ├── IdeaForm.tsx
│   │   │   │   │   │       ├── IdeaForm.test.tsx
│   │   │   │   │   │       ├── SimilarIdeas.tsx
│   │   │   │   │   │       ├── SimilarIdeas.test.tsx
│   │   │   │   │   │       └── CategorySelect.tsx
│   │   │   │   │   │
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       ├── page.test.tsx
│   │   │   │   │       ├── loading.tsx
│   │   │   │   │       └── _components/
│   │   │   │   │           ├── IdeaDetail.tsx
│   │   │   │   │           ├── VoteButtons.tsx
│   │   │   │   │           ├── VoteButtons.test.tsx
│   │   │   │   │           ├── CommentSection.tsx
│   │   │   │   │           ├── CommentForm.tsx
│   │   │   │   │           └── RelatedIdeas.tsx
│   │   │   │   │
│   │   │   │   ├── profile/
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       └── _components/
│   │   │   │   │           ├── ProfileHeader.tsx
│   │   │   │   │           ├── ProfileStats.tsx
│   │   │   │   │           └── UserIdeas.tsx
│   │   │   │   │
│   │   │   │   ├── settings/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── _components/
│   │   │   │   │       ├── SettingsForm.tsx
│   │   │   │   │       └── YCVerification.tsx
│   │   │   │   │
│   │   │   │   └── notifications/
│   │   │   │       ├── page.tsx
│   │   │   │       └── _components/
│   │   │   │           └── NotificationList.tsx
│   │   │   │
│   │   │   └── api/                 # API Routes (Next.js)
│   │   │       ├── auth/
│   │   │       │   └── [...betterauth]/route.ts
│   │   │       └── ai/
│   │   │           ├── similar/route.ts      # Similarity search
│   │   │           ├── refine/route.ts       # AI refinement
│   │   │           └── embed/route.ts        # Generate embeddings
│   │   │
│   │   ├── components/              # Shared UI components
│   │   │   ├── ui/                  # Base UI primitives
│   │   │   │   ├── Button/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Button.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Input/
│   │   │   │   │   ├── Input.tsx
│   │   │   │   │   ├── Input.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Card/
│   │   │   │   ├── Avatar/
│   │   │   │   ├── Badge/
│   │   │   │   ├── Toast/
│   │   │   │   ├── Skeleton/
│   │   │   │   ├── Modal/
│   │   │   │   ├── Dropdown/
│   │   │   │   └── index.ts         # Barrel export
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Header/
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   ├── Header.test.tsx
│   │   │   │   │   ├── NavLinks.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Footer/
│   │   │   │   ├── Sidebar/
│   │   │   │   └── ThemeToggle/
│   │   │   │
│   │   │   └── shared/
│   │   │       ├── SearchBar/
│   │   │       ├── UserMenu/
│   │   │       └── EmptyState/
│   │   │
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   │   ├── client.ts        # API client
│   │   │   │   ├── client.test.ts
│   │   │   │   └── endpoints.ts
│   │   │   ├── auth/
│   │   │   │   ├── client.ts        # Better Auth client
│   │   │   │   ├── provider.tsx
│   │   │   │   └── hooks.ts
│   │   │   ├── ai/
│   │   │   │   ├── client.ts        # Vercel AI SDK client
│   │   │   │   └── hooks.ts
│   │   │   ├── config/
│   │   │   │   ├── loader.ts        # Load JSON configs
│   │   │   │   └── types.ts
│   │   │   ├── theme/
│   │   │   │   ├── provider.tsx
│   │   │   │   ├── hooks.ts
│   │   │   │   └── utils.ts
│   │   │   └── utils/
│   │   │       ├── cn.ts            # clsx + tailwind-merge
│   │   │       ├── date.ts
│   │   │       └── format.ts
│   │   │
│   │   └── types/
│   │       └── index.ts             # Re-export from shared
│   │
│   ├── e2e/                         # Playwright E2E tests
│   │   ├── fixtures/
│   │   │   ├── auth.fixture.ts
│   │   │   └── idea.fixture.ts
│   │   ├── auth.spec.ts
│   │   ├── ideas.spec.ts
│   │   ├── comments.spec.ts
│   │   ├── search.spec.ts
│   │   ├── profile.spec.ts
│   │   └── theme.spec.ts
│   │
│   ├── public/
│   │   ├── fonts/
│   │   ├── images/
│   │   └── og/                      # OG images
│   │
│   ├── package.json
│   ├── next.config.ts
│   ├── postcss.config.mjs
│   ├── vitest.config.ts
│   ├── playwright.config.ts
│   └── tsconfig.json
│
├── backend/
│   ├── src/
│   │   ├── main.rs
│   │   ├── lib.rs
│   │   ├── config/
│   │   │   ├── mod.rs
│   │   │   └── loader.rs            # Load JSON configs
│   │   │
│   │   ├── db/
│   │   │   ├── mod.rs
│   │   │   ├── connection.rs
│   │   │   ├── migrations/
│   │   │   │   ├── mod.rs
│   │   │   │   └── v001_initial.surql
│   │   │   └── queries/
│   │   │       ├── mod.rs
│   │   │       ├── users.rs
│   │   │       ├── ideas.rs
│   │   │       └── comments.rs
│   │   │
│   │   ├── auth/
│   │   │   ├── mod.rs
│   │   │   ├── middleware.rs
│   │   │   ├── session.rs
│   │   │   ├── magic_link.rs
│   │   │   ├── oauth/
│   │   │   │   ├── mod.rs
│   │   │   │   ├── google.rs
│   │   │   │   └── github.rs
│   │   │   └── yc_verify.rs
│   │   │
│   │   ├── routes/
│   │   │   ├── mod.rs
│   │   │   ├── auth/
│   │   │   │   ├── mod.rs
│   │   │   │   ├── handlers.rs
│   │   │   │   └── handlers.test.rs
│   │   │   ├── ideas/
│   │   │   │   ├── mod.rs
│   │   │   │   ├── handlers.rs
│   │   │   │   ├── handlers.test.rs
│   │   │   │   └── similarity.rs
│   │   │   ├── comments/
│   │   │   ├── users/
│   │   │   └── notifications/
│   │   │
│   │   ├── services/
│   │   │   ├── mod.rs
│   │   │   ├── email/
│   │   │   │   ├── mod.rs
│   │   │   │   └── templates.rs
│   │   │   ├── embedding/
│   │   │   │   ├── mod.rs
│   │   │   │   └── openai.rs
│   │   │   └── search/
│   │   │       ├── mod.rs
│   │   │       └── vector.rs
│   │   │
│   │   ├── models/
│   │   │   ├── mod.rs               # Uses TypeBox-generated JSON
│   │   │   ├── user.rs
│   │   │   ├── idea.rs
│   │   │   ├── comment.rs
│   │   │   └── notification.rs
│   │   │
│   │   └── error.rs
│   │
│   ├── tests/
│   │   ├── common/
│   │   │   └── mod.rs
│   │   ├── auth_test.rs
│   │   ├── ideas_test.rs
│   │   └── integration_test.rs
│   │
│   ├── Cargo.toml
│   └── .env.example
│
├── docker/
│   ├── frontend.Dockerfile
│   ├── backend.Dockerfile
│   └── surrealdb/
│       └── init.surql
│
├── docker-compose.yml
├── docker-compose.prod.yml
├── package.json                     # Monorepo root (pnpm workspaces)
├── pnpm-workspace.yaml
├── turbo.json                       # Turborepo config
├── SPECS.md
├── README.md
└── .env.example
```

---

## Design System (PostHog-Inspired)

### Tailwind 4 CSS Configuration (globals.css)
```css
@import "tailwindcss";
@import url('https://rsms.me/inter/inter.css');

@theme {
  /* Colors - Light mode (default) */
  --color-background: #FAFAF9;
  --color-surface: #FFFFFF;
  --color-surface-alt: #F5F5F4;
  --color-border: #E5E5E5;
  --color-border-hover: #D4D4D4;
  --color-text: #1D1D1F;
  --color-text-secondary: #6B6B6B;
  --color-text-muted: #9B9B9B;
  --color-primary: #F54E00;
  --color-primary-hover: #E04500;
  --color-primary-muted: #FFF1EB;
  --color-success: #36B37E;
  --color-success-muted: #E6F7EF;
  --color-warning: #FFAB00;
  --color-warning-muted: #FFF8E6;
  --color-error: #FF5630;
  --color-error-muted: #FFEBE6;

  /* Typography */
  --font-sans: 'Inter var', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', Menlo, monospace;

  /* Spacing */
  --spacing-unit: 4px;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.15);

  /* Animation */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dark mode */
.dark {
  --color-background: #0D0D0D;
  --color-surface: #1D1D1F;
  --color-surface-alt: #2D2D2F;
  --color-border: #3D3D3F;
  --color-border-hover: #4D4D4F;
  --color-text: #EEEFE9;
  --color-text-secondary: #9B9B9B;
  --color-text-muted: #6B6B6B;
  --color-primary-muted: #2D1A10;
  --color-success-muted: #1A2E23;
  --color-warning-muted: #2E2510;
  --color-error-muted: #2E1A17;
}

/* Base styles */
body {
  font-family: var(--font-sans);
  background: var(--color-background);
  color: var(--color-text);
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
}

/* Focus styles */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Selection */
::selection {
  background: var(--color-primary-muted);
  color: var(--color-primary);
}
```

---

## AI Features (Vercel AI SDK 6.x)

### Similar Ideas Detection
```typescript
// frontend/src/app/(app)/ideas/new/_components/SimilarIdeas.tsx
'use client'

import { useCompletion } from 'ai/react'
import { useEffect, useState } from 'react'
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue'

export function SimilarIdeas({ problem }: { problem: string }) {
  const [debouncedProblem] = useDebouncedValue(problem, 500)
  const [similar, setSimilar] = useState<Idea[]>([])

  useEffect(() => {
    if (debouncedProblem.length < 50) return

    fetch('/api/ai/similar', {
      method: 'POST',
      body: JSON.stringify({ text: debouncedProblem }),
    })
      .then((res) => res.json())
      .then((data) => setSimilar(data.ideas))
  }, [debouncedProblem])

  if (similar.length === 0) return null

  return (
    <div className="rounded-lg border border-warning bg-warning-muted p-4">
      <h3 className="font-semibold text-warning">Similar ideas exist</h3>
      <p className="text-sm text-text-secondary mt-1">
        Consider adding to an existing idea instead:
      </p>
      {/* ... render similar ideas ... */}
    </div>
  )
}
```

### AI-Assisted Refinement
```typescript
// frontend/src/app/api/ai/refine/route.ts
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { problem, type } = await req.json()

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `You help founders refine their startup problem statements.
      Be concise and actionable. Focus on clarity and specificity.`,
    prompt: type === 'improve'
      ? `Improve this problem statement for clarity: "${problem}"`
      : `Suggest 3 relevant tags for this problem: "${problem}"`,
  })

  return result.toDataStreamResponse()
}
```

### Embedding Generation for Vector Search
```typescript
// frontend/src/app/api/ai/embed/route.ts
import { embed } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { text } = await req.json()

  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: text,
  })

  return Response.json({ embedding })
}
```

---

## Database Schema (SurrealDB 2.x)

```surql
-- Enable strict mode
OPTION IMPORT;

-- Namespace and Database
DEFINE NAMESPACE rfsbase;
USE NS rfsbase;
DEFINE DATABASE main;
USE DB main;

-- ============================================
-- AUTHENTICATION (SurrealDB Native + Better Auth)
-- ============================================

-- Access method for JWT tokens
DEFINE ACCESS user_access ON DATABASE TYPE JWT
  ALGORITHM HS256 KEY $JWT_SECRET
  WITH ISSUER 'rfsbase'
  DURATION FOR TOKEN 7d, FOR SESSION 30d;

-- ============================================
-- TABLES
-- ============================================

-- Users
DEFINE TABLE user SCHEMAFULL PERMISSIONS
  FOR select FULL
  FOR create WHERE $auth.id = id
  FOR update WHERE $auth.id = id
  FOR delete NONE;

DEFINE FIELD email ON user TYPE string
  ASSERT string::is::email($value);
DEFINE FIELD name ON user TYPE string
  ASSERT string::len($value) >= 1 AND string::len($value) <= 100;
DEFINE FIELD avatar ON user TYPE option<string>;
DEFINE FIELD bio ON user TYPE option<string>;
DEFINE FIELD verified_email ON user TYPE bool DEFAULT false;
DEFINE FIELD verified_yc ON user TYPE option<object>;
DEFINE FIELD created_at ON user TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON user TYPE datetime VALUE time::now();

DEFINE INDEX user_email ON user COLUMNS email UNIQUE;

-- Sessions
DEFINE TABLE session SCHEMAFULL PERMISSIONS
  FOR select WHERE user = $auth.id
  FOR create WHERE user = $auth.id
  FOR update NONE
  FOR delete WHERE user = $auth.id;

DEFINE FIELD user ON session TYPE record<user>;
DEFINE FIELD token ON session TYPE string;
DEFINE FIELD expires_at ON session TYPE datetime;
DEFINE FIELD ip ON session TYPE option<string>;
DEFINE FIELD user_agent ON session TYPE option<string>;
DEFINE FIELD created_at ON session TYPE datetime DEFAULT time::now();

DEFINE INDEX session_token ON session COLUMNS token UNIQUE;

-- Ideas
DEFINE TABLE idea SCHEMAFULL PERMISSIONS
  FOR select FULL
  FOR create WHERE $auth.id != NONE
  FOR update WHERE author = $auth.id
  FOR delete WHERE author = $auth.id;

DEFINE FIELD author ON idea TYPE record<user>;
DEFINE FIELD title ON idea TYPE string
  ASSERT string::len($value) >= 10 AND string::len($value) <= 100;
DEFINE FIELD problem ON idea TYPE string
  ASSERT string::len($value) >= 50 AND string::len($value) <= 5000;
DEFINE FIELD solution ON idea TYPE option<string>;
DEFINE FIELD target_audience ON idea TYPE option<string>;
DEFINE FIELD category ON idea TYPE string;
DEFINE FIELD tags ON idea TYPE array<string> DEFAULT [];
DEFINE FIELD links ON idea TYPE array<string> DEFAULT [];
DEFINE FIELD embedding ON idea TYPE option<array<float>>;
DEFINE FIELD votes_problem ON idea TYPE int DEFAULT 0;
DEFINE FIELD votes_solution ON idea TYPE int DEFAULT 0;
DEFINE FIELD votes_total ON idea TYPE int DEFAULT 0;
DEFINE FIELD comment_count ON idea TYPE int DEFAULT 0;
DEFINE FIELD created_at ON idea TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON idea TYPE datetime VALUE time::now();

-- Vector index for semantic search
DEFINE INDEX idea_embedding ON idea COLUMNS embedding MTREE DIMENSION 1536 DIST COSINE;
DEFINE INDEX idea_created ON idea COLUMNS created_at;
DEFINE INDEX idea_category ON idea COLUMNS category;

-- Votes (using RELATION for graph queries)
DEFINE TABLE vote SCHEMAFULL PERMISSIONS
  FOR select FULL
  FOR create WHERE $auth.id != NONE
  FOR update NONE
  FOR delete WHERE user = $auth.id;

DEFINE FIELD user ON vote TYPE record<user>;
DEFINE FIELD idea ON vote TYPE record<idea>;
DEFINE FIELD type ON vote TYPE string
  ASSERT $value IN ['problem', 'solution'];
DEFINE FIELD created_at ON vote TYPE datetime DEFAULT time::now();

DEFINE INDEX vote_unique ON vote COLUMNS user, idea, type UNIQUE;

-- Comments
DEFINE TABLE comment SCHEMAFULL PERMISSIONS
  FOR select FULL
  FOR create WHERE $auth.id != NONE
  FOR update WHERE author = $auth.id
  FOR delete WHERE author = $auth.id;

DEFINE FIELD author ON comment TYPE record<user>;
DEFINE FIELD idea ON comment TYPE record<idea>;
DEFINE FIELD parent ON comment TYPE option<record<comment>>;
DEFINE FIELD content ON comment TYPE string
  ASSERT string::len($value) >= 1 AND string::len($value) <= 2000;
DEFINE FIELD upvotes ON comment TYPE int DEFAULT 0;
DEFINE FIELD created_at ON comment TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON comment TYPE datetime VALUE time::now();

DEFINE INDEX comment_idea ON comment COLUMNS idea;

-- Comment Upvotes
DEFINE TABLE comment_upvote SCHEMAFULL PERMISSIONS
  FOR select FULL
  FOR create WHERE $auth.id != NONE
  FOR delete WHERE user = $auth.id;

DEFINE FIELD user ON comment_upvote TYPE record<user>;
DEFINE FIELD comment ON comment_upvote TYPE record<comment>;
DEFINE FIELD created_at ON comment_upvote TYPE datetime DEFAULT time::now();

DEFINE INDEX comment_upvote_unique ON comment_upvote COLUMNS user, comment UNIQUE;

-- Follows (Graph relation)
DEFINE TABLE follows TYPE RELATION FROM user TO user SCHEMAFULL PERMISSIONS
  FOR select FULL
  FOR create WHERE in = $auth.id
  FOR delete WHERE in = $auth.id;

DEFINE FIELD created_at ON follows TYPE datetime DEFAULT time::now();
DEFINE INDEX follows_unique ON follows COLUMNS in, out UNIQUE;

-- Notifications
DEFINE TABLE notification SCHEMAFULL PERMISSIONS
  FOR select WHERE user = $auth.id
  FOR create FULL
  FOR update WHERE user = $auth.id
  FOR delete WHERE user = $auth.id;

DEFINE FIELD user ON notification TYPE record<user>;
DEFINE FIELD type ON notification TYPE string
  ASSERT $value IN ['vote', 'comment', 'reply', 'follow', 'similar'];
DEFINE FIELD data ON notification TYPE object;
DEFINE FIELD read ON notification TYPE bool DEFAULT false;
DEFINE FIELD created_at ON notification TYPE datetime DEFAULT time::now();

DEFINE INDEX notification_user ON notification COLUMNS user, created_at;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Find similar ideas using vector search
DEFINE FUNCTION fn::find_similar($embedding: array<float>, $threshold: float, $limit: int) {
  RETURN SELECT
    id, title, problem, category, votes_total,
    vector::similarity::cosine(embedding, $embedding) AS similarity
  FROM idea
  WHERE embedding != NONE
    AND vector::similarity::cosine(embedding, $embedding) >= $threshold
  ORDER BY similarity DESC
  LIMIT $limit;
};

-- Update vote counts (called by event)
DEFINE FUNCTION fn::update_vote_counts($idea_id: record<idea>) {
  LET $problem = (SELECT count() FROM vote WHERE idea = $idea_id AND type = 'problem' GROUP ALL)[0].count ?? 0;
  LET $solution = (SELECT count() FROM vote WHERE idea = $idea_id AND type = 'solution' GROUP ALL)[0].count ?? 0;
  UPDATE $idea_id SET
    votes_problem = $problem,
    votes_solution = $solution,
    votes_total = $problem + $solution;
};

-- ============================================
-- EVENTS (Triggers)
-- ============================================

-- Update vote counts on vote change
DEFINE EVENT vote_created ON TABLE vote WHEN $event = 'CREATE' THEN {
  fn::update_vote_counts($after.idea);
};

DEFINE EVENT vote_deleted ON TABLE vote WHEN $event = 'DELETE' THEN {
  fn::update_vote_counts($before.idea);
};

-- Update comment count
DEFINE EVENT comment_created ON TABLE comment WHEN $event = 'CREATE' THEN {
  UPDATE $after.idea SET comment_count += 1;
};

DEFINE EVENT comment_deleted ON TABLE comment WHEN $event = 'DELETE' THEN {
  UPDATE $before.idea SET comment_count -= 1;
};

-- Create notification on vote
DEFINE EVENT notify_vote ON TABLE vote WHEN $event = 'CREATE' THEN {
  LET $author = (SELECT author FROM $after.idea)[0].author;
  IF $author != $after.user {
    CREATE notification SET
      user = $author,
      type = 'vote',
      data = {
        idea: $after.idea,
        voter: $after.user,
        vote_type: $after.type
      };
  };
};
```

---

## SEO Optimization (Marketing Pages)

### Dynamic Metadata
```typescript
// frontend/src/app/(marketing)/page.tsx
import { Metadata } from 'next'
import appConfig from '@/../config/app.config.json'

export const metadata: Metadata = {
  title: `${appConfig.name} - ${appConfig.tagline}`,
  description: appConfig.description,
  keywords: ['startup ideas', 'request for startup', 'RFS', 'YC', 'founders'],
  authors: [{ name: appConfig.name }],
  openGraph: {
    title: `${appConfig.name} - ${appConfig.tagline}`,
    description: appConfig.description,
    url: `https://${appConfig.domain}`,
    siteName: appConfig.name,
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${appConfig.name} - ${appConfig.tagline}`,
    description: appConfig.description,
    creator: appConfig.social.twitter,
    images: ['/og/home.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

### Structured Data (JSON-LD)
```typescript
// frontend/src/app/(marketing)/layout.tsx
export default function MarketingLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'RFSbase',
    description: 'A living idea board where founders share problems and solutions',
    url: 'https://rfsbase.com',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MarketingHeader />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```

### Sitemap Generation
```typescript
// frontend/src/app/sitemap.ts
import { MetadataRoute } from 'next'
import routesConfig from '@/../config/routes.config.json'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://rfsbase.com'

  // Static marketing pages
  const marketingPages = Object.values(routesConfig.marketing).map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '/' ? 1 : 0.8,
  }))

  // Dynamic idea pages (fetch from API)
  const ideas = await fetch(`${process.env.API_URL}/api/v1/ideas?pageSize=1000`)
    .then((r) => r.json())

  const ideaPages = ideas.data.map((idea: any) => ({
    url: `${baseUrl}/app/ideas/${idea.id}`,
    lastModified: new Date(idea.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }))

  return [...marketingPages, ...ideaPages]
}
```

---

## Test Configuration

### Vitest Config
```typescript
// frontend/vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['**/e2e/**', '**/node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**', '**/*.test.{ts,tsx}'],
    },
  },
})
```

### Playwright Config
```typescript
// frontend/playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### E2E Test Example
```typescript
// frontend/e2e/ideas.spec.ts
import { test, expect } from '@playwright/test'
import { login } from './fixtures/auth.fixture'

test.describe('Ideas', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('should show similar ideas when creating', async ({ page }) => {
    await page.goto('/app/ideas/new')

    // Fill in a problem that matches existing ideas
    await page.getByLabel('Problem').fill(
      'Building AI agents is difficult because there are no good tools for debugging and monitoring their behavior in production.'
    )

    // Wait for similar ideas to appear
    await expect(page.getByText('Similar ideas exist')).toBeVisible()
    await expect(page.getByTestId('similar-idea')).toHaveCount({ minimum: 1 })
  })

  test('should create idea and appear in feed', async ({ page }) => {
    await page.goto('/app/ideas/new')

    await page.getByLabel('Title').fill('New testing framework for AI')
    await page.getByLabel('Problem').fill(
      'Current testing frameworks are not designed for AI applications. They cannot handle non-deterministic outputs, making it hard to write reliable tests for AI features.'
    )
    await page.getByLabel('Category').selectOption('devtools')
    await page.getByRole('button', { name: 'Create Idea' }).click()

    // Should redirect to idea page
    await expect(page).toHaveURL(/\/app\/ideas\/[a-z0-9]+/)

    // Go to feed and verify it appears
    await page.goto('/app/ideas')
    await expect(page.getByText('New testing framework for AI')).toBeVisible()
  })

  test('should vote on idea', async ({ page }) => {
    await page.goto('/app/ideas')

    const ideaCard = page.getByTestId('idea-card').first()
    const voteCount = await ideaCard.getByTestId('vote-count').textContent()

    await ideaCard.getByRole('button', { name: 'I have this problem' }).click()

    // Optimistic update
    await expect(ideaCard.getByTestId('vote-count')).toHaveText(
      String(Number(voteCount) + 1)
    )

    // Persist after refresh
    await page.reload()
    await expect(ideaCard.getByTestId('vote-count')).toHaveText(
      String(Number(voteCount) + 1)
    )
  })
})
```

---

## Implementation Priority (Updated)

### Phase 1: Foundation
1. Monorepo setup (pnpm workspaces, Turborepo)
2. Config files and JSON schemas
3. Shared TypeBox schemas package
4. Docker + SurrealDB setup
5. Basic Next.js 16 structure with marketing/app split

### Phase 2: Core Infrastructure
6. Tailwind 4 theme system (dark/light)
7. Axum backend with SurrealDB connection
8. Better Auth integration (SurrealDB adapter)
9. Base UI components

### Phase 3: Features
10. Idea CRUD with validation
11. Voting system
12. Comments with threading
13. User profiles

### Phase 4: AI & Search
14. Vercel AI SDK integration
15. Embedding generation
16. Vector similarity search
17. Similar idea detection

### Phase 5: Testing & Polish
18. Vitest unit tests
19. Playwright E2E tests
20. SEO optimization
21. Performance tuning

### Phase 6: Launch
22. Analytics
23. Product Hunt assets
24. Documentation

---

## Package Versions (Latest as of Jan 2025)

```json
{
  "frontend": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "ai": "^6.0.0",
    "@ai-sdk/openai": "^1.0.0",
    "better-auth": "^1.2.0",
    "@sinclair/typebox": "^0.34.0",
    "lucide-react": "^0.470.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "vitest": "^3.0.0",
    "@playwright/test": "^1.50.0",
    "msw": "^2.7.0",
    "@testing-library/react": "^16.0.0"
  },
  "backend": {
    "axum": "0.8",
    "tokio": "1.43",
    "surrealdb": "2.1",
    "serde": "1.0",
    "jsonschema": "0.26"
  }
}
```

---

## Environment Variables

```env
# App
NODE_ENV=development
APP_URL=http://localhost:3000
API_URL=http://localhost:3001

# Database
SURREAL_URL=ws://localhost:8000
SURREAL_NS=rfsbase
SURREAL_DB=main
SURREAL_USER=root
SURREAL_PASS=root

# Auth
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
BETTER_AUTH_SECRET=your-better-auth-secret
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Email (for magic links)
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
RESEND_API_KEY=
FROM_EMAIL=noreply@rfsbase.com

# AI (Vercel AI SDK)
OPENAI_API_KEY=

# Analytics (optional)
POSTHOG_KEY=
POSTHOG_HOST=
```
