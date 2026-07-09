## Cosmetric — Technical Vision (MVP)

Кратко: документ фиксирует минимально необходимое техническое видение для MVP по принципу KISS и служит исходной точкой разработки. Базируемся на `idea.md`.

### Технологии
MVP стек (KISS, без оверинжиниринга):

- Backend: NestJS (Fastify) + TypeScript
- API: REST (JSON) + OpenAPI/Swagger (генерация схем и Swagger UI)
- Аутентификация: JWT (access+refresh) в HttpOnly cookie; SameSite=Lax
- Валидация/трансформация: class-validator / class-transformer
- БД: PostgreSQL 15+; Prisma ORM; миграции через Prisma Migrate; seed-скрипты
- Поиск: PostgreSQL Full‑Text (TSVector/TSQuery) + индексы GIN/pg_trgm; без Elasticsearch на MVP
- Кэш: не подключаем на старте; опционально Redis позже
- Фоновые задачи: без брокеров; при необходимости простой cron в приложении
- Web: Next.js (App Router) + SSR/SSG для SEO; TypeScript; Tailwind CSS
- UI: Headless компоненты (Radix/Headless UI) по минимуму
- Хранилище файлов: S3‑совместимое (локально MinIO; прод — Yandex Object Storage / Selectel / VK Cloud S3)
- Изображения: `next/image`, хранение оригинала; оптимизация on‑the‑fly
- Инфраструктура (локально): Docker Compose (web, api, db, minio); nginx необязателен
- Тесты: Jest (unit) + supertest (минимальные e2e для API)
- Качество: ESLint + Prettier, Husky по необходимости
- Документация: Swagger UI на `/api/docs`, README

Примечание по площадке (РФ): кандидаты — VK Cloud, Selectel, Yandex Cloud, Timeweb Cloud. Финализируем в разделе «Деплой».

### Принцип разработки
KISS и ориентир на быстрый MVP. Минимум зависимостей и сервисов, фокус на поиске и фильтрах.

- Итеративность: короткие инкременты, релизы маленькими порциями.
- API‑first: строгие DTO, валидация (class‑validator), Swagger/OpenAPI — источник правды.
- Данные: миграции через Prisma Migrate, детерминированные seed‑скрипты для демо.
- Введение фич: A/B и фича‑флаги из БД, подтягиваются при бутстрапе; в частном случае B‑группа может быть 0. Фоллбек на ENV, если БД недоступна.
- Качество кода: ESLint + Prettier; Husky + lint‑staged (прегейт на коммит/пуш).
- Code review: PR обязателен, минимум 1 approve; защищённые ветки.
- Тестирование: упор на unit для доменной логики (70–80% ключевых модулей), 1–2 e2e smoke для критических флоу.
- Quality gates в CI: линт + unit‑тесты обязательны; без зелёных тестов деплой блокируется.
- Перфоманс‑бюджет: P95 поиска ≤ 500 мс; серверная пагинация.
- Борьба со сложностью: на MVP без брокеров, без Redis/ES; только Postgres индексы/FTS.

CI/CD и ветвление:

