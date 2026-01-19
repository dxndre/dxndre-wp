#!/bin/bash
set -e
set -o pipefail

# --------------------------------------------------
# Bootstrap
# --------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"
source "$SCRIPT_DIR/helpers.sh"

# --------------------------------------------------
# Discord notifications (fail-safe)
# --------------------------------------------------
ENVIRONMENT="LIVE"
DRY_LABEL=""

if [[ "${DRY_RUN:-false}" == "true" ]]; then
  DRY_LABEL=" (DRY RUN)"
fi

notify_discord "🚀 Deploy started$DRY_LABEL\nEnvironment: $ENVIRONMENT\nTheme: $THEME_NAME" 15105570
trap 'notify_discord "❌ Deploy failed$DRY_LABEL\nTheme: $THEME_NAME\nCheck terminal output." 15158332' ERR

# --------------------------------------------------
# Required configuration (fail fast)
# --------------------------------------------------
: "${FTP_HOST:?FTP_HOST not set}"
: "${FTP_PATH:?FTP_PATH not set}"
: "${LOCAL_WP_PATH:?LOCAL_WP_PATH not set}"
: "${THEME_NAME:?THEME_NAME not set}"

# --------------------------------------------------
# Deploy configuration
# --------------------------------------------------
CUSTOM_PLUGINS=(
  dx-client-portal
  pricing-calculator
)

# --------------------------------------------------
# LFTP defaults (Namecheap-safe)
# --------------------------------------------------
LFTP_SETTINGS=$(cat <<'EOF'
set ftp:passive-mode on
set ftp:ssl-allow no

set net:timeout 30
set net:max-retries 5
set net:reconnect-interval-base 5
set net:reconnect-interval-multiplier 1

set dns:order "inet"
set xfer:clobber on
EOF
)

# --------------------------------------------------
# Deploy Theme
# --------------------------------------------------
THEME_PATH="$LOCAL_WP_PATH/wp-content/themes/$THEME_NAME"

if [ ! -d "$THEME_PATH" ]; then
  log "❌ Theme not found locally: $THEME_NAME"
  exit 1
fi

log "📂 Uploading theme files (Namecheap-safe mode)"

lftp "ftp://$FTP_HOST" <<EOF
$LFTP_SETTINGS

mkdir -p "$FTP_PATH/wp-content/themes/$THEME_NAME"
cd "$FTP_PATH/wp-content/themes/$THEME_NAME"
lcd "$THEME_PATH"

put -R *

bye
EOF

# --------------------------------------------------
# Deploy Custom Plugins
# --------------------------------------------------
log "🔌 Uploading custom plugins"

for PLUGIN in "${CUSTOM_PLUGINS[@]}"; do
  PLUGIN_PATH="$LOCAL_WP_PATH/wp-content/plugins/$PLUGIN"

  if [ ! -d "$PLUGIN_PATH" ]; then
    log "❌ Plugin not found locally: $PLUGIN"
    exit 1
  fi

  log "→ Uploading plugin: $PLUGIN"

  lftp "ftp://$FTP_HOST" <<EOF
$LFTP_SETTINGS

mkdir -p "$FTP_PATH/wp-content/plugins/$PLUGIN"
cd "$FTP_PATH/wp-content/plugins/$PLUGIN"
lcd "$PLUGIN_PATH"

put -R *

bye
EOF
done

# --------------------------------------------------
# Success notification
# --------------------------------------------------
notify_discord "✅ Deploy completed successfully$DRY_LABEL\nTheme: $THEME_NAME" 3066993
log "✅ Deploy complete"