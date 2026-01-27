#!/bin/bash
# Daily SurrealDB backup to S3
# Usage: ./backup-to-s3.sh or via cron
set -e

BACKUP_DIR="/tmp/rfsbase-backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="rfsbase-backup-${TIMESTAMP}"
BACKUP_BUCKET=${BACKUP_BUCKET:-$(cat /home/ubuntu/.rfsbase-backup-bucket 2>/dev/null)}

[ -z "$BACKUP_BUCKET" ] && echo "BACKUP_BUCKET not set" && exit 1

echo "[$(date)] Starting backup to s3://${BACKUP_BUCKET}"
mkdir -p "${BACKUP_DIR}"

backup_export() {
    source /home/ubuntu/rfsbase/.env 2>/dev/null || true
    docker exec rfsbase-db /surreal export \
        --conn http://localhost:8000 \
        --user "${SURREAL_USER:-root}" \
        --pass "${SURREAL_PASS}" \
        --ns "${SURREAL_NS:-rfsbase}" \
        --db "${SURREAL_DB:-main}" \
        /data/export.surql
    docker cp rfsbase-db:/data/export.surql "${BACKUP_DIR}/${BACKUP_NAME}.surql"
    docker exec rfsbase-db rm /data/export.surql
}

backup_volume() {
    docker pause rfsbase-db || true
    VOLUME_PATH=$(docker volume inspect rfsbase_surrealdb_data --format '{{ .Mountpoint }}')
    sudo tar -czf "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" -C "${VOLUME_PATH}" .
    docker unpause rfsbase-db || true
}

backup_export 2>/dev/null || { echo "Export failed, using volume backup"; backup_volume; }

cd "${BACKUP_DIR}"
sha256sum "${BACKUP_NAME}"* > "${BACKUP_NAME}.sha256"
aws s3 cp . "s3://${BACKUP_BUCKET}/daily/${TIMESTAMP}/" --recursive --only-show-errors
rm -rf "${BACKUP_DIR}"

echo "[$(date)] Backup complete: s3://${BACKUP_BUCKET}/daily/${TIMESTAMP}/"
