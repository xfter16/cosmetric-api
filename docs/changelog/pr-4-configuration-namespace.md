# PR #4 — Namespace Configuration с env и дефолтными значениями

**Дата мержа:** 2026-07-07

## Обзор

Введён централизованный модуль конфигурации приложения через `@nestjs/config`. Настройки читаются из переменных окружения с дефолтными значениями.

## Что изменено

### Модуль Configuration

- Добавлен namespace `configuration` (`src/configuration/`):
  - `configuration.ts` — фабрика конфига с полями `port`, `nodeEnv`, `databaseUrl`.
  - `configuration.module.ts` — глобальный модуль конфигурации.
  - `index.ts` — публичный API модуля.
- Тип `Configuration` выводится из фабрики через `ReturnType`.

### Интеграция в приложение

- `AppModule` подключает `ConfigurationModule`.
- `main.ts` использует `port` из конфигурации вместо хардкода.
- Swagger-настройки вынесены из конфигурации (остаются в `main.ts`).

### Окружение

- Добавлен `.env.example` с примерами переменных (`PORT`, `NODE_ENV`, `DATABASE_URL`).
- Подключена зависимость `@nestjs/config`.
