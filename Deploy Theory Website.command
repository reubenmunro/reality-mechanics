#!/bin/zsh
set -e

cd "$(dirname "$0")"

echo "Building the Reality Mechanics Postulate website..."
echo

if command -v node >/dev/null 2>&1; then
  NODE_BIN="$(command -v node)"
elif [ -x "/Applications/Codex.app/Contents/Resources/node" ]; then
  NODE_BIN="/Applications/Codex.app/Contents/Resources/node"
elif [ -x "/opt/homebrew/bin/node" ]; then
  NODE_BIN="/opt/homebrew/bin/node"
elif [ -x "/usr/local/bin/node" ]; then
  NODE_BIN="/usr/local/bin/node"
else
  echo "Could not find Node.js."
  echo "Install Node.js first, then run this again."
  echo
  if [ -t 0 ]; then
    read -k 1 "?Press any key to close this window."
  fi
  exit 1
fi

echo "Making sure the Postulate notes are downloaded from iCloud..."
if command -v brctl >/dev/null 2>&1; then
  brctl download "$PWD/Reality_Mechanics" >/dev/null 2>&1 || true
fi
echo

BUILD_ROOT="${THEORY_BUILD_ROOT:-$HOME/Reality_Atlas_Build}"
ATLAS_BUILD_ROOT="$HOME/Reality_Atlas_Build" THEORY_BUILD_ROOT="$BUILD_ROOT" ATLAS_SKIP_ZIP=1 "$NODE_BIN" .atlas-publisher/build.mjs

WRANGLER_WORKDIR="$BUILD_ROOT/.wrangler-theory-workdir"
WRANGLER_CLI_DIR="$BUILD_ROOT/.wrangler-cli"
NPM_CACHE_DIR="$BUILD_ROOT/.npm-cache"
mkdir -p "$WRANGLER_WORKDIR" "$WRANGLER_CLI_DIR" "$NPM_CACHE_DIR"

echo
echo "Deploying Postulate to Cloudflare Pages..."
echo

if [ -x "$WRANGLER_CLI_DIR/node_modules/.bin/wrangler" ]; then
  WRANGLER_BIN="$WRANGLER_CLI_DIR/node_modules/.bin/wrangler"
elif command -v npm >/dev/null 2>&1; then
  echo "Preparing Cloudflare Wrangler..."
  echo
  (
    cd "$WRANGLER_CLI_DIR"
    NPM_CONFIG_CACHE="$NPM_CACHE_DIR" npm install --no-audit --fund=false wrangler@latest
  )
  WRANGLER_BIN="$WRANGLER_CLI_DIR/node_modules/.bin/wrangler"
elif command -v wrangler >/dev/null 2>&1; then
  WRANGLER_BIN="$(command -v wrangler)"
else
  echo "Could not find npm or Wrangler, which is needed for Cloudflare deploy."
  echo
  echo "Install Node.js with npm first. In Terminal, run:"
  echo "  brew install node"
  echo
  if [ -t 0 ]; then
    read -k 1 "?Press any key to close this window."
  fi
  exit 1
fi

echo "Starting Cloudflare upload from: $BUILD_ROOT/.theory-public"
echo

(cd "$WRANGLER_WORKDIR" && NPM_CONFIG_CACHE="$NPM_CACHE_DIR" "$WRANGLER_BIN" pages deploy "$BUILD_ROOT/.theory-public" --project-name=reality-mechanics-theory --branch=main)

echo
echo "Done."
echo "Postulate deployed to https://theory.realitymechanics.nz"
echo

if [ -t 0 ]; then
  read -k 1 "?Press any key to close this window."
fi
