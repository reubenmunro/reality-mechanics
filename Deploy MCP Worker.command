#!/bin/zsh
set -e
cd "$(dirname "$0")"

echo "Translating the canonical Atlas..."
npm --prefix .atlas-publisher run translate

cd reality-mechanics-mcp

echo "Deploying the Reality Mechanics MCP Worker to Cloudflare..."
echo

if command -v node >/dev/null 2>&1; then NODE_OK=1
elif [ -x "/opt/homebrew/bin/node" ]; then export PATH="/opt/homebrew/bin:$PATH"; NODE_OK=1
elif [ -x "/usr/local/bin/node" ]; then export PATH="/usr/local/bin:$PATH"; NODE_OK=1
else
  echo "Could not find Node.js. Install it (brew install node), then run this again."
  read -k 1 "?Press any key to close this window."
  exit 1
fi

npx --yes wrangler@latest deploy

echo
echo "Done."
echo "MCP deployed at https://mcp.realitymechanics.nz/mcp."
echo

if [ -t 0 ]; then read -k 1 "?Press any key to close this window."; fi
