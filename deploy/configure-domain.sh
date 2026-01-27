#!/bin/bash
set -e

# =============================================================================
# RFSbase Domain Configuration Script
# =============================================================================
# Use this script when you're ready to add your domain (rfsbase.com)
# This will update the configuration to use HTTPS with automatic SSL via Caddy
#
# Usage: ./deploy/configure-domain.sh your-domain.com
# =============================================================================

if [ -z "$1" ]; then
    echo "Usage: $0 <domain>"
    echo "Example: $0 rfsbase.com"
    exit 1
fi

DOMAIN=$1
REPO_DIR=$(dirname "$(dirname "$(readlink -f "$0")")")

echo "=========================================="
echo "Configuring domain: $DOMAIN"
echo "=========================================="

# Update .env file
if [ -f "$REPO_DIR/.env" ]; then
    echo "Updating .env file..."

    # Backup existing .env
    cp "$REPO_DIR/.env" "$REPO_DIR/.env.backup.$(date +%Y%m%d_%H%M%S)"

    # Update URLs to use HTTPS
    sed -i "s|APP_URL=http://.*|APP_URL=https://${DOMAIN}|" "$REPO_DIR/.env"
    sed -i "s|API_URL=http://.*|API_URL=https://api.${DOMAIN}|" "$REPO_DIR/.env"
    sed -i "s|NEXT_PUBLIC_APP_URL=http://.*|NEXT_PUBLIC_APP_URL=https://${DOMAIN}|" "$REPO_DIR/.env"
    sed -i "s|NEXT_PUBLIC_API_URL=http://.*|NEXT_PUBLIC_API_URL=https://api.${DOMAIN}|" "$REPO_DIR/.env"

    # Add domain config
    echo "" >> "$REPO_DIR/.env"
    echo "# Domain Configuration" >> "$REPO_DIR/.env"
    echo "DOMAIN=${DOMAIN}" >> "$REPO_DIR/.env"
    echo "CORS_ORIGIN=https://${DOMAIN}" >> "$REPO_DIR/.env"
    echo "ADMIN_EMAIL=admin@${DOMAIN}" >> "$REPO_DIR/.env"
else
    echo "Error: .env file not found at $REPO_DIR/.env"
    exit 1
fi

echo ""
echo "Rebuilding frontend with new URLs (NEXT_PUBLIC_* baked at build time)..."
cd "$REPO_DIR"

# Load new env vars
export $(grep -v '^#' .env | xargs)

# Rebuild frontend
docker compose -f docker-compose.prod.yml build frontend

echo ""
echo "Stopping current services..."
docker compose -f docker-compose.ec2.yml down 2>/dev/null || true

echo ""
echo "Starting production services with SSL..."
docker compose -f docker-compose.prod.yml up -d

echo ""
echo "=========================================="
echo "DOMAIN CONFIGURATION COMPLETE!"
echo "=========================================="
echo ""
echo "IMPORTANT: Make sure your DNS is configured:"
echo ""
echo "  ${DOMAIN}     ->  A record  ->  <your-ec2-ip>"
echo "  api.${DOMAIN} ->  A record  ->  <your-ec2-ip>"
echo ""
echo "Caddy will automatically provision SSL certificates from Let's Encrypt"
echo "once DNS is properly configured."
echo ""
echo "Frontend:  https://${DOMAIN}"
echo "API:       https://api.${DOMAIN}"
echo ""
echo "To check Caddy logs for SSL status:"
echo "  docker compose -f docker-compose.prod.yml logs caddy"
echo ""
