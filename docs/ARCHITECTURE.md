# TungaOS — Software Architecture Document

**Version:** 0.1.0  
**Author:** Sharada Sama Solutions — Solution Architecture Team  
**Status:** Foundation Phase  
**Classification:** Internal / Engineering  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Overall Architecture](#2-overall-architecture)
3. [Complete Folder Structure](#3-complete-folder-structure)
4. [Folder Purpose Reference](#4-folder-purpose-reference)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Backend Architecture](#6-backend-architecture)
7. [Shared Utilities Package](#7-shared-utilities-package)
8. [Reusable Component Architecture](#8-reusable-component-architecture)
9. [State Management](#9-state-management)
10. [API Layer](#10-api-layer)
11. [Authentication Flow](#11-authentication-flow)
12. [Environment Variables](#12-environment-variables)
13. [Docker & Infrastructure](#13-docker--infrastructure)
14. [Git Strategy](#14-git-strategy)
15. [Coding Standards](#15-coding-standards)
16. [Naming Conventions](#16-naming-conventions)
17. [Scalability & Future Growth](#17-scalability--future-growth)
18. [Role-Based Access Control Architecture](#18-role-based-access-control-architecture)
19. [Multi-Tenancy Deep Dive](#19-multi-tenancy-deep-dive)
20. [Appendix: Architecture Decision Records](#20-appendix-architecture-decision-records)

---

## 1. Executive Summary

TungaOS is an enterprise-grade, multi-tenant Hospitality Operating System designed to be sold as SaaS to unlimited hotels — similar to how Shopify serves unlimited merchants from one platform. Each hotel operates in complete data isolation while sharing the same codebase, infrastructure, and deployment pipeline.

This document defines the **foundational architecture only**. No business modules, APIs, or database schemas are implemented at this stage. The goal is to establish production-grade scaffolding that every future module will plug into without refactoring the core.

### Design Principles

| Principle | Application |
|-----------|--------------|
| **Clean Architecture** | Strict layer separation: Presentation → Application → Domain → Infrastructure |
| **Modular Monolith** | Single deployable unit today; extractable microservices tomorrow |
| **Multi-Tenancy First** | Every data path assumes `hotel_id` isolation from day one |
| **SOLID** | Single responsibility per class; dependency injection throughout |
| **DRY** | Shared types, validation, and utilities in `@tungaos/shared` |
| **Repository Pattern** | All data access through repository interfaces |
| **Feature-Based Structure** | Vertical slices, not horizontal layers at the top level |

---

## 2. Overall Architecture

### 2.1 System Context

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL ACTORS                               │
│  Guests │ Corporate Clients │ Hotel Staff │ Vendors │ Super Admin     │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   CloudFront CDN    │
                    │   (Static Assets)   │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
   ┌──────▼──────┐     ┌───────▼───────┐    ┌──────▼──────┐
   │  Vercel     │     │   NGINX       │    │  Mobile Apps│
   │  (Next.js)  │     │  Reverse Proxy│    │  (Future)   │
   │  Port 3000  │     │  Port 80/443  │    └──────┬──────┘
   └──────┬──────┘     └───────┬───────┘           │
          │                    │                    │
          └────────────────────┼────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   NestJS API        │
                    │   Port 4000         │
                    │   /api/v1/*         │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
   ┌──────▼──────┐     ┌───────▼───────┐    ┌──────▼──────┐
   │ PostgreSQL  │     │    Redis      │    │   AWS S3    │
   │ (Primary DB)│     │ Cache/Session │    │  (Storage)  │
   └─────────────┘     │ Socket.io Pub │    └─────────────┘
                       └───────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
   ┌──────▼──────┐     ┌───────▼───────┐    ┌──────▼──────┐
   │  Razorpay   │     │    Stripe     │    │  WhatsApp   │
   │  (Payments) │     │  (Payments)   │    │  SMS / SMTP │
   └─────────────┘     └───────────────┘    └─────────────┘
```

### 2.2 Monorepo Architecture

TungaOS uses a **pnpm workspace monorepo** orchestrated by **Turborepo** for build caching and parallel task execution.

```
tungaos/                          ← Monorepo root
├── apps/                         ← Deployable applications
│   ├── web/                      ← Next.js 15 (Presentation — Guest & Staff UI)
│   └── api/                      ← NestJS (Application + Domain + Infrastructure)
├── packages/                     ← Shared libraries (no deployment)
│   ├── shared/                   ← Cross-platform types, validation, constants
│   ├── eslint-config/            ← Unified lint rules
│   └── typescript-config/        ← Shared TS compiler configs
├── docker/                       ← Container definitions
├── scripts/                      ← DevOps automation
├── assets/                       ← Static brand assets
└── docs/                         ← Architecture & ADRs
```

**Why monorepo?**
- Single source of truth for types between frontend and backend
- Atomic changes across API contracts and UI consumers
- Unified CI/CD pipeline
- Shared tooling (ESLint, Prettier, TypeScript configs)

### 2.3 Clean Architecture Layers

Each backend feature module implements four distinct layers:

```
┌─────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER                                     │
│  Controllers, DTOs, Guards, Middleware, Pipes           │
│  → HTTP/WebSocket entry points                          │
│  → Input validation, auth checks, response formatting   │
├─────────────────────────────────────────────────────────┤
│  APPLICATION LAYER                                      │
│  Services, Use Cases, Mappers, Event Handlers           │
│  → Orchestrates business workflows                      │
│  → No direct DB access — uses repository interfaces     │
├─────────────────────────────────────────────────────────┤
│  DOMAIN LAYER                                           │
│  Entities, Value Objects, Domain Events, Enums          │
│  → Pure business rules, zero framework dependencies     │
│  → Repository interfaces (contracts) defined here       │
├─────────────────────────────────────────────────────────┤
│  INFRASTRUCTURE LAYER                                   │
│  Repositories (Prisma), External APIs, S3, Redis, SMTP  │
│  → Implements domain interfaces                         │
│  → Framework-specific code lives here only              │
└─────────────────────────────────────────────────────────┘
```

**Dependency Rule:** Dependencies point inward only. Domain knows nothing about NestJS, Prisma, or HTTP.

### 2.4 Module Independence Contract

Every module MUST adhere to these rules:

1. **No direct imports** between feature modules — communicate via domain events or shared application services
2. **Own repository interfaces** — defined in domain, implemented in infrastructure
3. **Own DTOs** — request/response shapes scoped to the module
4. **Register independently** — each module has its own `*.module.ts` imported in `AppModule`
5. **Tenant-scoped by default** — all queries include `hotel_id` filter via `TenantGuard`

---

## 3. Complete Folder Structure

```
tungaos/
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                          # Lint, typecheck, test, build
│   │   ├── deploy-web.yml                  # Vercel deployment
│   │   └── deploy-api.yml                  # Docker build & deploy
│   ├── ISSUE_TEMPLATE/
│   │   └── feature_request.yml
│   └── pull_request_template.md
│
├── .vscode/
│   └── settings.json                       # Editor config for team consistency
│
├── apps/
│   ├── web/                                # ── FRONTEND ──
│   │   ├── public/
│   │   │   ├── favicon.ico
│   │   │   └── images/
│   │   ├── src/
│   │   │   ├── app/                        # Next.js App Router
│   │   │   │   ├── (public)/               # Hotel website (unauthenticated)
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── page.tsx            # Homepage
│   │   │   │   │   ├── rooms/
│   │   │   │   │   ├── dining/
│   │   │   │   │   ├── offers/
│   │   │   │   │   ├── meetings-events/
│   │   │   │   │   ├── facilities/
│   │   │   │   │   ├── explore/
│   │   │   │   │   └── contact/
│   │   │   │   ├── (auth)/                 # Authentication pages
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── register/
│   │   │   │   │   ├── forgot-password/
│   │   │   │   │   └── auth/callback/      # OAuth callback
│   │   │   │   ├── (dashboard)/            # Staff/admin dashboard
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── admin/              # Super admin
│   │   │   │   │   ├── pms/
│   │   │   │   │   ├── front-desk/
│   │   │   │   │   ├── housekeeping/
│   │   │   │   │   ├── restaurant/
│   │   │   │   │   ├── inventory/
│   │   │   │   │   ├── finance/
│   │   │   │   │   ├── hrms/
│   │   │   │   │   ├── crm/
│   │   │   │   │   ├── reports/
│   │   │   │   │   └── settings/
│   │   │   │   ├── (portal)/               # Corporate & guest portals
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── corporate/
│   │   │   │   │   └── guest/
│   │   │   │   ├── api/                    # Next.js Route Handlers (BFF)
│   │   │   │   ├── layout.tsx              # Root layout
│   │   │   │   └── globals.css             # Global styles + CSS variables
│   │   │   ├── components/
│   │   │   │   ├── ui/                     # Shadcn UI primitives
│   │   │   │   ├── common/                 # Reusable business-agnostic
│   │   │   │   ├── layouts/                # Shell layouts
│   │   │   │   ├── forms/                  # Form building blocks
│   │   │   │   ├── tables/                 # Data table system
│   │   │   │   ├── charts/                 # Recharts wrappers
│   │   │   │   └── modals/                 # Dialog/drawer system
│   │   │   ├── features/                   # Feature modules (vertical slices)
│   │   │   │   ├── website/
│   │   │   │   ├── booking/
│   │   │   │   ├── pms/
│   │   │   │   ├── front-desk/
│   │   │   │   ├── housekeeping/
│   │   │   │   ├── restaurant/
│   │   │   │   ├── room-service/
│   │   │   │   ├── corporate/
│   │   │   │   ├── inventory/
│   │   │   │   ├── purchase/
│   │   │   │   ├── vendors/
│   │   │   │   ├── maintenance/
│   │   │   │   ├── hrms/
│   │   │   │   ├── finance/
│   │   │   │   ├── crm/
│   │   │   │   ├── reports/
│   │   │   │   ├── owner-dashboard/
│   │   │   │   ├── investor/
│   │   │   │   ├── ai-analytics/
│   │   │   │   ├── integrations/
│   │   │   │   └── admin/
│   │   │   ├── hooks/                      # Shared custom hooks
│   │   │   ├── lib/                        # Utilities (cn, env, query-client)
│   │   │   ├── providers/                  # React context providers
│   │   │   ├── services/                   # API service classes
│   │   │   ├── stores/                     # Zustand client stores
│   │   │   ├── types/                      # Frontend-only types
│   │   │   ├── constants/                  # Frontend-only constants
│   │   │   ├── utils/                      # Frontend-only utilities
│   │   │   └── middleware.ts               # Edge middleware (auth + tenant)
│   │   ├── components.json                 # Shadcn UI config
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── postcss.config.mjs
│   │   ├── tsconfig.json
│   │   ├── eslint.config.mjs
│   │   ├── .env.example
│   │   └── package.json
│   │
│   └── api/                                # ── BACKEND ──
│       ├── prisma/
│       │   ├── schema.prisma               # Database schema (future phase)
│       │   └── migrations/                 # Migration history
│       ├── src/
│       │   ├── main.ts                     # Bootstrap entry point
│       │   ├── app.module.ts               # Root module
│       │   ├── config/                     # Environment configuration
│       │   │   ├── app.config.ts
│       │   │   ├── auth.config.ts
│       │   │   ├── database.config.ts
│       │   │   ├── redis.config.ts
│       │   │   ├── storage.config.ts
│       │   │   └── env.validation.ts
│       │   ├── common/                     # Cross-cutting concerns
│       │   │   ├── decorators/
│       │   │   ├── filters/
│       │   │   ├── guards/
│       │   │   ├── interceptors/
│       │   │   ├── middleware/
│       │   │   ├── pipes/
│       │   │   ├── constants/
│       │   │   ├── types/
│       │   │   ├── utils/
│       │   │   └── dto/
│       │   ├── infrastructure/             # External system adapters
│       │   │   ├── database/
│       │   │   ├── cache/
│       │   │   ├── storage/
│       │   │   ├── messaging/
│       │   │   └── external/
│       │   └── modules/                    # Feature modules
│       │       ├── auth/
│       │       ├── tenant/
│       │       ├── hotel/
│       │       ├── user/
│       │       ├── role/
│       │       ├── booking/
│       │       ├── pms/
│       │       ├── front-desk/
│       │       ├── housekeeping/
│       │       ├── restaurant/
│       │       ├── room-service/
│       │       ├── corporate/
│       │       ├── inventory/
│       │       ├── purchase/
│       │       ├── vendor/
│       │       ├── maintenance/
│       │       ├── hrms/
│       │       ├── finance/
│       │       ├── crm/
│       │       ├── reports/
│       │       ├── owner-dashboard/
│       │       ├── investor/
│       │       ├── ai-analytics/
│       │       ├── integrations/
│       │       ├── notification/
│       │       └── payment/
│       ├── test/
│       │   ├── jest-e2e.json
│       │   └── e2e/
│       ├── nest-cli.json
│       ├── tsconfig.json
│       ├── tsconfig.build.json
│       ├── eslint.config.mjs
│       ├── .env.example
│       └── package.json
│
├── packages/
│   ├── shared/                             # ── SHARED ──
│   │   ├── src/
│   │   │   ├── constants/
│   │   │   │   ├── index.ts
│   │   │   │   ├── roles.ts                # Role enum definitions
│   │   │   │   ├── permissions.ts           # Permission key constants
│   │   │   │   └── modules.ts              # Module registry
│   │   │   ├── types/
│   │   │   │   ├── index.ts
│   │   │   │   ├── api.types.ts
│   │   │   │   ├── auth.types.ts
│   │   │   │   └── tenant.types.ts
│   │   │   ├── utils/
│   │   │   │   ├── index.ts
│   │   │   │   ├── pagination.utils.ts
│   │   │   │   └── date.utils.ts
│   │   │   ├── validation/
│   │   │   │   ├── index.ts
│   │   │   │   ├── auth.schemas.ts
│   │   │   │   └── common.schemas.ts
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   ├── tsconfig.build.json
│   │   ├── eslint.config.mjs
│   │   └── package.json
│   ├── eslint-config/
│   │   ├── base.js
│   │   ├── nextjs.js
│   │   ├── nestjs.js
│   │   └── package.json
│   └── typescript-config/
│       ├── base.json
│       ├── nextjs.json
│       ├── nestjs.json
│       ├── react-library.json
│       └── package.json
│
├── docker/
│   ├── docker-compose.yml                  # Local dev services
│   ├── docker-compose.prod.yml             # Production stack
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   └── nginx/
│       ├── nginx.conf
│       └── conf.d/
│           └── tungaos.conf
│
├── scripts/
│   ├── setup-dev.sh                        # macOS/Linux setup
│   └── setup-dev.ps1                       # Windows setup
│
├── assets/
│   ├── brand/
│   ├── icons/
│   ├── images/
│   └── fonts/
│
├── docs/
│   ├── ARCHITECTURE.md                     # This document
│   └── adr/                                # Architecture Decision Records
│       └── 001-monorepo-pnpm-turborepo.md
│
├── .editorconfig
├── .env.example
├── .gitignore
├── .prettierrc
├── .prettierignore
├── lint-staged.config.mjs
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

### 3.1 Backend Module Internal Structure (Template)

Every backend module follows this exact internal layout:

```
modules/<module-name>/
├── <module-name>.module.ts
├── presentation/
│   ├── controllers/
│   │   └── <module-name>.controller.ts
│   ├── dto/
│   │   ├── create-<entity>.dto.ts
│   │   ├── update-<entity>.dto.ts
│   │   └── <entity>-response.dto.ts
│   └── guards/                             # Module-specific guards (if any)
├── application/
│   ├── services/
│   │   └── <module-name>.service.ts
│   ├── interfaces/
│   │   └── <module-name>.service.interface.ts
│   └── mappers/
│       └── <entity>.mapper.ts
├── domain/
│   ├── entities/
│   │   └── <entity>.entity.ts
│   ├── interfaces/
│   │   └── <entity>.repository.interface.ts
│   ├── enums/
│   └── events/
│       └── <entity>-created.event.ts
└── infrastructure/
    ├── repositories/
    │   └── <entity>.repository.ts
    └── adapters/
```

### 3.2 Frontend Feature Module Internal Structure (Template)

```
features/<module-name>/
├── components/                             # Module-specific UI
├── hooks/                                  # Module-specific hooks
├── services/                               # Module API services
├── types/                                  # Module types
├── utils/                                  # Module utilities
└── index.ts                                # Public barrel export
```

---

## 4. Folder Purpose Reference

### 4.1 Root Level

| Folder / File | Purpose |
|---------------|---------|
| `apps/` | Deployable applications — only code that runs in production |
| `packages/` | Shared libraries consumed by apps — compiled, versioned internally |
| `docker/` | All containerization — dev services, production images, NGINX |
| `scripts/` | Automation scripts for setup, migration, seeding, deployment |
| `assets/` | Static brand assets not served from S3 (platform-level only) |
| `docs/` | Architecture documents, ADRs, runbooks |
| `.github/` | CI/CD workflows, PR templates, issue templates |
| `turbo.json` | Turborepo task pipeline — defines build order and caching |
| `pnpm-workspace.yaml` | Declares monorepo package locations |

### 4.2 Frontend (`apps/web`)

| Folder | Purpose |
|--------|---------|
| `app/(public)/` | Route group for the hotel public website — no auth required, tenant-branded |
| `app/(auth)/` | Login, register, password reset, OAuth callback — redirects if authenticated |
| `app/(dashboard)/` | Protected staff/admin routes — sidebar layout, role-based nav |
| `app/(portal)/` | Corporate client and guest self-service portals |
| `app/api/` | Next.js Route Handlers for BFF patterns (token exchange, webhooks) |
| `components/ui/` | Shadcn UI primitives — never modified for business logic |
| `components/common/` | Business-agnostic reusables: buttons, cards, filters, pagination |
| `components/layouts/` | Application shells: public header/footer, dashboard sidebar |
| `components/forms/` | Form building blocks: date pickers, guest selectors |
| `components/tables/` | Data table system built on TanStack Table |
| `components/charts/` | Recharts wrappers with TungaOS theme |
| `components/modals/` | Confirm dialogs, form dialogs, drawers |
| `features/` | Vertical feature slices — each module is self-contained |
| `hooks/` | Shared custom hooks (media queries, debounce, etc.) |
| `lib/` | Core utilities: `cn()`, env access, query client factory |
| `providers/` | React context tree: auth, tenant, theme |
| `services/` | Axios-based API service classes |
| `stores/` | Zustand stores for client-side state |
| `middleware.ts` | Edge middleware: tenant resolution, auth guards |

### 4.3 Backend (`apps/api`)

| Folder | Purpose |
|--------|---------|
| `config/` | Typed environment configuration via `@nestjs/config` |
| `common/` | Cross-cutting: guards, filters, interceptors, decorators, pipes |
| `infrastructure/` | External adapters: Prisma, Redis, S3, Socket.io, payment gateways |
| `modules/` | Feature modules — each follows Clean Architecture layers |
| `prisma/` | Database schema and migration history |

### 4.4 Shared (`packages/shared`)

| Folder | Purpose |
|--------|---------|
| `constants/` | Platform-wide constants: roles, permissions, theme defaults |
| `types/` | Cross-platform TypeScript interfaces (API envelopes, JWT payload) |
| `utils/` | Framework-agnostic utilities: pagination, date formatting |
| `validation/` | Zod schemas shared between frontend forms and backend DTOs |

---

## 5. Frontend Architecture

### 5.1 Technology Decisions

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Framework | Next.js 15 App Router | SSR/SSG for SEO (hotel website), RSC for dashboard performance |
| UI Library | Shadcn UI + Tailwind | Copy-paste ownership, full customization, no vendor lock-in |
| Styling | Tailwind CSS + CSS Variables | Runtime tenant theming via CSS custom properties |
| Forms | React Hook Form + Zod | Performance (uncontrolled), shared validation schemas |
| Data Fetching | TanStack React Query | Cache, deduplication, optimistic updates, devtools |
| HTTP Client | Axios | Interceptors for auth/tenant headers, mature ecosystem |
| Animation | Framer Motion | Professional, subtle animations — no flashy effects |
| Icons | Lucide React | Consistent, tree-shakeable icon set |
| Notifications | React Hot Toast | Lightweight, customizable toast system |
| Charts | Recharts | Composable, React-native chart library |

### 5.2 Route Architecture

Next.js **Route Groups** `(folder)` organize layouts without affecting URLs:

```
(public)/page.tsx          →  /
(public)/rooms/page.tsx    →  /rooms
(auth)/login/page.tsx      →  /login
(dashboard)/pms/page.tsx   →  /pms
(portal)/corporate/page.tsx → /corporate
```

Each route group has its own `layout.tsx` providing the appropriate shell (public header, dashboard sidebar, auth card).

### 5.3 Tenant Theming

Multi-tenant branding is injected at runtime:

1. **Middleware** resolves `hotel_id` from subdomain (`tunga.tungaos.com`) or path (`/hotels/tunga-international`)
2. **TenantProvider** fetches branding config and sets CSS variables:
   ```css
   --primary: <hotel.primaryColor>
   --secondary: <hotel.secondaryColor>
   ```
3. **Tailwind** references these via `hsl(var(--primary))` — no hardcoded colors in components
4. **Shadcn components** automatically inherit tenant colors

### 5.4 Rendering Strategy

| Route Type | Strategy | Reason |
|------------|----------|--------|
| Hotel website pages | SSR / ISR | SEO, fast first paint, CDN cacheable |
| Dashboard pages | CSR with RSC shell | Interactive, auth-gated, no SEO needed |
| Auth pages | Static | Simple forms, no dynamic data |
| API routes (BFF) | Server-side only | Token handling, webhook verification |

### 5.5 Provider Tree

```
QueryClientProvider
  └── TenantProvider          ← hotel_id, branding
        └── AuthProvider      ← user session, permissions
              └── {children}
              └── Toaster
```

Order matters: Tenant resolves before Auth (permissions may be tenant-scoped).

---

## 6. Backend Architecture

### 6.1 Technology Decisions

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Framework | NestJS 10 | Enterprise DI, modular architecture, decorators |
| ORM | Prisma | Type-safe queries, migration management, multi-schema ready |
| Database | PostgreSQL 16 | ACID, JSON support, row-level security option |
| Cache | Redis 7 | Session store, rate limiting, Socket.io adapter |
| Validation | class-validator + Zod | DTO validation (backend) + shared schemas |
| Documentation | Swagger/OpenAPI | Auto-generated from decorators |
| Realtime | Socket.io | Room-based events per hotel |
| Auth | Passport.js + JWT | Strategy pattern for JWT, Google OAuth |

### 6.2 Request Lifecycle

```
HTTP Request
  │
  ▼
NGINX (reverse proxy, SSL termination)
  │
  ▼
NestJS Middleware
  ├── RequestIdMiddleware        → assigns correlation ID
  └── TenantResolverMiddleware   → extracts hotel_id from header/subdomain
  │
  ▼
Guards
  ├── ThrottlerGuard             → rate limiting
  ├── JwtAuthGuard               → token validation
  ├── TenantGuard                → validates hotel_id access
  ├── RolesGuard                 → role check
  └── PermissionsGuard           → fine-grained permission check
  │
  ▼
Interceptors
  ├── LoggingInterceptor         → structured request/response logging
  └── TransformInterceptor       → wraps response in ApiResponse<T>
  │
  ▼
Pipes
  └── ValidationPipe             → DTO validation (whitelist + transform)
  │
  ▼
Controller → Service → Repository → Prisma → PostgreSQL
  │
  ▼
Response (ApiResponse<T> envelope)
```

### 6.3 API Response Envelope

All API responses follow a consistent shape defined in `@tungaos/shared`:

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "message": "Optional success message",
  "timestamp": "2026-06-29T12:00:00.000Z"
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": { "email": ["Invalid email format"] }
  },
  "timestamp": "2026-06-29T12:00:00.000Z"
}

// Paginated
{
  "success": true,
  "data": {
    "items": [ ... ],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  },
  "timestamp": "2026-06-29T12:00:00.000Z"
}
```

### 6.4 Dependency Injection Pattern

```typescript
// Domain layer — interface (contract)
interface IBookingRepository {
  findByHotelId(hotelId: HotelId, filters: BookingFilters): Promise<Booking[]>;
  create(hotelId: HotelId, data: CreateBookingData): Promise<Booking>;
}

// Infrastructure layer — implementation
@Injectable()
class BookingRepository implements IBookingRepository {
  constructor(private readonly prisma: PrismaService) {}
  // ...
}

// Application layer — service uses interface
@Injectable()
class BookingService {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepo: IBookingRepository,
  ) {}
}

// Module — binds interface to implementation
@Module({
  providers: [
    BookingService,
    { provide: 'IBookingRepository', useClass: BookingRepository },
  ],
})
class BookingModule {}
```

---

## 7. Shared Utilities Package

### 7.1 Purpose

`@tungaos/shared` is the **single source of truth** for anything used by both frontend and backend. It contains zero framework dependencies.

### 7.2 What Belongs Here

| Category | Examples |
|----------|---------|
| **Constants** | `APP_NAME`, `TENANT_HEADER`, `AUTH_COOKIES`, role names, permission keys |
| **Types** | `ApiResponse<T>`, `PaginatedResponse<T>`, `JwtPayload`, `TenantBranding`, `HotelId` |
| **Validation** | Zod schemas for pagination, email, password, shared form fields |
| **Utils** | Pagination math, safe JSON parse, branded type constructors |

### 7.3 What Does NOT Belong Here

- React components or hooks
- NestJS decorators or services
- Prisma models or queries
- Environment variable access
- Framework-specific utilities

### 7.4 Consumption Pattern

```typescript
// Frontend
import { paginationQuerySchema } from '@tungaos/shared/validation';
import type { ApiResponse } from '@tungaos/shared/types';
import { TENANT_HEADER } from '@tungaos/shared/constants';

// Backend
import { buildPaginationMeta } from '@tungaos/shared/utils';
import type { JwtPayload } from '@tungaos/shared/types';
```

### 7.5 Build Pipeline

`@tungaos/shared` MUST be built before any app:

```
pnpm --filter @tungaos/shared build   →  dist/
pnpm --filter @tungaos/web build      →  depends on shared
pnpm --filter @tungaos/api build      →  depends on shared
```

Turborepo handles this via `"dependsOn": ["^build"]` in `turbo.json`.

---

## 8. Reusable Component Architecture

### 8.1 Component Hierarchy

```
Layer 4: Feature Components     features/booking/components/BookingWidget
Layer 3: Composed Components    components/common/, components/forms/
Layer 2: Shadcn Primitives      components/ui/button, input, card
Layer 1: HTML Elements          Native DOM
```

**Rule:** Components only import from their layer or below. Feature components never import from other features.

### 8.2 Component Categories

#### UI Primitives (`components/ui/`)
Generated by Shadcn CLI. Never add business logic. Examples:
- `Button`, `Input`, `Card`, `Dialog`, `Table`, `Select`, `Calendar`, `Badge`, `Avatar`

#### Common Components (`components/common/`)

| Component | Purpose |
|-----------|---------|
| `PrimaryButton` | Navy branded CTA with loading state |
| `StatCard` | KPI display with icon, value, trend |
| `ImageCard` | Card with image overlay (Discover Our Spaces) |
| `SearchInput` | Debounced search with clear button |
| `PaginationBar` | Page navigation with page size selector |
| `EmptyState` | Illustration + message + action |
| `PageLoader` | Full-page loading skeleton |
| `TenantLogo` | Dynamic logo from tenant branding |

#### Layout Components (`components/layouts/`)

| Layout | Used By |
|--------|---------|
| `PublicLayout` | Hotel website — header, nav, footer, WhatsApp float |
| `DashboardLayout` | Staff dashboard — sidebar, topbar, breadcrumbs |
| `AuthLayout` | Login/register — centered card on grey background |
| `PortalLayout` | Corporate/guest portal — simplified nav |

#### Form Components (`components/forms/`)

| Component | Purpose |
|-----------|---------|
| `FormField` | Label + input + error + description wrapper |
| `DateRangePicker` | Check-in / check-out selector |
| `GuestSelector` | Adults, children, rooms counter |
| `FormSection` | Grouped form section with title |

#### Table Components (`components/tables/`)

| Component | Purpose |
|-----------|---------|
| `DataTable` | Generic sortable, filterable table (TanStack Table) |
| `TableToolbar` | Search, filters, column visibility toggle |
| `TablePagination` | Server-side pagination controls |

### 8.3 Component Authoring Rules

1. **Props interface** — always exported, always typed, never `any`
2. **Variants via CVA** — use `class-variance-authority` for size/color variants
3. **Composition over configuration** — prefer children/slots over prop explosion
4. **Forward refs** — all interactive components use `React.forwardRef`
5. **Accessibility** — ARIA labels, keyboard navigation, focus management
6. **Responsive** — mobile-first Tailwind classes
7. **No data fetching** — components receive data via props; hooks handle fetching

---

## 9. State Management

### 9.1 State Categories

| Category | Tool | Scope | Examples |
|----------|------|-------|---------|
| **Server State** | TanStack React Query | API data | Bookings, rooms, guests, reports |
| **Client UI State** | Zustand | UI preferences | Sidebar collapsed, active tab |
| **Auth State** | Zustand + Context | Session | User, tokens, permissions |
| **Tenant State** | Zustand + Context | Branding | hotel_id, colors, logo |
| **Form State** | React Hook Form | Form inputs | Booking form, guest details |
| **URL State** | Next.js searchParams | Shareable filters | Date range, page, sort |

### 9.2 Server State (React Query)

```typescript
// Query key factory — one per feature module
export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (hotelId: string, filters: BookingFilters) =>
    [...bookingKeys.lists(), hotelId, filters] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (hotelId: string, id: string) =>
    [...bookingKeys.details(), hotelId, id] as const,
};
```

**Rules:**
- All query keys include `hotelId` for tenant isolation
- Mutations invalidate related queries
- Optimistic updates for UX-critical operations (check-in, status change)
- `staleTime: 60s` default — override per query based on data volatility

### 9.3 Client State (Zustand)

Used sparingly for state that doesn't belong on the server:

| Store | State | Persistence |
|-------|-------|-------------|
| `auth.store` | user, accessToken, isAuthenticated | localStorage (partial) |
| `tenant.store` | hotelId, slug, branding | sessionStorage |
| `ui.store` | sidebarOpen, theme | localStorage |

### 9.4 State Flow Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Component   │────▶│  React Query │────▶│  API Service │
│  (UI)        │◀────│  (cache)     │◀────│  (Axios)     │
└──────┬───────┘     └──────────────┘     └──────────────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│  Zustand     │     │  React Hook  │
│  (UI state)  │     │  Form        │
└──────────────┘     └──────────────┘
```

---

## 10. API Layer

### 10.1 Architecture

```
Component
  └── Custom Hook (useBookings)
        └── React Query (useQuery / useMutation)
              └── Feature Service (BookingService extends BaseApiService)
                    └── API Client (Axios instance with interceptors)
                          └── NestJS Controller
```

### 10.2 API Client Configuration

The Axios instance (`services/api-client.ts`) handles:

| Concern | Implementation |
|---------|---------------|
| Base URL | From `NEXT_PUBLIC_API_URL` env var |
| Auth | `withCredentials: true` — HttpOnly cookies |
| Tenant | `x-hotel-id` header injected from tenant store |
| Timeout | 30 seconds default |
| 401 handling | Automatic refresh token rotation |
| Error normalization | All errors mapped to `ApiError` shape |

### 10.3 Service Class Pattern

```typescript
// Feature service extends base
class BookingService extends BaseApiService {
  constructor() {
    super('/bookings');
  }

  async getAvailability(params: AvailabilityParams): Promise<RoomAvailability[]> {
    return this.get<RoomAvailability[]>('/availability', { params });
  }

  async createBooking(data: CreateBookingDto): Promise<Booking> {
    return this.post<Booking>('/', data);
  }
}

export const bookingService = new BookingService();
```

### 10.4 Custom Hook Pattern

```typescript
function useBookings(filters: BookingFilters) {
  const { hotelId } = useTenantContext();

  return useQuery({
    queryKey: bookingKeys.list(hotelId!, filters),
    queryFn: () => bookingService.getPaginated('', { params: filters }),
    enabled: !!hotelId,
  });
}
```

### 10.5 API Versioning

- Base path: `/api/v1/`
- Version in URL (URI versioning via NestJS `VersioningType.URI`)
- Breaking changes → `/api/v2/` with parallel support period
- Non-breaking additions → same version

---

## 11. Authentication Flow

### 11.1 Token Strategy

| Token | Storage | Expiry | Purpose |
|-------|---------|--------|---------|
| Access Token | HttpOnly cookie | 15 minutes | API authorization |
| Refresh Token | HttpOnly cookie | 7 days | Access token renewal |
| CSRF Token | Meta tag / cookie | Session | CSRF protection |

**Why HttpOnly cookies?** Prevents XSS token theft. Frontend never reads tokens directly.

### 11.2 Login Flow

```
┌────────┐     ┌────────┐     ┌────────┐     ┌────────┐
│ Client │     │ Next.js│     │ NestJS │     │  Redis │
│ Browser│     │  Web   │     │  API   │     │        │
└───┬────┘     └───┬────┘     └───┬────┘     └───┬────┘
    │              │              │              │
    │  POST /login │              │              │
    │─────────────▶│              │              │
    │              │ POST /auth/login             │
    │              │─────────────▶│              │
    │              │              │ Validate credentials
    │              │              │ Generate JWT pair
    │              │              │ Store refresh in Redis
    │              │              │─────────────▶│
    │              │              │              │
    │              │ Set-Cookie: access + refresh │
    │              │◀─────────────│              │
    │  Redirect to dashboard     │              │
    │◀─────────────│              │              │
```

### 11.3 Token Refresh Flow

```
Client                    API                     Redis
  │                        │                        │
  │  API call (401)        │                        │
  │───────────────────────▶│                        │
  │                        │                        │
  │  POST /auth/refresh    │                        │
  │  (refresh cookie)      │                        │
  │───────────────────────▶│                        │
  │                        │  Validate refresh token│
  │                        │───────────────────────▶│
  │                        │◀───────────────────────│
  │                        │  Rotate refresh token  │
  │                        │───────────────────────▶│
  │  New access + refresh  │                        │
  │◀───────────────────────│                        │
  │                        │                        │
  │  Retry original call   │                        │
  │───────────────────────▶│                        │
```

### 11.4 Google OAuth Flow

```
1. User clicks "Sign in with Google"
2. Redirect to /api/v1/auth/google (NestJS Passport)
3. Google consent screen
4. Callback to /api/v1/auth/google/callback
5. Find or create user, assign default role
6. Generate JWT pair, set cookies
7. Redirect to /auth/callback (Next.js)
8. Client hydrates auth state
```

### 11.5 Authorization Layers

```
Layer 1: Authentication    Is the user logged in?         JwtAuthGuard
Layer 2: Tenant Access       Does user belong to this hotel? TenantGuard
Layer 3: Role Check          Does user have required role?   RolesGuard
Layer 4: Permission Check    Does user have permission?      PermissionsGuard
```

### 11.6 Role Hierarchy

```
Super Admin
  └── Full platform access, all hotels, system configuration

Hotel Owner
  └── Full access to own hotel(s), financial reports, staff management

General Manager
  └── All departments except owner-level financials

Department Roles (scoped permissions)
  ├── Receptionist          → front-desk, reservations
  ├── Reservation Team      → bookings, availability
  ├── Housekeeping          → room status, tasks
  ├── Restaurant Manager    → POS, menu, orders
  ├── Kitchen Staff         → order queue, preparation
  ├── Store Manager         → inventory, purchase orders
  ├── Inventory Manager     → stock levels, requisitions
  ├── Finance               → invoices, payments, reports
  ├── HR                    → employees, payroll, attendance
  └── Marketing             → offers, campaigns, website content

External Roles
  ├── Corporate Client      → corporate bookings, invoices
  ├── Guest                 → own bookings, profile
  └── Vendor                → purchase orders, invoices
```

---

## 12. Environment Variables

### 12.1 Configuration Strategy

| Environment | Frontend | Backend |
|-------------|----------|---------|
| Local dev | `apps/web/.env.local` | `apps/api/.env` |
| Staging | Vercel env vars | Railway/EC2 env vars |
| Production | Vercel env vars | Railway/EC2 env vars + secrets manager |

### 12.2 Frontend Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_NAME` | Yes | Display name |
| `NEXT_PUBLIC_APP_URL` | Yes | Frontend base URL |
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL |
| `NEXT_PUBLIC_TENANT_MODE` | Yes | `subdomain` or `path` |
| `NEXT_PUBLIC_DEFAULT_HOTEL_SLUG` | Yes | Fallback tenant slug |
| `NEXT_PUBLIC_AUTH_COOKIE_DOMAIN` | Yes | Cookie domain |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `NEXT_PUBLIC_SOCKET_URL` | Yes | Socket.io server URL |
| `NEXT_PUBLIC_CDN_URL` | No | CloudFront distribution URL |
| `NEXT_PUBLIC_ENABLED_MODULES` | No | Comma-separated module list |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | No | WhatsApp widget number |

### 12.3 Backend Variables

| Variable | Required | Secret | Description |
|----------|----------|--------|-------------|
| `NODE_ENV` | Yes | No | `development` / `production` |
| `PORT` | Yes | No | API port (default 4000) |
| `DATABASE_URL` | Yes | Yes | PostgreSQL connection string |
| `REDIS_URL` | Yes | Yes | Redis connection string |
| `JWT_ACCESS_SECRET` | Yes | Yes | Min 32 characters |
| `JWT_REFRESH_SECRET` | Yes | Yes | Min 32 characters |
| `JWT_ACCESS_EXPIRY` | Yes | No | Default `15m` |
| `JWT_REFRESH_EXPIRY` | Yes | No | Default `7d` |
| `GOOGLE_CLIENT_ID` | No | No | OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Yes | OAuth client secret |
| `AWS_ACCESS_KEY_ID` | No | Yes | S3 access key |
| `AWS_SECRET_ACCESS_KEY` | No | Yes | S3 secret key |
| `AWS_S3_BUCKET` | No | No | S3 bucket name |
| `AWS_CLOUDFRONT_URL` | No | No | CDN URL |
| `SMTP_*` | No | Yes | Email configuration |
| `WHATSAPP_*` | No | Yes | WhatsApp API credentials |
| `SMS_*` | No | Yes | SMS API credentials |
| `RAZORPAY_*` | No | Yes | Razorpay credentials |
| `STRIPE_*` | No | Yes | Stripe credentials |
| `CORS_ORIGINS` | Yes | No | Comma-separated allowed origins |

### 12.4 Security Rules

1. **Never commit** `.env`, `.env.local`, or any file containing secrets
2. **`NEXT_PUBLIC_*`** vars are exposed to the browser — never put secrets here
3. **Validate on startup** — backend uses `env.validation.ts` with class-validator
4. **Rotate secrets** — JWT secrets rotated quarterly in production
5. **Use secrets manager** — AWS Secrets Manager or Railway env groups in production

---

## 13. Docker & Infrastructure

### 13.1 Local Development

```bash
docker compose -f docker/docker-compose.yml up -d
```

Starts:
- **PostgreSQL 16** on port 5432
- **Redis 7** on port 6379

Apps run natively via `pnpm dev` for hot reload.

### 13.2 Production Stack

```
                    ┌─────────────┐
                    │   Vercel    │ ← Next.js frontend
                    │  (CDN edge) │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   NGINX     │ ← SSL, reverse proxy, rate limiting
                    │  :80 / :443 │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──┐  ┌─────▼────┐  ┌───▼────┐
       │  API    │  │ Socket.io│  │  Docs  │
       │  :4000  │  │  (same)  │  │ /docs  │
       └──────┬──┘  └──────────┘  └────────┘
              │
       ┌──────┼──────┐
       │             │
  ┌────▼────┐  ┌─────▼───┐
  │ Postgres│  │  Redis  │
  └─────────┘  └─────────┘
```

### 13.3 Docker Images

| Image | Base | Size Target | Purpose |
|-------|------|-------------|---------|
| `Dockerfile.api` | node:20-alpine | < 200MB | NestJS API production |
| `Dockerfile.web` | node:20-alpine | < 150MB | Next.js standalone (self-hosted) |

Both use multi-stage builds:
1. **deps** — install dependencies
2. **builder** — compile TypeScript
3. **runner** — minimal production image with non-root user

### 13.4 Deployment Targets

| Component | Platform | Trigger |
|-----------|----------|---------|
| Frontend | Vercel | Push to `main` |
| Backend | Railway / AWS EC2 | Push to `main` (api paths) |
| Database | Railway PostgreSQL / AWS RDS | Managed service |
| Redis | Railway Redis / AWS ElastiCache | Managed service |
| Storage | AWS S3 + CloudFront | Manual / Terraform |
| CI | GitHub Actions | Push + PR |

---

## 14. Git Strategy

### 14.1 Branching Model (GitFlow Adapted)

```
main ────────────────────────────────────────────── Production
  │
develop ─────────────────────────────────────────── Integration
  │
  ├── feature/booking-engine ──────── Feature branch
  ├── feature/pms-room-management ── Feature branch
  ├── fix/auth-token-refresh ─────── Bug fix
  └── chore/upgrade-dependencies ─── Maintenance
```

| Branch | Purpose | Merges Into | Deploys To |
|--------|---------|-------------|------------|
| `main` | Production-ready code | — | Production |
| `develop` | Integration branch | `main` (release) | Staging |
| `feature/*` | New features | `develop` | Preview (Vercel) |
| `fix/*` | Bug fixes | `develop` or `main` (hotfix) | Staging / Production |
| `chore/*` | Tooling, deps, config | `develop` | — |
| `release/*` | Release preparation | `main` + `develop` | Staging |

### 14.2 Commit Message Convention (Conventional Commits)

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

| Type | Usage |
|------|-------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change that neither fixes nor adds |
| `chore` | Tooling, dependencies |
| `docs` | Documentation only |
| `test` | Adding/updating tests |
| `ci` | CI/CD changes |
| `perf` | Performance improvement |

**Examples:**
```
feat(booking): add date range availability check
fix(auth): resolve refresh token rotation race condition
refactor(pms): extract room status state machine
chore(deps): upgrade Next.js to 15.2
```

### 14.3 Pull Request Rules

1. **All changes via PR** — no direct pushes to `main` or `develop`
2. **Require CI pass** — lint, typecheck, test, build
3. **Require 1 approval** — for `develop`; 2 for `main`
4. **Squash merge** — on feature → develop
5. **Merge commit** — on develop → main (preserve history)
6. **PR template** — includes multi-tenancy checklist
7. **Max PR size** — 400 lines changed (split larger changes)

### 14.4 Release Process

```
1. Create release/vX.Y.Z from develop
2. Final testing on staging
3. Update CHANGELOG.md
4. Merge to main → tag vX.Y.Z
5. Merge back to develop
6. GitHub Actions deploys automatically
```

---

## 15. Coding Standards

### 15.1 TypeScript Rules

| Rule | Enforcement |
|------|-------------|
| Strict mode enabled | `tsconfig.base.json` |
| No `any` type | ESLint `@typescript-eslint/no-explicit-any: error` |
| No unused variables | ESLint with `argsIgnorePattern: ^_` |
| Consistent type imports | `import type { X }` enforced |
| No implicit returns | `noImplicitReturns: true` |
| No unchecked indexed access | `noUncheckedIndexedAccess: true` |

### 15.2 File Organization Rules

1. **One component per file** — except tightly coupled sub-components
2. **Barrel exports** — each folder has `index.ts` exporting public API
3. **Co-location** — tests live next to source: `booking.service.ts` + `booking.service.spec.ts`
4. **Max file length** — 300 lines; split if exceeded
5. **Max function length** — 50 lines; extract helpers

### 15.3 Import Order

```typescript
// 1. External packages
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal packages (@tungaos/shared)
import type { ApiResponse } from '@tungaos/shared/types';

// 3. Absolute imports (@/)
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

// 4. Relative imports
import { BookingCard } from './booking-card';

// 5. Type-only imports (if not inline)
import type { BookingFilters } from './types';
```

### 15.4 Error Handling

**Frontend:**
- React Query `onError` → toast notification
- Form errors → inline field validation
- Global error boundary for unhandled exceptions

**Backend:**
- Domain exceptions → HTTP exceptions via filter
- Prisma errors → mapped to user-friendly messages
- All errors logged with correlation ID
- Never expose stack traces in production

### 15.5 Testing Standards

| Layer | Tool | Coverage Target |
|-------|------|----------------|
| Backend unit | Jest | 80% services |
| Backend e2e | Jest + Supertest | Critical paths |
| Frontend unit | Vitest (future) | 70% hooks/utils |
| Frontend e2e | Playwright (future) | Critical user flows |

### 15.6 Code Review Checklist

- [ ] No `any` types
- [ ] All queries filter by `hotel_id`
- [ ] No secrets in code
- [ ] Error cases handled
- [ ] Responsive design verified
- [ ] Accessibility basics (labels, focus, contrast)
- [ ] No console.log in production code
- [ ] Types exported, not inferred

---

## 16. Naming Conventions

### 16.1 Files & Folders

| Entity | Convention | Example |
|--------|-----------|---------|
| React component | `PascalCase.tsx` | `BookingWidget.tsx` |
| Hook | `use-kebab-case.ts` | `use-bookings.ts` |
| Service | `kebab-case.service.ts` | `booking.service.ts` |
| Store | `kebab-case.store.ts` | `auth.store.ts` |
| Type file | `kebab-case.types.ts` | `booking.types.ts` |
| Utility | `kebab-case.utils.ts` | `date.utils.ts` |
| Constant | `kebab-case.ts` | `routes.ts`, `permissions.ts` |
| NestJS controller | `kebab-case.controller.ts` | `booking.controller.ts` |
| NestJS module | `kebab-case.module.ts` | `booking.module.ts` |
| DTO | `kebab-case.dto.ts` | `create-booking.dto.ts` |
| Entity | `kebab-case.entity.ts` | `booking.entity.ts` |
| Repository | `kebab-case.repository.ts` | `booking.repository.ts` |
| Guard | `kebab-case.guard.ts` | `tenant.guard.ts` |
| Test | `*.spec.ts` / `*.test.ts` | `booking.service.spec.ts` |
| Folder | `kebab-case` | `front-desk/`, `room-service/` |

### 16.2 Code Identifiers

| Entity | Convention | Example |
|--------|-----------|---------|
| Variable | camelCase | `hotelId`, `checkInDate` |
| Constant | SCREAMING_SNAKE | `MAX_GUESTS`, `DEFAULT_PAGE_SIZE` |
| Function | camelCase | `calculateTotalPages()` |
| Class | PascalCase | `BookingService` |
| Interface | PascalCase (no I prefix) | `BookingRepository` |
| Type alias | PascalCase | `HotelId`, `BookingStatus` |
| Enum | PascalCase | `Role`, `Permission` |
| Enum member | PascalCase | `Role.SuperAdmin` |
| React component | PascalCase | `BookingWidget` |
| Custom hook | use + PascalCase | `useBookings()` |
| CSS class | kebab-case (Tailwind) | `text-tunga-navy` |
| Env variable | SCREAMING_SNAKE | `DATABASE_URL` |
| API endpoint | kebab-case | `/api/v1/room-types` |
| Database table | snake_case | `booking_items` |
| Database column | snake_case | `hotel_id`, `created_at` |

### 16.3 API Naming

| Pattern | Example |
|---------|---------|
| Resource collection | `GET /api/v1/bookings` |
| Single resource | `GET /api/v1/bookings/:id` |
| Nested resource | `GET /api/v1/bookings/:id/payments` |
| Action endpoint | `POST /api/v1/bookings/:id/cancel` |
| Query params | `?page=1&limit=20&sortBy=createdAt&sortOrder=desc` |

---

## 17. Scalability & Future Growth

### 17.1 Modular Monolith → Microservices Path

The current architecture is a **modular monolith** — one deployable unit with strict module boundaries. When scale demands it, modules can be extracted:

```
Phase 1 (Now):     Modular Monolith
                    └── apps/api (all modules)

Phase 2 (Scale):   Selective Extraction
                    ├── apps/api (core: auth, tenant, hotel)
                    ├── services/booking-service
                    ├── services/pos-service
                    └── services/notification-service

Phase 3 (Enterprise): Full Microservices
                    ├── API Gateway (Kong / AWS API Gateway)
                    ├── Service mesh
                    └── Event-driven communication (Kafka/RabbitMQ)
```

**Extraction criteria:**
- Module has independent scaling needs (POS during peak hours)
- Module needs different deployment cadence
- Team ownership boundaries align with module boundaries

### 17.2 Database Scaling Strategy

| Phase | Strategy |
|-------|----------|
| 1–100 hotels | Single PostgreSQL instance, connection pooling (PgBouncer) |
| 100–1000 hotels | Read replicas, query optimization, Redis caching layer |
| 1000+ hotels | Consider schema-per-tenant or database-per-tenant for enterprise clients |
| Always | Every query includes `hotel_id` — enables row-level security and future sharding |

### 17.3 Multi-Tenancy Scaling

| Strategy | When | Implementation |
|----------|------|----------------|
| Shared DB, shared schema | Phase 1 (now) | `hotel_id` column on every table |
| Shared DB, schema per tenant | Enterprise tier | PostgreSQL schemas |
| Database per tenant | Large enterprise | Dedicated RDS instance |

### 17.4 Module Rollout Roadmap

```
Phase 1 — Foundation (Current)
  ├── Architecture scaffolding
  ├── Auth + Tenant + User + Role
  └── Hotel Website + Booking Engine

Phase 2 — Core Operations
  ├── PMS + Front Desk
  ├── Housekeeping
  └── Restaurant POS

Phase 3 — Back Office
  ├── Inventory + Purchase + Vendors
  ├── Finance + HRMS
  └── Maintenance

Phase 4 — Growth
  ├── CRM + Corporate Portal
  ├── QR Room Service
  ├── Reports + Owner Dashboard
  └── Investor Dashboard

Phase 5 — Intelligence
  ├── AI Analytics
  ├── Integrations marketplace
  └── Mobile Applications
```

### 17.5 Performance Targets

| Metric | Target |
|--------|--------|
| API response (p95) | < 200ms |
| Page load (LCP) | < 2.5s |
| Time to Interactive | < 3.5s |
| Lighthouse score | > 90 |
| Uptime SLA | 99.9% |
| Concurrent users per hotel | 500+ |

### 17.6 Observability (Future)

| Concern | Tool |
|---------|------|
| Logging | Structured JSON → CloudWatch / Datadog |
| Metrics | Prometheus + Grafana |
| Tracing | OpenTelemetry |
| Error tracking | Sentry |
| Uptime monitoring | Better Uptime / Pingdom |

---

## 18. Role-Based Access Control Architecture

### 18.1 Permission Model

TungaOS uses **RBAC with fine-grained permissions**:

```
User → has many → Roles → have many → Permissions
                         ↓
                    scoped by hotel_id
```

### 18.2 Permission Key Format

```
<module>:<resource>:<action>

Examples:
  booking:reservation:create
  booking:reservation:cancel
  pms:room:update-status
  pms:room:view
  finance:invoice:approve
  hrms:employee:view-salary
  admin:hotel:create
  admin:user:assign-role
```

### 18.3 Role-Permission Matrix (Template)

| Permission | Super Admin | Owner | GM | Receptionist | HK | Finance |
|------------|:-----------:|:-----:|:--:|:----------:|:--:|:-------:|
| `admin:hotel:create` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `booking:*` | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `pms:room:update-status` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| `finance:invoice:*` | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| `hrms:employee:view-salary` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

`*` = all actions on that resource.

### 18.4 Implementation Points

| Layer | Component | Responsibility |
|-------|-----------|---------------|
| Backend | `@Permissions()` decorator | Declares required permissions on endpoints |
| Backend | `PermissionsGuard` | Validates JWT permissions array |
| Backend | `RolesGuard` | Validates JWT roles array |
| Frontend | `usePermission()` hook | Conditional UI rendering |
| Frontend | `<PermissionGate>` component | Hides UI elements user can't access |
| Shared | `permissions.ts` | Permission key constants |

**Important:** Frontend permission checks are for UX only. Backend guards are authoritative.

---

## 19. Multi-Tenancy Deep Dive

### 19.1 Tenant Resolution

```
Request arrives
  │
  ├── Subdomain mode: tunga-international.tungaos.com
  │     └── Extract slug → lookup hotel_id
  │
  ├── Path mode: tungaos.com/hotels/tunga-international
  │     └── Extract slug from path → lookup hotel_id
  │
  └── Header mode: x-hotel-id (API calls from dashboard)
        └── Direct hotel_id (validated against user access)
```

### 19.2 Data Isolation Rules

1. **Every tenant-scoped table** has a `hotel_id` column (UUID, NOT NULL, indexed)
2. **Every repository method** accepts `hotelId` as first parameter
3. **Every Prisma query** includes `where: { hotelId }` — enforced by base repository
4. **TenantGuard** validates the requesting user belongs to the requested hotel
5. **Super Admin** bypasses tenant filter but actions are audit-logged
6. **No cross-tenant joins** — ever

### 19.3 Tenant Configuration

Each hotel stores its own:

| Setting | Storage |
|---------|---------|
| Logo | S3 → CloudFront URL |
| Primary/secondary colors | `hotels` table |
| Fonts | `hotels` table |
| Tax configuration | `hotel_tax_settings` table |
| Payment gateway keys | Encrypted in `hotel_payment_settings` |
| Enabled modules | `hotel_modules` junction table |
| Custom domain | `hotel_domains` table |
| Email templates | `hotel_email_templates` table |
| WhatsApp number | `hotel_settings` table |

### 19.4 Tenant-Aware Caching

```
Cache key format: tungaos:<hotel_id>:<module>:<resource>:<identifier>

Examples:
  tungaos:abc-123:booking:availability:2026-06-30
  tungaos:abc-123:tenant:branding
  tungaos:abc-123:pms:room-status
```

Cache invalidation is scoped to the tenant — one hotel's update never invalidates another's cache.

---

## 20. Appendix: Architecture Decision Records

### ADR-001: Monorepo with pnpm + Turborepo

**Status:** Accepted  
**Context:** Need shared types between frontend and backend with unified tooling.  
**Decision:** pnpm workspaces with Turborepo for build orchestration.  
**Consequences:** Single repo, atomic cross-package changes, shared CI. Slightly larger clone size.

### ADR-002: Modular Monolith over Microservices

**Status:** Accepted  
**Context:** Early-stage product with small team, many modules planned.  
**Decision:** Single NestJS deployable with strict module boundaries.  
**Consequences:** Simpler ops today. Modules can be extracted later without rewrite.

### ADR-003: Shared Database with hotel_id Column

**Status:** Accepted  
**Context:** Need multi-tenancy from day one with cost efficiency.  
**Decision:** Single PostgreSQL database, shared schema, `hotel_id` on every tenant table.  
**Consequences:** Simplest ops. Requires strict query discipline. Schema-per-tenant available for enterprise tier later.

### ADR-004: HttpOnly Cookie Auth over localStorage JWT

**Status:** Accepted  
**Context:** Security requirement for enterprise hospitality data.  
**Decision:** JWT in HttpOnly cookies with refresh token rotation in Redis.  
**Consequences:** XSS-resistant. Requires CSRF protection. Slightly more complex refresh flow.

### ADR-005: Next.js App Router with Route Groups

**Status:** Accepted  
**Context:** Need distinct layouts for public website, dashboard, auth, and portals.  
**Decision:** Route groups `(public)`, `(dashboard)`, `(auth)`, `(portal)` with separate layouts.  
**Consequences:** Clean layout separation. No URL pollution from group names.

### ADR-006: Shadcn UI over Material UI / Ant Design

**Status:** Accepted  
**Context:** Need full design control for luxury hotel branding with tenant theming.  
**Decision:** Shadcn UI (copy-paste components) with Tailwind CSS variables.  
**Consequences:** Full ownership of component code. Manual updates for Shadcn releases.

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1.0 | 2026-06-29 | Solution Architecture Team | Initial foundation document |

---

*This document is maintained in `docs/ARCHITECTURE.md` and updated with each architectural decision.*
