#!/usr/bin/env bash
# =============================================================================
# TungaOS — Local Development Setup Script
# =============================================================================
set -euo pipefail

echo "🚀 Setting up TungaOS development environment..."

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "Node.js 20+ required"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "pnpm required — run: corepack enable"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Docker required for local services"; exit 1; }

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build shared package
echo "🔨 Building shared package..."
pnpm --filter @tungaos/shared build

# Copy environment files
if [ ! -f apps/api/.env ]; then
  cp apps/api/.env.example apps/api/.env
  echo "📝 Created apps/api/.env — update secrets before production"
fi

if [ ! -f apps/web/.env.local ]; then
  cp apps/web/.env.example apps/web/.env.local
  echo "📝 Created apps/web/.env.local"
fi

# Start Docker services
echo "🐳 Starting PostgreSQL and Redis..."
docker compose -f docker/docker-compose.yml up -d

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  pnpm dev:api   — Start NestJS API on :4000"
echo "  pnpm dev:web   — Start Next.js on :3000"
echo "  pnpm dev       — Start both concurrently"
