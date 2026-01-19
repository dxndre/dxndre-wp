#!/bin/bash

echo ""
echo "⚠️  YOU ARE ABOUT TO DEPLOY TO LIVE"
echo ""
echo "Local URL:  $LOCAL_URL"
echo "Live URL:   $LIVE_URL"
echo "Themes:     ADD / UPDATE only"
echo "Plugins:    ADD / UPDATE only"
echo "Database:   Export + manual import"
echo ""
read -p "Type YES to continue: " CONFIRM

if [ "$CONFIRM" != "YES" ]; then
  echo "❌ Deploy cancelled."
  exit 1
fi