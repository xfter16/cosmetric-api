# PR #5 — Prisma 7 с PostgreSQL и доменные модели

**Дата мержа:** 2026-07-07

## Обзор

Интегрирован Prisma 7 с PostgreSQL. Добавлены доменные модели для брендов, продуктов и ингредиентов с поддержкой связей many-to-many. Настроена локальная инфраструктура БД через Docker Compose.

## Что изменено

### Prisma и база данных

- Добавлены `prisma/schema.prisma`, `prisma.config.ts` и миграции.
- Prisma Client генерируется в `src/generated/prisma`.
- Подключён `@prisma/adapter-pg` и драйвер `pg`.
- В `configuration` добавлено поле `databaseUrl`.
- В `.env.example` добавлена переменная `DATABASE_URL`.

### Доменные модели

- **Brand** — бренд с названием и описанием, связь one-to-many с продуктами.
- **Product** — продукт, привязанный к бренду.
- **Ingredient** — ингредиент.
- **ProductIngredient** — связующая таблица many-to-many между продуктами и ингредиентами.

### NestJS-интеграция

- Добавлен `PrismaModule` и `PrismaService` (`src/prisma/`).
- `PrismaModule` подключён в `AppModule`.

### Инфраструктура

- Добавлен `docker-compose.yml` для локального PostgreSQL.
- В `.gitignore` добавлены сгенерированные Prisma-артефакты.
- В `package.json` добавлены скрипты `prisma:generate`, `prisma:migrate`, `prisma:studio` и `postinstall` для генерации клиента.
