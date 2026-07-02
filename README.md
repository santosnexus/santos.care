# Heal India Medi Tourism

Two apps for the medical tourism business of Santos King Tours & Travels Pvt. Ltd.:

1. **`public-site/`** — Patient-facing marketing site
   - **Production:** https://santos-care-web.vercel.app
   - **Future domain:** santos.care
2. **`santocare-ops/`** — Internal operations dashboard
   - **Production:** https://santos-care.vercel.app
   - **Future domain:** ops.santos.care

**GitHub:** https://github.com/santosnexus/santos.care
**Vercel team:** santos-nexus

---

## Quick Start

### 1. Public website (santos.care)

```bash
cd public-site
npm install
cp .env.example .env.local
npm run dev   # http://localhost:3000
```

### 2. Operations Hub (ops.santos.care)

```bash
cd santocare-ops
npm install
cp .env.example .env
npm run dev   # http://localhost:3001
```

The Ops Hub starts in **mock mode** by default (no DATABASE_URL required). All data is in-memory and resets on restart.

To use the seeded demo credentials, log in at `/login`:
- Email: `admin@santos.care`
- Password: `demo`

Or use Basic Auth (legacy): `santos` / `He@lInd!a2026`

---

## Architecture

```
santos.care
├── public-site/            # Next.js 14 — Patient-facing website
│   ├── src/app/            # 8 page routes (homepage, treatments, countries, blog, etc.)
│   ├── src/components/     # Navbar, Footer, LeadForm, WhatsAppButton
│   ├── src/data/           # treatments, countries, blog-posts, hospitals, faqs
│   └── src/lib/            # utils (whatsapp, formatCurrency)
│
└── santocare-ops/          # Next.js 14 — Internal operations dashboard
    ├── prisma/
    │   ├── schema.prisma   # 11 entities (User, Patient, Lead, Partner, Task, etc.)
    │   └── seed.ts         # Populate database with demo data
    ├── src/app/api/        # REST API (patients, leads, partners, tasks, documents, auth)
    ├── src/app/(auth)/     # Login page
    ├── src/app/(dashboard)/# 9 modules (Dashboard, Patients, Tasks, etc.)
    ├── src/lib/            # db, auth, utils, data
    └── src/middleware.ts   # Auth (Basic + Session cookies)
```

---

## Public Site Features

- **Homepage** — Hero, treatments grid, partner hospitals, testimonials, lead form
- **Treatment pages** — 8 treatments with procedure lists, cost comparisons, FAQs
- **Country pages** — 6 target markets with localized challenges and benefits
- **Blog** — 10 SEO-optimized articles (5 generic + 5 region-specific)
- **Lead capture** — Form submits to Ops Hub API; falls back to WhatsApp on error
- **SEO** — Metadata, OpenGraph, sitemap.xml, robots.txt
- **Mobile-responsive** — Built mobile-first with Tailwind CSS
- **WhatsApp integration** — Floating button + context-aware links

---

## Ops Hub Features

- **Dashboard** — Pipeline overview, KPIs, recent activity
- **Patients** — 10-stage pipeline from Inquiry to Closed
- **Leads** — Track marketing leads with UTM attribution
- **Partners** — Hospitals, Ayurveda, labs, transport, etc.
- **Tasks** — Per-user task management with priorities
- **Documents** — File library with patient/partner linking
- **Marketing** — Campaign tracking, conversion analytics
- **Analytics** — Pipeline funnel, revenue, country breakdown
- **Roadmap** — Phase tracking (Phase 1 complete, Phase 2 in progress)
- **Settings** — User management, integrations

### Authentication (new in 2026)

The Ops Hub supports **two authentication methods** simultaneously:

1. **Basic Auth** (legacy) — username `santos`, password `He@lInd!a2026`
2. **Session-based Auth** (new) — Login at `/login` with user credentials

Session auth uses JWT tokens in HTTP-only cookies, 24-hour expiry. The system gracefully falls back to Basic Auth if no session cookie is present.

---

## Connecting to Supabase (Real Database)

The Ops Hub uses a **graceful fallback** design. By default it runs in mock mode (in-memory data). To switch to a real Supabase database:

