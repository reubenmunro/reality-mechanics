#!/bin/zsh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
WRANGLER="/Users/reuben/Reality_Atlas_Build/.wrangler-cli/node_modules/.bin/wrangler"

echo "Checking Garden Ground Check Worker..."
node --check "$ROOT/api-ground-check/src/index.js"

echo
echo "Deploying Garden Ground Check to Cloudflare Workers..."
"$WRANGLER" deploy --config "$ROOT/api-ground-check/wrangler.toml"

echo
echo "Done."
