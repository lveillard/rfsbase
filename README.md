# RFSbase

**Request for Startup Idea Board**

A living platform where founders and entrepreneurs share problems they're facing, propose solutions, and the community votes and comments to surface the best ideas for new startups. Inspired by Y Combinator's RFS (Request for Startups) concept.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16 (App Router, Server Components, Server Actions) |
| **UI** | React 19, Tailwind CSS 4 |
| **Backend** | Next.js Server Actions + API Routes (consolidated) |
| **Database** | SurrealDB 2.x (multi-model with vector search) |
| **Auth** | Better Auth + SurrealDB Adapter |
| **AI** | Vercel AI SDK, OpenAI |
| **Testing** | Vitest, Playwright, MSW |
| **Build System** | Turborepo, pnpm workspaces |

---

## Features

### Core Functionality
- **Idea Submission** - Share startup problems and proposed solutions with rich formatting
- **Community Voting** - Upvote and downvote to surface the best ideas
- **Comments & Discussion** - Engage with ideas through threaded comments
- **Categories & Tags** - Organize ideas by industry, technology, and problem type

### AI-Powered
- **Idea Refinement** - AI assistant helps improve your idea descriptions
- **Semantic Search** - Find similar ideas using vector embeddings
- **Smart Suggestions** - Get related ideas based on content similarity

### Authentication
- **Magic Link (Passwordless)** - Email-based authentication
- **OAuth Integration** - Google and GitHub sign-in
- **YC Verification** - Special verification for Y Combinator founders

### User Experience
- **Real-time Updates** - Live queries for instant updates
- **Dark/Light Mode** - Full theme support
- **Responsive Design** - Works on all devices
- **SEO Optimized** - Marketing pages optimized for search engines

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.0.0 or higher
- **pnpm** 10.x or higher
- **Docker** and Docker Compose (for database and deployment)

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/rfsbase/rfsbase.git
cd rfsbase
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your API keys and secrets (see Environment Variables section below).

### 4. Start the Database

```bash
docker compose up -d surrealdb
```

This starts SurrealDB on port 8000. The database will persist data in a Docker volume.

### 5. Start Development Server

```bash
pnpm dev
```

This starts the Next.js development server (port 3000) with Turbopack. Server Actions handle all backend logic.

### 6. (Optional) Seed Database

If you want sample data for development:

```bash
pnpm db:seed
```

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

### Application

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `APP_URL` | Frontend application URL | `http://localhost:3000` |
| `API_URL` | Backend API URL | `http://localhost:3001` |

### Database (SurrealDB)

| Variable | Description | Default |
|----------|-------------|---------|
| `SURREAL_URL` | SurrealDB connection URL | `ws://localhost:8000` |
| `SURREAL_NS` | Database namespace | `rfsbase` |
| `SURREAL_DB` | Database name | `main` |
| `SURREAL_USER` | Database username | `root` |
| `SURREAL_PASS` | Database password | `root` |

### Authentication

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | JWT signing key (min 32 characters) | Yes |
| `BETTER_AUTH_SECRET` | Better Auth secret key | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | No |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | No |

### Email (Magic Links)

| Variable | Description | Default |
|----------|-------------|---------|
| `SMTP_HOST` | SMTP server host | `smtp.resend.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `RESEND_API_KEY` | Resend API key | - |
| `FROM_EMAIL` | Sender email address | `noreply@rfsbase.com` |

### AI Features

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | No |

### Analytics (Optional)

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTHOG_KEY` | PostHog project API key | - |
| `POSTHOG_HOST` | PostHog instance URL | `https://app.posthog.com` |

---

## Project Structure

```
rfsbase/
├── frontend/                 # Next.js 16 frontend application
│   ├── src/
│   │   ├── app/             # App Router pages and layouts
│   │   │   ├── (marketing)/ # Public pages (about, pricing)
│   │   │   ├── (app)/       # Authenticated app pages
│   │   │   │   ├── ideas/   # Ideas feature (colocated)
│   │   │   │   │   ├── _hooks/      # Feature-specific hooks
│   │   │   │   │   ├── _components/ # Feature-specific components
│   │   │   │   │   └── [id]/        # Dynamic route
│   │   │   │   │       └── _components/
│   │   │   │   ├── profile/         # Profile feature
│   │   │   │   │   ├── _types.ts    # Colocated types
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── _components/
│   │   │   │   └── ...
│   │   │   ├── (auth)/      # Authentication pages
│   │   │   └── api/         # API routes (Better Auth)
│   │   │       └── auth/[...all]/
│   │   ├── lib/
│   │   │   ├── server/      # Server Actions (colocated by domain)
│   │   │   │   ├── ideas.ts
│   │   │   │   ├── comments.ts
│   │   │   │   ├── users.ts
│   │   │   │   ├── auth.ts  # Auth utilities (requireAuth)
│   │   │   │   └── types.ts # Shared type mappers
│   │   │   ├── auth.ts      # Better Auth configuration
│   │   │   ├── auth-client.ts
│   │   │   ├── db/surreal.ts
│   │   │   └── hooks/
│   │   ├── components/      # Shared UI components
│   │   └── types/           # TypeScript re-exports
│   ├── e2e/                 # Playwright E2E tests
│   └── public/              # Static assets
│
├── packages/
│   └── shared/              # Shared TypeBox schemas
│       └── src/
│           └── schemas/
│
├── config/                   # JSON configuration files
│   ├── app.config.json
│   ├── theme.config.json
│   └── categories.config.json
│
├── docker/                   # Docker configuration
│   └── frontend.Dockerfile
│
├── docker-compose.yml
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Development

### Running Tests

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode (frontend only)
cd frontend && pnpm test:watch

# Run tests with coverage
cd frontend && pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
cd frontend && pnpm test:e2e:ui
```

### Linting and Type Checking

```bash
# Run ESLint
pnpm lint

# Run TypeScript type checking
pnpm typecheck
```

### Building for Production

```bash
# Build all packages
pnpm build

# Clean build artifacts
pnpm clean
```

### Database Management

```bash
# Start database
pnpm db:start

# Stop database
pnpm db:stop

# Run migrations (auto-runs on backend start)
pnpm db:migrate
```

---

## Deployment

### Development with Docker

Start all services locally:

```bash
docker compose up
```

Or run in detached mode:

```bash
docker compose up -d
```

View logs:

```bash
docker compose logs -f
```

Stop all services:

```bash
docker compose down
```

### Production Build

Build production images:

```bash
docker compose -f docker-compose.prod.yml build
```

Run production stack:

```bash
docker compose -f docker-compose.prod.yml up -d
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| Next.js | 3000 | Frontend + Server Actions + API Routes |
| SurrealDB | 8000 | Database |

---

## Architecture

### Consolidated Next.js Architecture

All server-side logic is in Next.js:
- **Server Actions** for mutations (ideas, comments, votes)
- **API Routes** for Better Auth (`/api/auth/[...all]`)
- **SurrealDB** accessed directly from Server Actions

### Key Patterns

```typescript
// Server Action with auth wrapper
'use server'
import { requireAuth } from '@/lib/server/auth'
import { getSurrealDB } from '@/lib/db/surreal'

export async function createIdea(data: CreateIdeaInput) {
  return requireAuth(async (userId) => {
    const db = await getSurrealDB()
    // ... create idea
  })
}

// Client-side data fetching with hooks
// Hooks are colocated in app/(app)/ideas/_hooks/
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code passes all tests and linting before submitting.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Inspired by [Y Combinator's Request for Startups](https://www.ycombinator.com/rfs)
- Built with modern web technologies and best practices for 2025
