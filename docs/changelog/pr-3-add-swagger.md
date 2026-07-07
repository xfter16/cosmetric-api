# PR #3 — Swagger/OpenAPI документация и переход на pnpm

**Дата мержа:** 2026-07-07

## Обзор

Добавлена автогенерируемая API-документация через Swagger/OpenAPI. Пакетный менеджер проекта переведён с npm на pnpm.

## Что изменено

### Swagger / OpenAPI

- Подключён `@nestjs/swagger`.
- В `main.ts` настроена инициализация Swagger UI по пути `/docs`.
- Добавлены декораторы Swagger на `AppController`.

### Пакетный менеджер

- Удалён `package-lock.json`, добавлен `pnpm-lock.yaml`.
- Обновлён `README.md`: команды установки и запуска переведены на `pnpm`.
