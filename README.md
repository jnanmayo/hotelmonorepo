# TungaOS

**Enterprise Hospitality Operating System**

Powered by Sharada Sama Solutions

---

## Overview

TungaOS is a commercial-grade, multi-tenant SaaS platform that unifies every department of a hotel — from direct booking and PMS to restaurant POS, HRMS, finance, and AI analytics — into a single modular operating system.

## Architecture

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the complete Software Architecture Document.

See [docs/DATABASE.md](./docs/DATABASE.md) for the enterprise PostgreSQL database design.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn UI |
| Backend | NestJS, Prisma, PostgreSQL |
| Cache | Redis |
| Realtime | Socket.io |
| Storage | AWS S3 + CloudFront |
| Monorepo | pnpm workspaces + Turborepo |

## Quick Start

```bash
# Prerequisites: Node.js 20+, pnpm 9+, Docker

# Windows
.\scripts\setup-dev.ps1

# macOS / Linux
chmod +x scripts/setup-dev.sh && ./scripts/setup-dev.sh

# Start development
pnpm dev
```

| Service | URL |
|---------|-----|
| Web | http://localhost:3000 |
| API | http://localhost:4000/api/v1 |
| API Docs | http://localhost:4000/docs |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

## Project Structure

```
tungaos/
├── apps/
│   ├── web/          Next.js frontend
│   └── api/          NestJS backend
├── packages/
│   ├── shared/       Cross-platform types, utils, validation
│   ├── eslint-config/
│   └── typescript-config/
├── docker/           Docker & NGINX configuration
├── scripts/          Dev setup scripts
├── assets/           Static brand assets
└── docs/             Architecture & ADRs
```

## License

Proprietary — Sharada Sama Solutions. All rights reserved.
