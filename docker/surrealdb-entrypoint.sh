#!/bin/sh
set -e

if [ "$(id -u)" = "0" ]; then
    addgroup -g 1000 -S surrealdb 2>/dev/null || true
    adduser -u 1000 -S -G surrealdb -h /data surrealdb 2>/dev/null || true
    chown -R surrealdb:surrealdb /data
    exec su-exec surrealdb /surreal "$@"
fi

exec /surreal "$@"
