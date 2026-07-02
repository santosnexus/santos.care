# Build Log

> Development progress and milestone tracking for SantoCare Operations Hub

## Project Information

- **Project:** SantoCare Operations Hub
- **Parent:** Heal India Medi Tourism (santos.care)
- **Company:** Santos King Tours & Travels Pvt. Ltd.
- **Started:** June 29, 2026
- **Status:** Deployed (mock data) — active development
- **Current Version:** 0.1.0 (Phase 1)
- **Live URL:** https://santocare-ops.vercel.app
- **Protection:** HTTP Basic Auth (env: `OPS_AUTH_USER` / `OPS_AUTH_PASS`)

---

## Phase 1: Foundation — COMPLETE

### Duration: June 29, 2026 (Single Day)

### Deployed: June 30, 2026

- **Platform:** Vercel (Hobby plan, region iad1)
- **URL:** https://santocare-ops.vercel.app
- **Build:** 9 static pages + 10 serverless API routes
- **Auth:** Middleware-based HTTP Basic Auth (Pro-only Vercel Password Protection is unavailable on Hobby)
- **Credentials:** `santos` / `He@lInd!a2026` (set `OPS_AUTH_USER` / `OPS_AUTH_PASS` in Vercel env to override)
- **Note:** All data is in-memory mock. Cold starts reset the in-memory arrays, so any "saved" data won't survive between requests across different serverless invocations.

### Achievements

#### Project Setup
- [x] Next.js 14.2.5 project scaffolding
- [x] TypeScript configuration
- [x] Tailwind CSS 3.4 with custom design tokens
- [x] shadcn-style component library
- [x] Route groups for (dashboard) and (auth)
- [x] Prisma schema designed (12 entities)
- [x] Database configuration (Supabase ready)

#### UI Component Library (14 components)
- [x] Button (with cva variants)
- [x] Card (with subcomponents)
- [x] Badge (with status variants)
- [x] Input, Label, Textarea
- [x] Select (custom dropdown)
- [x] Dialog (modal overlay)
- [x] Tabs (with context)
- [x] Table (with subcomponents)
- [x] Avatar (with fallback)
- [x] Progress (linear bar)
- [x] Skeleton (loading state)

#### Layout & Navigation
- [x] Root layout with Inter font
- [x] Dashboard layout with sidebar
- [x] Mobile-responsive sidebar with overlay
- [x] Mobile header with menu toggle
- [x] 9 main navigation routes

#### Dashboard Pages (9 modules)
- [x] **Dashboard Home** — KPIs, revenue chart, pipeline, recent activity
- [x] **Patients** — Kanban + Table views, add/edit modals
- [x] **Tasks** — Active/Completed tabs, filters, priorities
- [x] **Partners** — 6 categories, MOUs, stats
- [x] **Marketing** — Leads, Campaigns, Content tabs
- [x] **Documents** — Searchable repository
- [x] **Analytics** — Revenue, conversion, performance
- [x] **90-Day Roadmap** — 4 phases, milestone tracking
- [x] **Settings** — Users, integrations, backup

#### API Routes (5 resources, 10 endpoints)
- [x] `GET/POST /api/patients`
- [x] `GET/PUT/DELETE /api/patients/[id]`
- [x] `GET/POST /api/tasks`
- [x] `GET/PUT/DELETE /api/tasks/[id]`
- [x] `GET/POST /api/partners`
- [x] `GET/PUT/DELETE /api/partners/[id]`
- [x] `GET/POST /api/leads`
- [x] `GET/PUT/DELETE /api/leads/[id]`
- [x] `GET/POST /api/documents`
- [x] `GET/DELETE /api/documents/[id]`

#### Data & Mock Content
- [x] 10 mock patients with full pipeline data
- [x] 8 mock tasks across all types
- [x] 8 mock partners (Aster, Amrita, Rajagiri, Ayush Prana, etc.)
- [x] 6 mock leads from various sources
- [x] 3 marketing campaigns
- [x] 4 content calendar items
- [x] 8 documents in repository
- [x] 5 team members

#### Documentation
- [x] README.md (project overview)
- [x] INSTALLATION.md (setup guide)
- [x] ARCHITECTURE.md (technical design)
- [x] USER_GUIDE.md (end-user manual)
- [x] API_DOCUMENTATION.md (API reference)
- [x] BUILD_LOG.md (this file)

### Files Created

```
Total: 38 files
├── Configuration: 5
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── postcss.config.mjs
│   ├── tsconfig.json
│   └── next.config.ts
├── Pages: 11
│   ├── (dashboard)/layout.tsx
│   ├── (dashboard)/page.tsx (home)
│   ├── (dashboard)/patients/page.tsx
│   ├── (dashboard)/tasks/page.tsx
│   ├── (dashboard)/partners/page.tsx
│   ├── (dashboard)/marketing/page.tsx
│   ├── (dashboard)/documents/page.tsx
│   ├── (dashboard)/analytics/page.tsx
│   ├── (dashboard)/roadmap/page.tsx
│   ├── (dashboard)/settings/page.tsx
│   └── layout.tsx (root)
├── API Routes: 10
├── Components: 15
│   ├── UI: 14
│   └── Layout: 1
├── Libraries: 2
│   ├── utils.ts
│   └── db.ts
├── Types: 1
├── Prisma: 1
├── Styles: 1
└── Documentation: 6
```

