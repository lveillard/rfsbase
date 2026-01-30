# RFSbase - Project Overview

## Purpose
RFSbase is a "Request for Startup" idea board inspired by Y Combinator's RFS concept. It's a platform where founders and entrepreneurs share problems they're facing, propose solutions, and the community votes and comments to surface the best ideas for new startups.

## Tech Stack

### Frontend
- **Next.js 16** with App Router, Server Components, Server Actions
- **React 19** with Server Components
- **Tailwind CSS 4** (CSS-first configuration)
- **Vercel AI SDK 6.x** for AI features
- **TypeBox** for runtime type validation
- **Biome** for linting and formatting (NOT ESLint)
- **Zustand** for state management
- **Better Auth** for authentication

### Backend
- **Rust/Axum** - High-performance async web framework
- **SurrealDB 2.x** - Multi-model database with vector search

### Testing
- **Vitest** - Unit & integration tests
- **Playwright** - E2E tests
- **MSW** - API mocking

### Build System
- **pnpm** workspaces
- **Turborepo** for monorepo management

## Key Features
- Idea submission with rich formatting
- Community voting (problem/solution votes)
- Threaded comments
- AI-powered idea refinement and semantic search
- Magic link + OAuth authentication (Google, GitHub)
- Dark/Light theme support
