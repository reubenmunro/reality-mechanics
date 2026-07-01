#!/bin/zsh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
WRANGLER="/Users/reuben/Reality_Atlas_Build/.wrangler-cli/node_modules/.bin/wrangler"
export WRANGLER_LOG_PATH="$ROOT/.wrangler-logs"
mkdir -p "$WRANGLER_LOG_PATH"

echo "Checking Garden Steward Worker..."
node --check "$ROOT/api-steward/src/index.js"

echo
echo "Deploying Garden Steward to Cloudflare Workers..."
"$WRANGLER" deploy --config "$ROOT/api-steward/wrangler.toml"

echo
echo "Done."
