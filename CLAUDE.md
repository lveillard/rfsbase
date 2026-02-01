# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RFSbase is a "Request for Startup" idea board where founders share problems, propose solutions, and the community votes to surface the best startup ideas. Inspired by Y Combinator's RFS concept.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes + Server Actions (consolidated architecture)
- **Database**: SurrealDB 2.5+ (multi-model with vector search)
- **Auth**: Better Auth with SurrealDB Adapter
- **AI**: Vercel AI SDK + Fastembed (bge-large-en-v1.5)
- **Build**: Turborepo + pnpm workspaces

## Architecture (Consolidated)

### No Separate Backend
All server-side logic is now in Next.js:
- **Server Actions** for mutations (ideas, comments, votes)
- **API Routes** for Better Auth (`/api/auth/[...all]`)
- **SurrealDB** accessed directly from Server Actions

### SurrealDB Access Pattern

Singleton pattern with connection pooling:

```typescript
// Server Action example
'use server'
import { getSurrealDB } from '@/lib/db/surreal'

export async function createIdea(data: CreateIdeaInput) {
  const db = await getSurrealDB()

  const result = await db.query(`
    CREATE idea SET
      title = $title,
      author = type::thing('user', $userId),
      embedding = $embedding
  `, { title: data.title, userId: session.user.id, embedding })

  return result[0][0]
}
```

### Authentication Flow

Better Auth with SurrealDB adapter handles:
- Magic link authentication
- OAuth (Google, GitHub)
- Session management
- JWT tokens (managed by Better Auth)

```typescript
// Get session in Server Action or Component
import { getSession } from '@/lib/server/auth'

const session = await getSession()

// Or use requireAuth wrapper for protected actions
import { requireAuth } from '@/lib/server/auth'

export async function createIdea(data: unknown) {
  return requireAuth(async (userId) => {
    // User is authenticated, userId is available
    const db = await getSurrealDB()
    // ... create idea
  })
}
```

## Common Commands

```bash
# Development
pnpm dev                    # Run Next.js dev server (with Turbopack)
pnpm db:start               # Start SurrealDB container (port 8000)

# Testing
pnpm test                   # Run unit tests (Vitest)
pnpm test:e2e               # Run E2E tests (Playwright)
cd frontend && pnpm test:watch  # Watch mode for frontend tests

# Code Quality
pnpm lint                   # Lint all (Biome)
pnpm typecheck              # TypeScript checking

# Build
pnpm build                  # Build all packages
pnpm clean                  # Clean build artifacts

# Docker
docker compose up -d surrealdb  # Just database
docker compose up               # Full stack (frontend + surrealdb)
```

## Project Structure

```
frontend/                 # Next.js 16 App Router application
├── src/
│   ├── app/              # App Router
│   │   ├── (marketing)/  # Public SEO pages
│   │   ├── (app)/        # Authenticated area
│   │   │   ├── ideas/              # Ideas feature (colocated)
│   │   │   │   ├── _hooks/         # Feature-specific hooks
│   │   │   │   ├── _components/    # Feature-specific components
│   │   │   │   └── [id]/
│   │   │   │       └── _components/# Page-specific components
│   │   │   ├── profile/
│   │   │   │   └── _types.ts       # Shared types for profile feature
│   │   │   └── ...
│   │   ├── (auth)/       # Login/signup pages
│   │   └── api/auth/     # Better Auth API routes
│   ├── lib/
│   │   ├── server/       # Server Actions (colocated by domain)
│   │   │   ├── ideas.ts
│   │   │   ├── comments.ts
│   │   │   ├── users.ts
│   │   │   ├── auth.ts   # Auth utilities (requireAuth, getSession)
│   │   │   └── types.ts  # Shared type mappers
│   │   ├── auth.ts       # Better Auth configuration (singleton)
│   │   ├── auth-client.ts # Client-side auth
│   │   ├── db/surreal.ts # SurrealDB connection (singleton)
│   │   └── hooks/        # Shared client hooks
│   └── components/
packages/shared/          # Shared TypeBox schemas
config/                   # JSON configs (app, theme, categories, routes)
docker/                   # Dockerfiles and Caddy configs
```

### Principles

1. **Colocation**: Components, hooks, and types live close to where they're used
2. **DRY**: Shared utilities in `lib/` with clear single responsibilities
3. **Functional**: Pure functions for data transformation, immutable data structures
4. **Singleton Pattern**: Database and Auth instances are singletons to prevent connection leaks

## Database Schema

Key tables: `user`, `idea`, `comment`, `session`, `account` (Better Auth tables)

Graph relations (using SurrealDB RELATE):
- `voted` - user votes on idea (problem/solution)
- `follows` - user follows user
- `upvoted` - user upvotes comment

Vector search: Ideas have 1024-dim embeddings (bge-large-en-v1.5) indexed with MTREE for semantic similarity search.

## Data Flow

Frontend Component → Server Action → SurrealDB query
                    ↓
              Better Auth (session)

## Key Files

- `frontend/src/lib/auth.ts` - Better Auth singleton configuration with SurrealDB adapter
- `frontend/src/lib/server/*.ts` - Server Actions organized by domain (ideas, comments, users)
- `frontend/src/lib/server/auth.ts` - Auth utilities: `getSession()`, `requireAuth()`
- `frontend/src/lib/db/surreal.ts` - SurrealDB singleton connection with health checks
- `frontend/src/lib/auth-client.ts` - Client-side Better Auth client
- `frontend/src/app/api/auth/[...all]/route.ts` - Better Auth API routes handler
- `config/app.config.json` - Feature flags and content limits
- `turbo.json` - Turborepo task configuration

## Code Patterns

### Server Actions - Functional & Immutable

```typescript
'use server'

// Pure mapper functions
const mapIdea = (row: unknown): Idea => {
  const r = row as Record<string, unknown>
  return {
    id: parseId(r.id),
    title: String(r.title),
    // ... immutable transformations
  }
}

// DRY: Reuse auth wrapper
export async function createIdea(input: unknown): Promise<Idea> {
  const validated = Value.Parse(IdeaCreateSchema, input)

  return requireAuth(async (userId) => {
    const db = await getSurrealDB()
    // ... create with validated data
    return mapIdea(created)  // Always return mapped, not raw
  })
}
```

### Hooks - Colocated & Reusable

```typescript
// Feature-specific hook in app/(app)/ideas/_hooks/useIdeas.ts
// Shared generic hooks in lib/hooks/

// Use debounced values from shared hooks
import { useDebouncedValue } from '@/lib/hooks'

// Don't duplicate - import, don't reimplement
```

## Environment Variables

```bash
# Required
SURREAL_URL=http://localhost:8000
SURREAL_NS=rfsbase
SURREAL_DB=main
SURREAL_USER=root
SURREAL_PASS=root
BETTER_AUTH_SECRET=your-secret

# OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Embeddings (self-hosted Fastembed)
EMBED_URL=
EMBED_API_KEY=
```
