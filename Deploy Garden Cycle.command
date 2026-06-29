#!/bin/zsh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
WRANGLER="/Users/reuben/Reality_Atlas_Build/.wrangler-cli/node_modules/.bin/wrangler"

echo "Checking Garden Cycle Worker..."
node --check "$ROOT/api-applier/src/index.js"

echo
echo "Deploying Garden Cycle to Cloudflare Workers..."
"$WRANGLER" deploy --config "$ROOT/api-applier/wrangler.toml"

echo
echo "Done."
