# ADR-001: Monorepo with pnpm Workspaces and Turborepo

**Date:** 2026-06-29  
**Status:** Accepted  

## Context

TungaOS has a Next.js frontend and NestJS backend that share TypeScript types, validation schemas, and constants. We need a strategy that enables atomic cross-boundary changes without publishing internal packages to npm.

## Decision

Use a pnpm workspace monorepo orchestrated by Turborepo:

- `apps/web` — Next.js frontend
- `apps/api` — NestJS backend
- `packages/shared` — Cross-platform library
- `packages/eslint-config` — Shared lint rules
- `packages/typescript-config` — Shared TS configs

## Consequences

**Positive:**
- Single `git clone`, unified CI/CD
- Type-safe API contracts via `@tungaos/shared`
- Turborepo caching speeds up incremental builds

**Negative:**
- Larger repository size
- All developers need to understand monorepo conventions

## Alternatives Considered

1. **Separate repos** — Rejected: type sharing requires npm publishing or git submodules
2. **Nx monorepo** — Rejected: heavier tooling for our team size; Turborepo is sufficient
