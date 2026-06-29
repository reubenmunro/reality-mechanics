#!/bin/zsh
set -e

cd "$(dirname "$0")"

if command -v node >/dev/null 2>&1; then
  NODE_BIN="$(command -v node)"
elif [ -x "/Applications/Codex.app/Contents/Resources/node" ]; then
  NODE_BIN="/Applications/Codex.app/Contents/Resources/node"
else
  echo "Could not find Node.js."
  exit 1
fi

echo "Checking live Atlas roots..."
echo
"$NODE_BIN" scripts/root-live-atlas.mjs "$@"

echo
echo "Done."

if [ -t 0 ]; then
  read -k 1 "?Press any key to close this window."
fi
