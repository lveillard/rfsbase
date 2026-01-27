# Build stage
FROM rust:latest AS builder

WORKDIR /app

# Install dependencies for building
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy manifests
COPY backend/Cargo.toml backend/Cargo.lock ./
COPY backend/src ./src

# Build release binary
RUN cargo build --release

# Production stage
FROM debian:bookworm-slim

WORKDIR /app

# Install runtime dependencies (including NSS for DNS resolution)
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    curl \
    libnss-myhostname \
    gosu \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd --gid 1001 rfsbase \
    && useradd --uid 1001 --gid rfsbase --shell /bin/bash --create-home rfsbase

# Copy binary from builder
COPY --from=builder /app/target/release/rfsbase-api /usr/local/bin/rfsbase-api

# Copy entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Run as root initially, entrypoint drops to rfsbase user
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=5 \
    CMD curl -f http://localhost:3001/api/health || exit 1

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
