# RFSbase - Architecture

## Project Structure

```
rfsbase/
├── frontend/                 # Next.js 16 frontend
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── (marketing)/ # Public SEO pages
│   │   │   ├── (app)/       # Authenticated app
│   │   │   ├── (auth)/      # Auth pages
│   │   │   └── api/         # API routes (AI endpoints)
│   │   ├── components/      # Shared UI components
│   │   │   ├── ui/          # Base primitives (Button, Input, etc.)
│   │   │   ├── layout/      # Header, Footer, Sidebar
│   │   │   └── shared/      # SearchBar, UserMenu, etc.
│   │   ├── lib/             # Utilities, hooks, stores
│   │   │   ├── api/         # API client
│   │   │   ├── auth/        # Better Auth client
│   │   │   ├── ai/          # Vercel AI SDK
│   │   │   └── utils/       # Helper functions
│   │   ├── test/            # Test utilities
│   │   └── types/           # TypeScript types
│   └── e2e/                 # Playwright E2E tests
│
├── backend/                  # Rust/Axum API
│   └── src/
│       ├── auth/            # Authentication
│       ├── db/              # Database layer
│       ├── models/          # Data models
│       ├── routes/          # API handlers
│       └── services/        # Business logic
│
├── packages/
│   └── shared/              # Shared TypeBox schemas
│
├── config/                   # JSON configs (source of truth)
├── docker/                   # Docker configs
└── terraform/               # Infrastructure as code
```

## Key Architectural Decisions

### 1. TypeBox for Shared Types
Single schema definition used for:
- TypeScript types (frontend)
- Runtime validation (both sides)
- API contracts

### 2. Route Groups
- `(marketing)` - SSG/ISR optimized public pages
- `(app)` - Dynamic authenticated pages
- `(auth)` - Authentication flow pages

### 3. Server Components First
Use React Server Components by default, client components only when needed.

### 4. SurrealDB Features
- Multi-model database
- Vector embeddings with MTREE index for semantic search
- Graph relationships for social features
- Native authentication support

### 5. API Architecture
- Frontend API routes (`/api/ai/*`) for AI features
- Backend Rust API (`/api/v1/*`) for data operations
- Better Auth handles auth endpoints

## Data Flow
1. User interacts with React components
2. Server Actions or API calls to backend
3. Backend validates with TypeBox schemas
4. SurrealDB stores/retrieves data
5. Real-time updates via SurrealDB live queries
