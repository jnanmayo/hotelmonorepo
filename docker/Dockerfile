# ──────────────────────────────────────────────
# STAGE 1: BUILDER
# ──────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

# Copy manifests
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# Install ALL dependencies
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy source code
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared
COPY packages/typescript-config ./packages/typescript-config

# Build everything
RUN pnpm --filter @tungaos/shared build
RUN pnpm --filter @tungaos/api run prisma:generate
RUN pnpm --filter @tungaos/api build

# Deploy the API
RUN pnpm deploy --filter @tungaos/api --prod /app/deploy

RUN /app/apps/api/node_modules/.bin/prisma generate --schema /app/deploy/prisma/schema

# ──────────────────────────────────────────────
# STAGE 2: RUNNER
# ──────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/deploy ./

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "dist/main.js"]