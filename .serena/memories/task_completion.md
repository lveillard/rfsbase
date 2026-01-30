# RFSbase - Task Completion Checklist

When completing a task, run the following checks:

## Before Committing

### 1. Type Checking
```bash
pnpm typecheck
```

### 2. Linting (Biome)
```bash
pnpm lint
# Fix issues:
cd frontend && pnpm lint:fix
```

### 3. Tests
```bash
# Unit tests
pnpm test

# If UI changes were made, consider E2E tests
pnpm test:e2e
```

### 4. Build Check (if significant changes)
```bash
pnpm build
```

## Code Review Checklist
- [ ] No TypeScript errors
- [ ] No linting errors (Biome)
- [ ] Tests pass
- [ ] New code has appropriate tests
- [ ] Code follows colocation pattern
- [ ] No hardcoded values (use config files)
- [ ] Supports both light and dark themes
- [ ] Responsive design considered
