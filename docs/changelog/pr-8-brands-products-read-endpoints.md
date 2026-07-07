# PR #8 — Read-эндпоинты для брендов и продуктов

**Дата мержа:** 2026-07-07

## Обзор

Добавлены read-эндпоинты для брендов и продуктов. Бренд возвращает только собственные поля, продукт — вложенный бренд и полный состав ингредиентов.

## Что изменено

### Бренды (`src/brands/`)

- `GET /brands` — список брендов.
- `GET /brands/:id` — бренд по id.
- Модуль `BrandsModule` с контроллером, сервисом и `BrandResponseDto`.

### Продукты (`src/products/`)

- `GET /products` — список продуктов.
- `GET /products/:id` — продукт по id с брендом и ингредиентами.
- Модуль `ProductsModule` с контроллером, сервисом, `ProductResponseDto` и `IngredientResponseDto`.
- `ProductsService` загружает связи `brand` и `ingredients → ingredient` через Prisma include.

### Прочее

- `BrandsModule` и `ProductsModule` подключены в `AppModule`.
- `NotFoundException` при отсутствии записи, `ParseIntPipe` для валидации id.
- Swagger-декораторы на контроллерах и DTO.
