# PR #11 — Dockerfile и Docker Compose для NestJS API

**Дата мержа:** 2026-07-08

## Обзор

Добавлена контейнеризация приложения: multi-stage Dockerfile для production-сборки и расширенный `docker-compose.yml` с сервисом API. При старте контейнера автоматически применяются миграции Prisma.

## Что изменено

### Dockerfile

- Двухэтапная сборка на `node:22-alpine` с pnpm 10.33.3.
- **builder**: установка зависимостей, `prisma generate`, `pnpm build`.
- **runner**: production-зависимости, пакет `prisma` для миграций, копирование `dist/`, `prisma/`, `src/generated/`.
- Entrypoint: `prisma migrate deploy` → `node dist/src/main`.

### Docker Compose

- Добавлен сервис `app` с build из `Dockerfile`, портом `3000` и `DATABASE_URL` на хост `postgres`.
- Для `postgres` добавлен healthcheck (`pg_isready`).
- `app` стартует после готовности БД (`depends_on: service_healthy`).

### Прочее

- Добавлен `.dockerignore` — исключены `node_modules`, `dist`, `.env` и кэши из build context.
- В `package.json` добавлен скрипт `prisma:deploy` для production-миграций.
- Исправлен `start:prod` на `node dist/src/main` (фактический путь сборки NestJS).

### Запуск

```bash
docker compose build
docker compose up -d
```

API: `http://localhost:3000`, Swagger: `http://localhost:3000/docs`
