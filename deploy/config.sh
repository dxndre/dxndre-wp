#!/bin/bash

# Load local deploy secrets (Discord, etc)
if [ -f "$HOME/.deploy-secrets" ]; then
  source "$HOME/.deploy-secrets"
fi

# ========== LOCAL ==========
LOCAL_WP_PATH="/Users/dxndre/Local Sites/dxndre/app/public"
LOCAL_URL="http://dxndre.local"

# ---------- FTP ----------
FTP_HOST="dxndre.co.uk"
FTP_PATH="/public_html"

# ---------- THEMES ----------
THEME_NAME="dxndre"

# ---------- BACKUPS ----------
BACKUP_DIR="$HOME/wp-deploy-backups"
mkdir -p "$BACKUP_DIR"