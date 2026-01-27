#!/bin/sh
# Entrypoint script that resolves DNS before starting the API
# This works around tokio DNS resolver issues in Docker containers
# Runs as root to modify /etc/hosts, then drops to rfsbase user

set -e

# Wait for surrealdb to be resolvable
MAX_ATTEMPTS=30
ATTEMPT=0
SURREALDB_IP=""

echo "Waiting for surrealdb DNS resolution..."

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    # Try to resolve surrealdb using getent
    if SURREALDB_IP=$(getent hosts surrealdb 2>/dev/null | awk '{print $1}'); then
        if [ -n "$SURREALDB_IP" ]; then
            echo "Resolved surrealdb to $SURREALDB_IP"
            break
        fi
    fi

    ATTEMPT=$((ATTEMPT + 1))
    echo "Attempt $ATTEMPT/$MAX_ATTEMPTS - waiting for DNS..."
    sleep 1
done

if [ -z "$SURREALDB_IP" ]; then
    echo "Error: Could not resolve surrealdb hostname"
    exit 1
fi

# Add to /etc/hosts
echo "$SURREALDB_IP surrealdb" >> /etc/hosts
echo "Added surrealdb to /etc/hosts"

# Replace hostname with IP in SURREAL_URL to bypass Rust DNS issues
if [ -n "$SURREAL_URL" ]; then
    NEW_URL=$(echo "$SURREAL_URL" | sed "s/surrealdb/$SURREALDB_IP/g")
    echo "Rewriting SURREAL_URL: $SURREAL_URL -> $NEW_URL"
    export SURREAL_URL="$NEW_URL"
fi

# Also export as environment variable for the rfsbase user
export SURREAL_URL

# Drop privileges and start the API
echo "Starting rfsbase-api as user rfsbase..."
exec gosu rfsbase rfsbase-api
