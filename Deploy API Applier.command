#!/bin/zsh
set -e
cd "$(dirname "$0")/api-applier"

echo "Deploying the Reality Mechanics Garden Cycle to Cloudflare..."
echo

if command -v node >/dev/null 2>&1; then
  NODE_BIN="$(command -v node)"
elif [ -x "/Applications/Codex.app/Contents/Resources/node" ]; then
  NODE_BIN="/Applications/Codex.app/Contents/Resources/node"
elif [ -x "/opt/homebrew/bin/node" ]; then
  export PATH="/opt/homebrew/bin:$PATH"
  NODE_BIN="/opt/homebrew/bin/node"
elif [ -x "/usr/local/bin/node" ]; then
  export PATH="/usr/local/bin:$PATH"
  NODE_BIN="/usr/local/bin/node"
else
  echo "Could not find Node.js. Install it, then run this again."
  if [ -t 0 ]; then read -k 1 "?Press any key to close this window."; fi
  exit 1
fi

"$NODE_BIN" --check src/index.js
npx --yes wrangler@latest deploy

echo
echo "Done."
echo "Before first use, set GARDEN_SECRET with wrangler secret put."
echo

if [ -t 0 ]; then read -k 1 "?Press any key to close this window."; fi
