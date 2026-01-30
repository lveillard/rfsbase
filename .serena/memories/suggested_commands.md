# RFSbase - Suggested Commands

## Development

```bash
# Install dependencies
pnpm install

# Start all dev servers (frontend + backend via Turborepo)
pnpm dev

# Start database
pnpm db:start
# or: docker compose up -d surrealdb

# Stop database
pnpm db:stop
```

## Testing

```bash
# Run all unit tests
pnpm test

# Frontend tests with watch mode
cd frontend && pnpm test:watch

# Frontend tests with coverage
cd frontend && pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# E2E tests with UI
cd frontend && pnpm test:e2e:ui
```

## Linting & Type Checking

```bash
# Run Biome linter (NOT ESLint!)
pnpm lint

# Fix lint issues
cd frontend && pnpm lint:fix

# Format code
cd frontend && pnpm format

# TypeScript type checking
pnpm typecheck
```

## Building

```bash
# Build all packages
pnpm build

# Clean build artifacts
pnpm clean
```

## Backend (Rust)

```bash
cd backend

# Run in development mode
cargo run

# Run tests
cargo test

# Build release binary
cargo build --release
```

## Docker

```bash
# Development with Docker
docker compose up

# Production build
docker compose -f docker-compose.prod.yml build

# Run production stack
docker compose -f docker-compose.prod.yml up -d

# EC2 deployment
docker compose -f docker-compose.ec2.yml up -d
```

## Database

```bash
# Run migrations (auto-runs on backend start)
pnpm db:migrate

# Seed database with sample data
pnpm db:seed
```

## System Commands (Windows)
- Use `dir` instead of `ls` for listing
- Use `type` instead of `cat` for reading files
- Use PowerShell commands when needed
- Git commands work the same as Unix
