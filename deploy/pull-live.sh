#!/bin/bash
set -e
source "$(dirname "$0")/config.sh"

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M")

echo "⬇️ Downloading live DB..."
sftp "$SFTP_USER@$SFTP_HOST" <<EOF
cd $SFTP_PATH
get deploy-latest.sql /tmp/live.sql
bye
EOF

cd "$LOCAL_WP_PATH"
wp db import /tmp/live.sql
wp search-replace "$LIVE_URL" "$LOCAL_URL" --all-tables --skip-columns=guid

echo "⬇️ Pulling themes + plugins..."
rsync -av \
  "$SFTP_USER@$SFTP_HOST:$SFTP_PATH/wp-content/themes/" \
  "$LOCAL_WP_PATH/wp-content/themes/"

rsync -av \
  "$SFTP_USER@$SFTP_HOST:$SFTP_PATH/wp-content/plugins/" \
  "$LOCAL_WP_PATH/wp-content/plugins/"

wp cache flush
wp rewrite flush --hard

echo "✅ Live → Local sync complete"