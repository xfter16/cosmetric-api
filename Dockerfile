FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.3 --activate

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN pnpm prisma generate
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts \
    && pnpm add prisma@^7.8.0
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/src/generated ./src/generated
EXPOSE 3000
CMD ["sh", "-c", "pnpm prisma:deploy && node dist/src/main"]