### Lines of Code

- Total TypeScript/TSX: ~6,000 lines
- Documentation: ~3,500 lines (markdown)
- Mock data: ~1,500 lines

---

## Phase 2: Operations — IN PROGRESS

### Target: Weeks 5-8

### Pending Tasks

#### Real Database Integration
- [ ] Set up Supabase project
- [ ] Apply Prisma schema
- [ ] Connect API routes to Prisma
- [ ] Replace mock data with real queries
- [ ] Add data validation with zod

#### Authentication
- [ ] Set up NextAuth.js
- [ ] Configure credentials provider
- [ ] Add login/logout flows
- [ ] Implement session management
- [ ] Role-based access control

#### File Upload
- [ ] Configure Supabase Storage
- [ ] Document upload component
- [ ] File preview
- [ ] Image handling

#### Real-time Updates
- [ ] Supabase subscriptions
- [ ] Live pipeline updates
- [ ] Task notifications
- [ ] Patient stage change webhooks

---

## Phase 3: Marketing — PENDING

### Target: Weeks 9-12

### Planned Features

#### Lead Capture
- [ ] Website contact form integration
- [ ] WhatsApp Business API integration
- [ ] Auto-categorization of leads
- [ ] Lead scoring algorithm

#### Campaign Management
- [ ] Facebook Ads API integration
- [ ] Google Ads API integration
- [ ] Budget tracking automation
- [ ] ROI dashboards

#### Content Calendar
- [ ] Blog post scheduling
- [ ] Social media auto-posting
- [ ] Content approval workflow
- [ ] SEO rank tracking

---

## Phase 4: Analytics — PENDING

### Target: Weeks 13+

### Planned Features

#### Stakeholder Portal
- [ ] Public read-only dashboard
- [ ] Executive summary reports
- [ ] Monthly PDF reports
- [ ] Email digests

#### Advanced Analytics
- [ ] Cohort analysis
- [ ] Customer lifetime value
- [ ] Predictive analytics
- [ ] Custom report builder

#### Mobile Optimization
- [ ] Native mobile app (React Native)
- [ ] Push notifications
- [ ] Offline mode
- [ ] Mobile-specific UI

---

## Decision Log

### Architectural Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-29 | Use Next.js 14 App Router | Modern routing, server components, API routes |
| 2026-06-29 | Mock data first | Faster prototyping, demo-ready, easier testing |
| 2026-06-29 | Custom shadcn-style components | No external dependency, full control |
| 2026-06-29 | Recharts for visualizations | Declarative, React-friendly, good defaults |
| 2026-06-29 | PostgreSQL via Supabase | ACID, real-time, generous free tier |
| 2026-06-29 | Prisma ORM | Type safety, migrations, query building |
| 2026-06-29 | Tailwind 3.4 over 4.0 | Stability, ecosystem compatibility |
| 2026-06-29 | Vercel hosting | Zero-config Next.js, edge functions |

### Scope Decisions

| Decision | Why |
|----------|-----|
| Internal-only (no patient portal) | Focus on team efficiency, patient data sensitivity |
| 9 main modules | Balance between comprehensive and not overwhelming |
| Mock data initially | Allows full UI/UX validation before database work |
| No mobile app yet | Web responsive is sufficient for v1 |
| Single-tenant | No multi-organization complexity yet |

---

## Known Issues & Limitations

### Current Limitations

1. **Mock Data** — All data is in-memory, not persisted
2. **No Authentication** — Open access (development only)
3. **No Real-time** — Updates require page refresh
4. **No File Upload** — Documents are listed, not uploaded
5. **No Email/WhatsApp Integration** — Manual processes
6. **Static API Responses** — Routes return mock data, not from DB

### Future Bugs / Tech Debt

- API routes use `Promise<{ id: string }>` for params (Next.js 15 compatibility) — verify when upgrading
- Mobile sidebar auto-closes on route change but not on outside click
- Form validation is HTML5 only (no client-side zod)
- Charts have no data fetching optimization

---

## Resources

### Documentation
- [README.md](./README.md)
- [INSTALLATION.md](./INSTALLATION.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [USER_GUIDE.md](./USER_GUIDE.md)
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### External References
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Prisma](https://www.prisma.io/docs)
- [Recharts](https://recharts.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/docs)

### Related Project Files
- `/mnt/d/santos.care/Medical_Tourism_Feasibility_Study.md`
- `/mnt/d/santos.care/operations/*.md`
- `/mnt/d/santos.care/santos-care-marketing-plan.md`

---

## Build Statistics

### Time Investment
- Phase 1 (Foundation): ~6 hours of focused development
- Documentation: ~2 hours
- Total to MVP: ~8 hours

### Complexity Metrics
- Total source files: 38
- Total lines of code: ~6,000
- Components: 15
- API endpoints: 10
- Pages: 10

---

**Last Updated:** June 29, 2026
**Build Status:** Phase 1 Complete, Phase 2 Pending
