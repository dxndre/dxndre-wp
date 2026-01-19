#!/bin/bash
set -e
source "$(dirname "$0")/config.sh"

echo "Available backups:"
ls -lh "$BACKUP_DIR"

read -p "Enter filename to restore: " FILE

cd "$LOCAL_WP_PATH"
wp db import "$BACKUP_DIR/$FILE"
wp search-replace "$LIVE_URL" "$LOCAL_URL" --all-tables --skip-columns=guid
wp cache flush
wp rewrite flush --hard

echo "✅ Local rollback complete"