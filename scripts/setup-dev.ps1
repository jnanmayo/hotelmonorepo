# PowerShell equivalent of setup-dev.sh for Windows developers

Write-Host "Setting up TungaOS development environment..." -ForegroundColor Cyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js 20+ required"
    exit 1
}

if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Error "pnpm required — run: corepack enable"
    exit 1
}

pnpm install
pnpm --filter @tungaos/shared build

if (-not (Test-Path "apps/api/.env")) {
    Copy-Item "apps/api/.env.example" "apps/api/.env"
    Write-Host "Created apps/api/.env" -ForegroundColor Yellow
}

if (-not (Test-Path "apps/web/.env.local")) {
    Copy-Item "apps/web/.env.example" "apps/web/.env.local"
    Write-Host "Created apps/web/.env.local" -ForegroundColor Yellow
}

docker compose -f docker/docker-compose.yml up -d

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "Run: pnpm dev"
