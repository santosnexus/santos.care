# Santos Care — Agent Instructions

## Project
Medical Tourism CRM+ERP monorepo. Two Next.js 14 apps: `public-site/` (patient marketing) and `santocare-ops/` (ops dashboard). PostgreSQL on Supabase via Prisma.

## Key Constraints
- NEVER commit hardcoded credentials or secrets
- Always scope DB queries by `tenantId`
- Run `npm run typecheck` and `npm run test` after every change
- Both apps must build successfully before commit

## Critical Unfixed Issues
- Build hangs (needs `output: "standalone"` fix)
- JWT fallback secret `"fallback-dev-secret-change-in-production-please"` in source
- Production password `He@lInd!a2026` in 7+ source files
- Prisma seed lacks Tenant record and tenantId on mock objects
- 12/28 API routes have zero auth

## Commands
```bash
npm run dev:public     # Public site on :3000
npm run dev:ops        # Ops hub on :3000
npm run typecheck      # TypeScript check both apps
npm run test           # Run vitest in santocare-ops
npm run build:ops      # Build ops hub
npm run db:push        # Push Prisma schema
npm run db:seed        # Seed demo data
```

## Architecture
- Public site → lead form POSTs to ops hub `/api/leads/capture`
- Ops hub runs mock mode (in-memory) if no DATABASE_URL
- Auth: JWT in HTTP-only cookie (`sc-ops-session`) + Basic Auth fallback
- Multi-tenant via `tenantId` column on every table (shared DB/shared schema)

## Files to Read First
- `README.md` — project overview
- `ROADMAP.md` — full 5-phase plan (815 lines)
- `AUDIT_REPORT.md` — security/architecture issues
- `STRATEGIC_CONTEXT.md` — competitive analysis, marketing, ops strategy
- `santocare-ops/prisma/schema.prisma` — DB schema (21 tables)
- `santocare-ops/src/lib/auth.ts` — auth implementation
- `santocare-ops/src/middleware.ts` — auth/cors middleware

## MCP Servers Active
- Context7 (library docs)
- PostgreSQL (schema/query)
- GitHub (PRs/issues)
- Filesystem (built-in)
