#!/bin/zsh
set -e

BUILD_ROOT="${ATLAS_BUILD_ROOT:-$HOME/Reality_Atlas_Build}"
ZIP_PATH="$BUILD_ROOT/Reality_Atlas_Public.zip"
SITE_FOLDER="$BUILD_ROOT/.atlas-public"

if [ ! -f "$ZIP_PATH" ]; then
  echo "The Atlas upload package does not exist yet."
  echo
  echo "Run Build Atlas Website.command first, then run this again."
  echo
  if [ -t 0 ]; then
    read -k 1 "?Press any key to close this window."
  fi
  exit 1
fi

echo "Opening the Atlas upload package..."
echo
echo "Upload package: $ZIP_PATH"
echo "Website folder: $SITE_FOLDER"
echo
echo "Use Cloudflare Pages manual upload if terminal deploy stalls."
echo

open -R "$ZIP_PATH"

if [ -t 0 ]; then
  read -k 1 "?Press any key to close this window."
fi
