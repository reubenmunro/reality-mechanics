#!/bin/zsh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
WRANGLER="/Users/reuben/Reality_Atlas_Build/.wrangler-cli/node_modules/.bin/wrangler"

echo "Checking API Gardener Worker..."
node --check "$ROOT/api-gardener/src/index.js"

echo
echo "Deploying API Gardener to Cloudflare Workers..."
"$WRANGLER" deploy --config "$ROOT/api-gardener/wrangler.toml"

echo
echo "Done."
