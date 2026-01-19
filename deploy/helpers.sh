#!/bin/bash

confirm_or_exit() {
  echo ""
  echo "⚠️  LIVE DEPLOY CONFIRMATION"
  echo "Local URL: $LOCAL_URL"
  echo "Live URL:  $LIVE_URL"
  echo ""
  read -p "Type YES to continue: " CONFIRM
  [[ "$CONFIRM" == "YES" ]] || { echo "❌ Cancelled"; exit 1; }
}

log() {
  echo ""
  echo "▶ $1"
}

notify_discord() {
  local MESSAGE="$1"
  local COLOR="${2:-3066993}" # green default

  [ -z "$DISCORD_WEBHOOK_URL" ] && return 0

  curl -s -H "Content-Type: application/json" \
    -d "{
      \"username\": \"DXNDRE Deploy\",
      \"embeds\": [{
        \"description\": \"$MESSAGE\",
        \"color\": $COLOR
      }]
    }" \
    "$DISCORD_WEBHOOK_URL" >/dev/null
}