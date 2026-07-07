# PR — Pug-страницы брендов и продуктов

**Дата:** 2026-07-07

## Обзор

Добавлены простые HTML-страницы на Pug: таблица брендов и список продуктов выбранного бренда.

## Что изменено

### Views (`src/views/`)

- `GET /view/brands` — таблица брендов со ссылкой на продукты.
- `GET /view/brands/:id/products` — продукты бренда с ингредиентами.
- Шаблоны `layout.pug`, `brands.pug`, `brand-products.pug`.
- `ViewsModule` с контроллером, исключённым из Swagger.

### Продукты

- `ProductsService.findByBrandId()` — выборка продуктов по `brandId`.
- `ProductsService` экспортируется из `ProductsModule`.

### Прочее

- Зависимость `pug`, настройка view engine в `main.ts`.
- Копирование `.pug`-файлов в `dist` через `nest-cli.json`.
