#!/usr/bin/env bash
# Nightly backup of the database and uploaded files. Install with (as root):
#   echo '30 2 * * * idrp /opt/idrp/repo/deploy/backup.sh' > /etc/cron.d/idrp-backup
# Keeps 14 days locally. ALSO copy /var/backups/idrp off the VPS (Hostinger snapshots,
# rclone to Google Drive, etc.) - a backup on the same disk does not survive losing it.
set -euo pipefail
DEST=/var/backups/idrp
STAMP=$(date +%F)
mkdir -p "$DEST"
set -a; . /etc/idrp/backend.env; set +a
DB_NAME="${DATABASE_URL##*/}"
PGPASSWORD="$DATABASE_PASSWORD" pg_dump -h 127.0.0.1 -U "$DATABASE_USERNAME" -d "$DB_NAME" -Fc -f "$DEST/db-$STAMP.dump"
tar -czf "$DEST/uploads-$STAMP.tar.gz" -C /var/idrp uploads
find "$DEST" -type f -mtime +14 -delete
echo "Backup written: $DEST/db-$STAMP.dump, $DEST/uploads-$STAMP.tar.gz"
