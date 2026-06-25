#!/bin/zsh
set -e

cd "$(dirname "$0")"

echo "Exporting the Reality Mechanics Atlas as one AI-readable document..."
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
  echo "Open this folder in Codex and ask it to export the Atlas AI document."
  read -k 1 "?Press any key to close this window."
  exit 1
fi

echo "Making sure the Atlas notes are downloaded from iCloud..."
if command -v brctl >/dev/null 2>&1; then
  brctl download "$PWD/Reality_Mechanics" >/dev/null 2>&1 || true
fi
echo

"$NODE_BIN" .atlas-publisher/export-ai-context.mjs

BUILD_ROOT="${ATLAS_BUILD_ROOT:-$PWD/Reality_Atlas_Build}"

echo
echo "Done."
echo "AI document: $BUILD_ROOT/Reality_Atlas_AI_Context.md"
echo
if [ -t 0 ]; then
  read -k 1 "?Press any key to close this window."
fi