- Git‑флоу: feature/* → PR в dev (автодеплой в dev‑контур) → PR в master (автодеплой в прод).
- Защита веток dev/master, автосборка и автопрогон юнитов и линта на PR.
- Swagger UI доступен на dev/прод для синхронизации контрактов.

### Структура проекта
Монорепо (pnpm workspaces). Дерево (минимум):

```text
cosmetric/
├─ apps/
│  ├─ api/
│  │  ├─ src/
│  │  │  ├─ main.ts
│  │  │  ├─ app.module.ts
│  │  │  ├─ modules/
│  │  │  │  ├─ auth/
│  │  │  │  ├─ products/
│  │  │  │  ├─ ingredients/
│  │  │  │  ├─ search/
│  │  │  │  ├─ files/
│  │  │  │  ├─ ab-flags/
│  │  │  │  └─ health/
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  ├─ web/
│  │  ├─ app/
│  │  │  ├─ search/page.tsx
│  │  │  ├─ product/[id]/page.tsx
│  │  │  ├─ ingredient/[id]/page.tsx
│  │  │  ├─ login/page.tsx
│  │  │  └─ health/page.tsx
│  │  ├─ next.config.js
│  │  ├─ package.json
│  │  └─ tsconfig.json
├─ packages/
│  └─ shared/
│     ├─ src/index.ts
│     └─ package.json
├─ db/
│  └─ prisma/
│     ├─ schema.prisma
│     ├─ migrations/
│     └─ seed.ts
├─ infra/
│  ├─ docker-compose.yml
│  ├─ Caddyfile
│  └─ docker/
│     ├─ api.Dockerfile
│     └─ web.Dockerfile
├─ pnpm-workspace.yaml
├─ package.json
├─ tsconfig.base.json
├─ .eslintrc.cjs
├─ .prettierrc
└─ .github/workflows/ci.yml
```

### Архитектура проекта
Монолит на NestJS (Fastify). Простые слои: Controller → Service → Repository (Prisma). Без DDD/сложных паттернов на MVP.

- Модули (API): `auth`, `products`, `ingredients`, `search`, `files`, `ab-flags`, `health`.
- Поток запроса: DTO‑валидация → сервисная логика → Prisma → маппинг ответа.
- Ошибки: единый фильтр ошибок (JSON‑ответ), коды HTTP.
- Пагинация/сортировка: limit/offset с безопасными пределами.

Поиск и фильтры:

- Postgres FTS (TSVector/TSQuery), индексы GIN/pg_trgm.
- Обязательные ингредиенты — пересечение множеств; «исключить» — вычитание; «желательные» — плюс к скору (ORDER BY).

Файлы/изображения:

- S3‑совместимое хранилище (локально MinIO; прод — Yandex/Selectel/VK Cloud S3).
- На MVP загрузка через API‑прокси; позже — pre‑signed URL при необходимости.

A/B и фича‑флаги:

- Конфигурация в БД; загрузка в память при бутстрапе + периодическое обновление по TTL.
- Оценка варианта на сервере (SSR/API); клиент получает только итоговый вариант/флаг.

Аутентификация:

- JWT (access+refresh) в HttpOnly cookie; SameSite=Lax; совместимо с SSR.
- `web` (Next.js) при SSR обращается напрямую к API от имени пользователя (cookie).

Frontend (Next.js):

- App Router, SSR/SSG для SEO. Маршруты: `search`, `product/[id]`, `ingredient/[id]`, `login`, `health`.

Интеграция:

- `web` → `api` по внутренней сети (docker‑compose/dev), в проде через reverse proxy.
- Общие типы/DTO в `packages/shared`.

Наблюдаемость и прочее:

- `/health` (liveness/readiness). Логи pino в JSON с `requestId`.
- Без брокеров/кеша/Elasticsearch и без rate‑limit на MVP (по мере надобности позже).

### Модель данных
Простая Prisma‑схема (PostgreSQL), покрывающая MVP:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  user
  moderator
  admin
}

enum ContentType {
  comment
  review
  essay
}

model Ingredient {
  id             String   @id @default(uuid())
  slug           String   @unique
  name           String
  synonyms       Json?
  roles          Json?
  description    String?
  safetyScore    Int
  comedogenicity Int
  references     Json?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  products ProductIngredient[]
}

model Brand {
  id   String @id @default(uuid())
  name String

  products Product[]
}

model Product {
  id            String   @id @default(uuid())
  brandId       String
  brand         Brand    @relation(fields: [brandId], references: [id])
  name          String
  category      String
  description   String?
  imageUrl      String?
  purchaseLinks Json?
  createdAt     DateTime @default(now())

  ingredients ProductIngredient[]
  contents    Content[]
}

model ProductIngredient {
  productId   String
  ingredientId String
  position    Int
  role        String?
  note        String?

  product    Product    @relation(fields: [productId], references: [id])
  ingredient Ingredient @relation(fields: [ingredientId], references: [id])

  @@id([productId, ingredientId])
  @@unique([productId, position])
  @@index([ingredientId])
}

model User {
  id          String   @id @default(uuid())
  email       String   @unique
  passwordHash String
  role        UserRole @default(user)
  trustLevel  Float    @default(1.0)
  createdAt   DateTime @default(now())

  contents Content[]
}

model Content {
  id           String      @id @default(uuid())
  type         ContentType
  productId    String?
  ingredientId String?
  authorId     String
  rating       Int?
  text         String
  expertOnly   Boolean     @default(false)
  createdAt    DateTime    @default(now())

  product    Product?   @relation(fields: [productId], references: [id])
  ingredient Ingredient? @relation(fields: [ingredientId], references: [id])
  author     User        @relation(fields: [authorId], references: [id])

  @@index([productId])
  @@index([ingredientId])
  @@index([authorId])
}

model ABFlag {
  key        String   @id
  isEnabled  Boolean
  variants   Json?
  ttlSeconds Int?
  updatedAt  DateTime @updatedAt

  assignments ABAssignment[]
}

model ABAssignment {
  id         String  @id @default(uuid())
  userId     String?
  visitorId  String?
  flagKey    String
  variantKey String
  createdAt  DateTime @default(now())

  flag ABFlag @relation(fields: [flagKey], references: [key])

  @@index([userId])
  @@index([flagKey])
}

model SavedFilter {
  id                      String   @id @default(uuid())
  userId                  String
  name                    String
  requiredIngredientIds   Json?
  excludedIngredientIds   Json?
  preferredIngredientIds  Json?
  categories              Json?
  createdAt               DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
}
```

Отложено на будущее (звёздочка): `ProductIngredient.concentrationMin/Max` — при появлении качественных данных о концентрациях.

### Сценарии работы
MVP сценарии (UX → API):

- Поиск по категориям
  - UX: главная — выбор категории или строка поиска с подсказками категорий.
  - API: GET `/search?category=...&q=...&page=..&limit=..`.

- Фильтры по ингредиентам
  - UX: три списка: обязательные, исключить, желательные.
  - API: GET `/search?required[]=...&excluded[]=...&preferred[]=...`.

- Фасеты (бренды/подкатегории/цена)
  - UX: боковая панель с чекбоксами брендов и подкатегорий, а также простыми корзинами цен (например, 0–500, 500–1500, 1500+). Счётчики показывают количество результатов с учётом уже выбранных фильтров.
  - API: тот же `/search` с параметром `includeFacets=brand,subcategory,price`.
  - Ответ (пример): `facets: { brands: [{ value, count }], subcategories: [{ value, count }], price: [{ from, to, count }] }`.

- Результаты и карточка товара
  - UX: список с пагинацией; бейджи соответствия; карточка товара с составом и подсветкой совпавших ингредиентов.
  - API: GET `/products/:id`, GET `/products/:id/ingredients`.

- Страница ингредиента
  - UX: описание, роли, safetyScore, комедогенность, рекомендации, ссылки на источники.
  - API: GET `/ingredients/:id|slug`.

- «Сохранить поиск» / «Мои поиски»
  - UX: сохраняем текущую комбинацию фильтров и категории; список сохранённых поисков в личном кабинете.
  - API: POST `/filters` (создать), GET `/filters` (список), GET `/filters/:id` (получить и выполнить).
  - Примечание: на уровне реализации использует модель SavedFilter.

- Пресеты фильтров
  - UX: быстрые пресеты (например, «для чувствительной кожи», «без отдушек», «веган»).
  - API: GET `/presets` (список), GET `/presets/:key` (получить и применить).
  - Реализация: системные сохранённые поиски (seed в БД) без UI‑редактора на MVP.

- Аутентификация
  - UX: e‑mail/пароль; вход/выход; SSR‑совместимо.
  - API: POST `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`.

Отложено на пост‑MVP (звёздочка):

- Журнал поиска и аналитика: сбор параметров запроса, времени ответа и кол‑ва результатов с привязкой к сессии/пользователю; интеграция с модулем аналитики.

### Деплой
MVP деплой — вариант A (Selectel VPS), максимально простой.

- Площадка: Selectel, одна VM (VPS) с Docker.
- Оркестрация: `docker-compose` поднимает: `api`, `web`, `postgres`, `caddy` (reverse proxy, Let's Encrypt). В dev — добавляем `minio`.
- Хранилище файлов: prod — Selectel Object Storage (S3); dev — MinIO локально. Доступ к изображениям через API‑прокси (без отдельного `cdn.` на MVP).
- Домен/SSL: один домен (например, `example.com`), поддомен `api.example.com`; Caddy автоматически выдаёт сертификаты LE.
- CI/CD: GitHub Actions → build Docker images → push в GHCR → SSH деплой на VM (`docker compose pull && docker compose up -d`).
- Миграции БД: `prisma migrate deploy` в шаге деплоя API.
- Тесты и линт: обязательные в CI перед деплоем (quality gate, деплой блокируется при падении юнитов/линта).
- Бэкапы: nightly `pg_dump` с ретеншеном (например, 7/30 дней); политики жизненного цикла бакета в Selectel для недорогого хранения.
- Мониторинг: `/health` + UptimeRobot; логи в stdout, ротация docker‑логов.

Примечания:

- Конфиги/секреты: `.env` на сервере (runtime) + Secrets в GitHub для CI. `.env.example` хранится в репозитории.
- Масштабирование: при росте нагрузки вынести Postgres на отдельную VM/Managed PostgreSQL; добавить S3 pre‑signed URL и CDN.

Примеры конфигураций:

docker-compose.yml (прод):

```yaml
version: "3.9"
services:
  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: cosmetric
      POSTGRES_PASSWORD: cosmetric
      POSTGRES_DB: cosmetric
    volumes:
      - pgdata:/var/lib/postgresql/data

  api:
    image: ghcr.io/<org>/cosmetric-api:latest
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://cosmetric:cosmetric@postgres:5432/cosmetric?schema=public
      JWT_SECRET: ${JWT_SECRET}
      S3_ENDPOINT: https://s3.selectel.ru
      S3_BUCKET: ${S3_BUCKET}
      S3_ACCESS_KEY: ${S3_ACCESS_KEY}
      S3_SECRET_KEY: ${S3_SECRET_KEY}
    depends_on:
      - postgres

  web:
    image: ghcr.io/<org>/cosmetric-web:latest
    restart: unless-stopped
    environment:
      NODE_ENV: production
      API_BASE_URL: https://api.example.com
    depends_on:
      - api

  caddy:
    image: caddy:2
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./infra/Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - web
      - api

volumes:
  pgdata:
  caddy_data:
  caddy_config:
```

infra/Caddyfile (пример):

```text
example.com {
  encode gzip
  reverse_proxy web:3000
}

api.example.com {
  encode gzip
  reverse_proxy api:3001
}
```

Dockerfile для API (infra/docker/api.Dockerfile, упрощённый):

```dockerfile
FROM node:20-alpine AS deps
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:20-alpine AS build
RUN corepack enable
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build # собирает NestJS в dist/

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --prod --frozen-lockfile
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

Dockerfile для Web (infra/docker/web.Dockerfile, упрощённый):

```dockerfile
FROM node:20-alpine AS deps
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:20-alpine AS build
RUN corepack enable
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build # next build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY package.json pnpm-lock.yaml next.config.js ./
RUN corepack enable && pnpm install --prod --frozen-lockfile
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Подход к конфигурированию
KISS: только ENV/Secrets, строгая валидация, без внешних конфиг‑серверов.

- Библиотека: `@nestjs/config` + `zod` для валидации схем конфигурации.
- Источники: `.env.local` (dev), `.env` (prod) + переменные окружения/секреты CI.
- Глобальный модуль: `ConfigModule.forRoot({ isGlobal: true })`.
- Структура: `apps/api/src/config/{app,db,auth,s3,abFlags,search}.ts` с типобезопасными геттерами.
- Переключение сред: `NODE_ENV=development|production` (этого достаточно на MVP).
- Секреты: `JWT_SECRET`, `DATABASE_URL`, `S3_ACCESS_KEY`, `S3_SECRET_KEY` — только через ENV; `.env.example` в репозитории.
- Frontend: только `NEXT_PUBLIC_*` для публичных переменных (минимум), остальное — на сервере.
- Fail‑fast: при некорректных ENV приложение не стартует (лог ошибок валидации).

### Подход к логгированию
Минимальный, структурный, безопасный.

- Библиотека: `pino` (+ `pino-http`/адаптер Fastify для запросов).
- Уровни: dev — `debug`; prod — `info` (по умолчанию), также `warn`, `error`.
- Корреляция: `requestId` (middleware), логируем метод, путь, статус, длительность, userId (если есть).
- Формат: JSON; в dev — человекочитаемый транспорт (`pino-pretty`).
- Маскирование: `Authorization`, `Cookie`, `Set-Cookie`, `password`, `*Password*`, `token`, `refreshToken`.
- События: старт/остановка, ошибки, миграции, ключевые бизнес‑события (создание сохранённого поиска, загрузка файла).
- Вывод: stdout; ротация docker‑логов.
- Шумоподавление: `/health` и статика — логируются на уровне `debug`.
- Тела запросов/ответов: логируются только на пониженном уровне (например, `trace`) и с лимитом размера; по умолчанию отключено. По умолчанию пишем только размер и hash.

Отложено на пост‑MVP (звёздочка):

- Базовые метрики времени ответа (гистограммы) и экспорт в Prometheus‑совместимый формат.


