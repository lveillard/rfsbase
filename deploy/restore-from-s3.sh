#!/bin/bash
# Restore SurrealDB from S3 backup
# Usage: ./restore-from-s3.sh [timestamp]
set -e

RESTORE_DIR="/tmp/rfsbase-restore"
BACKUP_BUCKET=${BACKUP_BUCKET:-$(cat /home/ubuntu/.rfsbase-backup-bucket 2>/dev/null)}

[ -z "$BACKUP_BUCKET" ] && echo "BACKUP_BUCKET not set" && exit 1

if [ -z "$1" ]; then
    echo "Available backups:"
    aws s3 ls "s3://${BACKUP_BUCKET}/daily/" | awk '{print $2}' | tr -d '/'
    echo -e "\nUsage: $0 <timestamp>"
    exit 0
fi

TIMESTAMP="$1"
read -p "This will OVERWRITE the database. Continue? (yes/no): " CONFIRM
[ "$CONFIRM" != "yes" ] && echo "Aborted" && exit 1

mkdir -p "${RESTORE_DIR}"
cd "${RESTORE_DIR}"

echo "Downloading backup ${TIMESTAMP}..."
aws s3 cp "s3://${BACKUP_BUCKET}/daily/${TIMESTAMP}/" . --recursive
sha256sum -c *.sha256

cd /home/ubuntu/rfsbase
docker compose -f docker-compose.ec2.yml stop backend frontend

if ls "${RESTORE_DIR}"/*.surql 1>/dev/null 2>&1; then
    source .env 2>/dev/null || true
    docker exec rfsbase-db rm -rf /data/database/*
    docker cp "${RESTORE_DIR}"/*.surql rfsbase-db:/data/import.surql
    docker exec rfsbase-db /surreal import \
        --conn http://localhost:8000 \
        --user "${SURREAL_USER:-root}" \
        --pass "${SURREAL_PASS}" \
        --ns "${SURREAL_NS:-rfsbase}" \
        --db "${SURREAL_DB:-main}" \
        /data/import.surql
    docker exec rfsbase-db rm /data/import.surql
elif ls "${RESTORE_DIR}"/*.tar.gz 1>/dev/null 2>&1; then
    docker compose -f docker-compose.ec2.yml stop surrealdb
    VOLUME_PATH=$(docker volume inspect rfsbase_surrealdb_data --format '{{ .Mountpoint }}')
    sudo rm -rf "${VOLUME_PATH}"/*
    sudo tar -xzf "${RESTORE_DIR}"/*.tar.gz -C "${VOLUME_PATH}"
    docker compose -f docker-compose.ec2.yml start surrealdb
    sleep 5
fi

docker compose -f docker-compose.ec2.yml start backend frontend
rm -rf "${RESTORE_DIR}"

sleep 3
curl -sf http://localhost/health && echo " OK" || echo " FAILED"
