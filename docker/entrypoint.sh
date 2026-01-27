#!/bin/sh
# Entrypoint script that resolves DNS before starting the API
# This works around tokio DNS resolver issues in Docker containers
# Runs as root to modify /etc/hosts, then drops to rfsbase user

set -e

# Wait for surrealdb to be resolvable and add to /etc/hosts
MAX_ATTEMPTS=30
ATTEMPT=0

echo "Waiting for surrealdb DNS resolution..."

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    # Try to resolve surrealdb using getent
    if IP=$(getent hosts surrealdb 2>/dev/null | awk '{print $1}'); then
        if [ -n "$IP" ]; then
            echo "Resolved surrealdb to $IP"
            # Add to /etc/hosts if not already there
            if ! grep -q "surrealdb" /etc/hosts 2>/dev/null; then
                echo "$IP surrealdb" >> /etc/hosts
                echo "Added surrealdb to /etc/hosts"
            fi
            break
        fi
    fi

    ATTEMPT=$((ATTEMPT + 1))
    echo "Attempt $ATTEMPT/$MAX_ATTEMPTS - waiting for DNS..."
    sleep 1
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo "Warning: Could not resolve surrealdb, proceeding anyway"
fi

# Drop privileges and start the API
echo "Starting rfsbase-api as user rfsbase..."
exec gosu rfsbase rfsbase-api
