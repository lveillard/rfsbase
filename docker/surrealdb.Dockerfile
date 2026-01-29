# Multi-stage build: extract binary from official image, run in Debian
FROM surrealdb/surrealdb:v2.5 AS source

FROM debian:bookworm-slim

# Install gosu for proper user switching
RUN apt-get update && apt-get install -y --no-install-recommends \
    gosu \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy the SurrealDB binary from official image
COPY --from=source /surreal /surreal

# Create data directory
RUN mkdir -p /data

# Copy entrypoint script
COPY docker/surrealdb-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["start", "--log", "warn", "--bind", "0.0.0.0:8000", "surrealkv:/data/database"]
