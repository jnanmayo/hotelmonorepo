FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Copy package files for caching
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Install dependencies
RUN pnpm install --frozen-lockfile

# ✅ Copy ONLY needed source code (not the entire monorepo)
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared
COPY packages/typescript-config ./packages/typescript-config

# Build
RUN pnpm --filter @tungaos/shared build
RUN pnpm --filter @tungaos/api run prisma:generate
RUN pnpm --filter @tungaos/api build

WORKDIR /app/apps/api
EXPOSE 4000
CMD ["node", "dist/main.js"]