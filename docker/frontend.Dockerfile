# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Build-time arguments for NEXT_PUBLIC_* variables (baked at build time)
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ARG NEXT_PUBLIC_API_URL=http://localhost:3001

# Set as environment variables for build
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Install pnpm (matching packageManager version in package.json)
RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY frontend/package.json ./frontend/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY config ./config
COPY packages/shared ./packages/shared
COPY frontend ./frontend

# Build shared package
WORKDIR /app/packages/shared
RUN pnpm build

# Build frontend
WORKDIR /app/frontend
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built files - monorepo structure puts server.js in subfolder
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/.next/standalone ./
COPY --from=builder /app/frontend/.next/static ./frontend/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# In monorepo, server.js is in frontend subdirectory
CMD ["node", "frontend/server.js"]
