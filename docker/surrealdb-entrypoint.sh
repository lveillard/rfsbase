#!/bin/sh
set -e

if [ "$(id -u)" = "0" ]; then
    # Create surrealdb user/group if they don't exist
    if ! getent group surrealdb >/dev/null 2>&1; then
        groupadd -g 1000 surrealdb
    fi
    if ! getent passwd surrealdb >/dev/null 2>&1; then
        useradd -u 1000 -g surrealdb -d /data -s /bin/false surrealdb
    fi

    # Fix ownership of data directory
    chown -R surrealdb:surrealdb /data

    # Run as surrealdb user
    exec gosu surrealdb /surreal "$@"
fi

exec /surreal "$@"
