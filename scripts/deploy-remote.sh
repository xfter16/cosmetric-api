#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

git fetch origin develop
git checkout develop
git reset --hard origin/develop

docker compose build --pull
docker compose up -d --remove-orphans
docker image prune -f
