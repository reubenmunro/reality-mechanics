#!/bin/bash
set -e

BASE="$HOME/Reality_Mechanics_Workspace"

echo "==> Deploying gardener..."
cd "$BASE/api-gardener" && npm run deploy

echo "==> Deploying steward..."
cd "$BASE/api-steward" && npm run deploy

echo "==> Deploying ground-check..."
cd "$BASE/api-ground-check" && npm run deploy

echo "==> Deploying applier..."
cd "$BASE/api-applier" && npm run deploy

echo ""
echo "Done — all four workers deployed."
