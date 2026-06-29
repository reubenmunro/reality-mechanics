#!/bin/zsh
set -e

cd "$(dirname "$0")"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "This folder is not a Git repository."
  exit 1
fi

echo "Backing up Reality Mechanics to GitHub..."
echo

git add -A -- \
  ':!Reality_Mechanics/.obsidian/workspace.json' \
  ':!Reality_Mechanics/.obsidian/workspace-mobile.json' \
  ':!Reality_Mechanics/.smart-env/' \
  ':!.wrangler/' \
  ':!.atlas-publisher/.wrangler/' \
  ':!**/.DS_Store' \
  ':!**/._*' \
  ':!**/node_modules/'

if git diff --cached --quiet; then
  echo "No backup changes to commit."
else
  stamp="$(date '+%Y-%m-%d %H:%M')"
  git commit -m "Backup Reality Mechanics ${stamp}"
fi

git push origin main

echo
echo "Backup complete."
