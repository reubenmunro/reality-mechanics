#!/bin/zsh
set -e

cd "$(dirname "$0")"

echo "Checking the Reality Mechanics main website Worker..."
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

"$NODE_BIN" --check .atlas-publisher/main-website-worker.js
WORKER_PATH="$PWD/.atlas-publisher/main-website-worker.js"
WRANGLER_WORKDIR="$HOME/Reality_Atlas_Build/.wrangler-main-workdir"
WRANGLER_CLI_DIR="$HOME/Reality_Atlas_Build/.wrangler-cli"
NPM_CACHE_DIR="$HOME/Reality_Atlas_Build/.npm-cache"
mkdir -p "$WRANGLER_WORKDIR"
mkdir -p "$WRANGLER_CLI_DIR"
mkdir -p "$NPM_CACHE_DIR"

echo
echo "Deploying main website to Cloudflare Workers..."
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
  echo "Then run this command again."
  echo
  if [ -t 0 ]; then
    read -k 1 "?Press any key to close this window."
  fi
  exit 1
fi

(cd "$WRANGLER_WORKDIR" && NPM_CONFIG_CACHE="$NPM_CACHE_DIR" "$WRANGLER_BIN" deploy "$WORKER_PATH" --name=super-frost-d434 --compatibility-date=2026-06-03)

echo
echo "Done."
echo "Main website deployed to Cloudflare Workers."
echo

if [ -t 0 ]; then
  read -k 1 "?Press any key to close this window."
fi
