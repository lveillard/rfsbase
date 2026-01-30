# RFSbase - Code Style & Conventions

## General Principles

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

## Frontend (TypeScript/React)

### Linting & Formatting
- **Biome** is used (NOT ESLint or Prettier)
- Run `pnpm lint:fix` to fix issues
- Run `pnpm format` to format code

### File Structure
- Page components in `src/app/` using App Router conventions
- Shared components in `src/components/`
- Route-specific components in `_components/` folders
- Hooks in `_hooks/` folders
- Server actions in `_actions/` folders

### Naming Conventions
- React components: PascalCase (`IdeaCard.tsx`)
- Hooks: camelCase with `use` prefix (`useIdeas.ts`)
- Utils: camelCase (`formatDate.ts`)
- Test files: same name with `.test.tsx` suffix

### TypeScript
- Use TypeBox schemas from `@rfsbase/shared` package
- Strict TypeScript mode enabled
- Prefer `type` over `interface` for consistency

### Styling
- Tailwind CSS 4 with CSS-first configuration
- Use `cn()` utility for conditional classes (clsx + tailwind-merge)
- Theme variables defined in `globals.css`
- Support both light and dark modes

### Testing
- Colocate tests next to source files (`Component.test.tsx`)
- Use `@testing-library/react` for component tests
- Use MSW for API mocking
- E2E tests in `frontend/e2e/` folder

## Backend (Rust)

### Project Structure
- `src/routes/` - API route handlers
- `src/models/` - Data models
- `src/services/` - Business logic
- `src/auth/` - Authentication
- `src/db/` - Database layer

### Naming
- Modules: snake_case
- Types/Structs: PascalCase
- Functions: snake_case

## Marketing/App Split
- `(marketing)` route group - Public SEO-optimized pages
- `(app)` route group - Authenticated application
- `(auth)` route group - Authentication pages