### 1. Create a Supabase project
- Go to [supabase.com](https://supabase.com) and create a new project
- Wait for the project to provision (~2 minutes)
- Go to **Settings → Database** and copy the **Connection string** (Transaction pooler)

### 2. Configure environment
In `santocare-ops/.env`:
```bash
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
NEXTAUTH_SECRET="<generate with: openssl rand -base64 32>"
```

### 3. Apply schema
```bash
cd santocare-ops
npx prisma db push         # Creates all tables
npx prisma db seed         # Populates with demo data
```

### 4. Verify
Visit `/api/health` — should return `{"database":"connected","mode":"production"}`

---

## Connecting the Public Site to Ops Hub

The public site's lead form automatically POSTs to the Ops Hub's `/api/leads/capture` endpoint. To configure the URL:

In `public-site/.env.local`:
```bash
NEXT_PUBLIC_OPS_HUB_URL="https://ops.santos.care"
```

The lead form gracefully falls back to opening WhatsApp if the Ops Hub is unreachable.

---

## Deployment

This is a **monorepo**. Both apps deploy from the repo root using Vercel project root directory settings.

### Vercel Project Mapping

| Vercel Project | Root Directory | URL |
|---|---|---|
| `santos-care` | `santocare-ops/` | https://santos-care.vercel.app |
| `santos-care-web` | `public-site/` | https://santos-care-web.vercel.app |

### Deploying from CLI

From the monorepo root, deploy each app by temporarily swapping `.vercel/project.json`:

```bash
# Deploy Ops Hub
echo '{"projectId":"prj_cE1lWoekWzHmTH9VEPP5Pz1u6gfy","orgId":"team_2ExKs46V2Ql6JOATzbWfYLlv","projectName":"santos-care"}' > .vercel/project.json
npx vercel --prod

# Deploy Public Site
echo '{"projectId":"prj_AH5bIbLIyxf1lmAomgFAcg43LvVI","orgId":"team_2ExKs46V2Ql6JOATzbWfYLlv","projectName":"santos-care-web"}' > .vercel/project.json
npx vercel --prod

# Clean up
rm -rf .vercel
```

Alternatively, GitHub pushes auto-deploy via Vercel's GitHub integration.

### Environment Variables (Vercel)

**santos-care (Ops Hub):**
- `DATABASE_URL` — Supabase pooler connection
- `DIRECT_URL` — Supabase direct connection
- `NEXTAUTH_SECRET` — JWT signing secret
- `NEXTAUTH_URL` — `https://santos-care.vercel.app`
- `OPS_AUTH_USER` — `santos`
- `OPS_AUTH_PASS` — `He@lInd!a2026`

**santos-care-web (Public Site):**
- `NEXT_PUBLIC_OPS_HUB_URL` — `https://santos-care.vercel.app`
- `NEXT_PUBLIC_SITE_URL` — `https://santos-care-web.vercel.app`

### Custom Domains (to configure)

| Domain | Vercel Project |
|---|---|
| `santos.care` | `santos-care-web` |
| `ops.santos.care` | `santos-care` |

---

## Database Schema (Prisma)

21 tables with full relational integrity across 20 Prisma models + 1 implicit many-to-many:

- **User** — Team members with role-based access (ADMIN, MANAGER, COORDINATOR, MARKETING, STAKEHOLDER)
- **Patient** — Patient records with 10-stage pipeline tracking
- **StageChange** — Audit trail of pipeline transitions
- **Task** — Tasks linked to patients, with priority and recurrence
- **Partner** — Hospitals, Ayurveda, labs, transport, nursing, equipment
- **Lead** — Marketing leads with UTM attribution
- **Document** — File library linked to patients/partners
- **Note** — Free-form notes on patients/partners
- **Communication** — WhatsApp/email/call log
- **RoadmapItem** — Phase tracking
- **AnalyticsEvent** — Custom analytics

---

## NPM Scripts

### Public site
| Script | Purpose |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run lint` | Lint code |

### Ops Hub
| Script | Purpose |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:seed` | Seed database with demo data |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |

---

## Tech Stack

- **Framework:** Next.js 14.2 (App Router)
- **Language:** TypeScript 5.5
- **Styling:** Tailwind CSS 3.4
- **Database:** PostgreSQL via Supabase (with Prisma 5.18)
- **Auth:** JWT in HTTP-only cookies (jose library) + bcryptjs
- **Icons:** lucide-react
- **Charts:** recharts
- **Deployment:** Vercel

---

## License

Proprietary — © Santos King Tours & Travels Pvt. Ltd.
