#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

git fetch origin develop
git checkout develop
git reset --hard origin/develop

COMPOSE_FILE="docker-compose.prod.yml"

if [[ ! -f .env ]]; then
  echo "Ошибка: файл .env не найден. Создайте его с DATABASE_URL от Neon." >&2
  exit 1
fi

docker compose -f "$COMPOSE_FILE" build --pull
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans
docker image prune -f
