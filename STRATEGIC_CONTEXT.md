# Santos Care — Strategic Context & Development Plan

> **Project:** Heal India Medi Tourism — Medical Tourism CRM+ERP
> **Company:** Santos King Tours & Travels Pvt. Ltd.
> **Current Domain:** santos.care
> **GitHub:** github.com/santosnexus/santos.care
> **Date:** July 3, 2026

---

## 1. Project Summary

A unified medical tourism CRM+ERP platform with two Next.js 14 apps in a monorepo:

| App | Purpose | URL |
|-----|---------|-----|
| `public-site/` | Patient-facing marketing site | santos.care |
| `santocare-ops/` | Internal ops dashboard (CRM+ERP) | ops.santos.care |

**Stack:** Next.js 14 (App Router) + TypeScript + Prisma + PostgreSQL (Supabase) + Tailwind CSS + shadcn/ui

**What's built (Phase 0 ✅):** Public site (24 routes), Ops Hub (12 dashboard modules, 13 API route groups, 21 DB tables), lead capture, auth (JWT + Basic Auth), deployment to Vercel.

**What's planned (Phases 0.5→5):** Quick wins (real auth, leads UI, file upload), multi-tenancy, RBAC, invoicing/quotes, comms/inbox, visa/accommodation/transport, calendar, patient portal, hospital partner portal, SaaS billing.

---

## 2. Critical Issues to Fix First

From AUDIT_REPORT.md (these block everything else):

| Priority | Issue | Fix |
|----------|-------|-----|
| 🔴 | Build hangs (`npm run build`) | Add `output: "standalone"` or `experimental.outputFileTracingExcludes` |
| 🔴 | Production password committed | Rotate `He@lInd!a2026`, move to env vars, .gitignore .env.example |
| 🔴 | JWT fallback secret in source | Enforce `NEXTAUTH_SECRET` env var at startup |
| 🔴 | Prisma seed missing tenantId | Create Tenant record in seed, add tenantId to all mock objects |
| 🟠 | 12/28 API routes have no auth | Add middleware auth check or per-route guard |
| 🟠 | No CORS on ops hub | Add CORS headers to middleware for public-site domain |
| 🟠 | No tests | Write test suite (already started with 2 service tests) |
| 🟠 | Hardcoded Basic Auth in client components | Remove from client components, use session auth only |

---

## 3. AI Coding Toolchain

### 3.1 Recommended MCP Servers for This Project

| MCP Server | Purpose | Install |
|------------|---------|---------|
| **Context7** | Live docs for libraries (Next.js, Prisma, Tailwind) | `npx @context7/mcp` |
| **PostgreSQL MCP** | Database schema inspection, querying | `npx @modelcontextprotocol/server-postgres` |
| **GitHub MCP** | PRs, issues, code search | `npx @modelcontextprotocol/server-github` |
| **Filesystem MCP** | File read/write (built into OpenCode) | Included by default |
| **Sequential Thinking** | Structured reasoning for complex decisions | `npx @modelcontextprotocol/server-sequential-thinking` |
| **Sentry MCP** | Debug production errors | `npx @getsentry/mcp` |
| **Stripe MCP** | Payment operations (Phase 1+) | `npx @stripe/mcp` |
| **Brave Search** | Web search from the agent | `npx @anthropic/server-brave-search` |

### 3.2 OpenCode Setup

OpenCode is the AI coding agent already in use. Configuration at `~/.config/opencode/opencode.json`:

```json
{
  "mcp": {
    "context7": {
      "type": "local",
      "command": ["npx", "-y", "@context7/mcp"]
    },
    "postgres": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-postgres", "postgresql://..."],
      "environment": {
        "PG_READ_ONLY": "true"
      }
    },
    "github": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-github"],
      "environment": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Key OpenCode features for this project:**
- **Agents:** Create specialized agents (`medical tourism dev`, `ops specialist`, `marketing writer`)
- **Skills:** Reusable skill files for common tasks (e.g., `medical-tourism-ops.md`)
- **LSP support:** Real-time type checking as you code
- **Custom instructions:** Per-project rules in `AGENTS.md` (already exists)

### 3.3 Obsidian + AI Workflow

Obsidian as the knowledge hub for the project:

| Plugin | Purpose |
|--------|---------|
| **Smart Connections** | Semantic search across vault — find related notes by meaning |
| **Obsidian Local REST API** | Expose vault to MCP clients |
| **mcp-obsidian** | Connect vault to OpenCode/Claude Code via MCP |
| **Text Generator** | AI inline completion inside notes |
| **Templater** | Templates for ADRs, meeting notes, specs |
| **Dataview** | Query notes like a database (status, tags, dates) |
| **Tasks** | Task management inside vault |
| **Kanban** | Visual project boards |
| **Excalidraw** | Diagrams and architecture sketches |

**Obsidian MCP Setup** (connect vault to OpenCode):
1. Install Obsidian Local REST API plugin → generates API key
2. Run `npx mcp-obsidian --port 27124 --apikey YOUR_KEY`
3. Add to OpenCode config → agent can read/write vault notes

**Recommended vault structure:**
```
santos.care/
├── 1-Project/
│   ├── Vision & Mission
│   ├── Architecture Decisions (ADRs)
│   ├── Meeting Notes
│   └── Competitor Analysis
├── 2-Development/
│   ├── Phase-0-Foundation/
│   ├── Phase-0.5-Quick-Wins/
│   ├── Phase-1-Communication/
│   └── TDD-Test-Plans/
├── 3-Operations/
│   ├── Hospital-Onboarding/
│   ├── SOPs/
│   ├── Email-Templates/
│   └── Training/
├── 4-Marketing/
│   ├── Content-Calendar/
│   ├── SEO-Strategy/
│   ├── Ad-Campaigns/
│   └── Brand-Guidelines/
└── 5-Research/
    ├── Industry-Reports/
    ├── Competitor-Monitoring/
    └── Regulatory/
```

---

## 4. Competitor Landscape

### 4.1 Direct Medical Tourism Software Competitors

| Product | Type | Key Features | Weaknesses |
|---------|------|-------------|------------|
| **PlacidWay** | Marketplace + CRM | 60+ countries, provider directory, lead gen | Not an operations platform; facilitator-only |
| **MetoCRM** | CRM-only | Lead tracking, offers, call/sales management | No ERP (inventory, logistics, finance) |
| **Planports** | Health Tourism CRM | CRM + calendar + accounting + social media | Turkey-focused; no patient portal |
| **InstaPract** | Full platform | Telehealth, CRM, app dev, HIPAA | White-label service, no product you buy |
| **DGS Healthcare** | CRM + Marketing | Pipeline management, multilingual | Marketing-heavy, thin on operations |
| **Salesforce Health Cloud** | Enterprise CRM | Full CRM + Einstein AI, HIPAA | $300+/user/mo, overkill for medical tourism |
| **HubSpot** | General CRM | Marketing, sales, service hubs | Not purpose-built; no medical tourism workflow |
| **Odoo** | General ERP | Full ERP suite (accounting, inventory, HR) | No patient pipeline; needs heavy customization |

### 4.2 Santos Care's Competitive Advantages

1. **CRM + ERP unified** — Most competitors are CRM-only or ERP-only. Santos Care does both.
2. **Multi-tenant SaaS** — Can license to other medical tourism companies.
3. **Purpose-built for medical tourism** — Not a generic CRM hacked for the industry.
4. **Patient + Hospital portals** — Self-service reduces coordinator workload.
5. **Modern tech stack** — Next.js + TypeScript + Supabase (not legacy PHP/.NET).
6. **AI-native** — Can integrate AI at every layer (lead scoring, translation, matching).
7. **India-focused at core** — Handles specific workflows (medical visa/FRRO, Ayurveda, NABH accreditation).

---

## 5. Marketing & Branding Strategy

### 5.1 Brand Positioning

**Tagline:** "India's Medical Journey, Perfected."

**Brand promise:** From first inquiry to post-recovery follow-up, Santos Care orchestrates every detail of the medical tourism journey so patients feel guided, not lost.

**Target audiences:**
- **Primary:** Medical tourists from Africa (Kenya, Nigeria, Tanzania), Middle East (UAE, Saudi), UK/EU, SAARC nations
- **Secondary:** Hospital partners (Aster, Apollo, Max, Medanta, Fortis), facilitators, insurance companies
- **Tertiary:** Other medical tourism companies (future SaaS customers)

**Brand voice:** Trustworthy, warm, expert, multilingual-capable.

### 5.2 Digital Marketing Funnel

```
Awareness → Consideration → Decision → Arrival → Recovery → Advocacy
   │            │              │          │         │           │
   SEO         Lead Form     Quotes      Visa     Follow-up  Testimonials
   Blog        WhatsApp      Hospital    Hotel    Surveys    Referral
   Social      Email         Compare     Transport Outcomes   Reviews
   Ads         Chatbot       E-sign      Meet &   NPS         Case Studies
```

### 5.3 SEO & Content Strategy (2026)

**Key insights from research:**
- AI citations are the new premium placement — being referenced in ChatGPT/Claude/Perplexity answers matters as much as ranking first on Google
- E-E-A-T is operational, not editorial — implement medical review workflows, author identity, update discipline
- Data consistency across all platforms is now a ranking factor

**Content pillars:**
1. **Treatment guides** — Comprehensive (costs, hospitals, recovery, risks)
2. **Country-specific** — Localized for top source markets (Kenya, Nigeria, UAE, UK)
3. **Patient stories** — Video testimonials, case studies, before/after
4. **Doctor profiles** — Credentials, success rates, languages
5. **India travel guides** — Visa process, what to expect, cultural tips

**AI visibility strategy:**
- Structured data (JSON-LD for MedicalBusiness, Hospital, Physician)
- FAQ schema for voice/AI answer extraction
- Markdown-accessible content for AI crawlers
- llms.txt file for AI discovery
- Consistent NAP (Name, Address, Phone) across all directories

### 5.4 Channel Strategy

| Channel | Purpose | Priority |
|---------|---------|----------|
| **Google Ads** | High-intent medical tourism keywords | High |
| **SEO / Organic** | Long-term traffic (treatment guides, country pages) | High |
| **WhatsApp Business** | Lead capture and nurturing (primary channel for Africa/Middle East) | Critical |
| **YouTube** | Patient testimonials, hospital tours, procedure explainers | Medium |
| **LinkedIn** | B2B: hospital partnerships, facilitator network | Medium |
| **Instagram** | Visual storytelling, patient journeys, destination appeal | Medium |
| **Facebook** | Community building, targeted ads by country | Medium |
| **TikTok** | Short-form patient stories, doctor Q&As (growing channel for medical tourism) | Medium |
| **Email** | Nurture sequences, hospital outreach, newsletters | High |

### 5.5 Patient Journey Marketing

| Stage | Channel | Message |
|-------|---------|---------|
| **Awareness** | Blog, SEO, YouTube, Social | "Treatments in India: Quality & Affordability" |
| **Consideration** | Lead magnet (cost guide), email nurture | "Compare hospitals, get personalized quotes" |
| **Decision** | WhatsApp consultation, video call | "Your dedicated coordinator explains everything" |
| **Pre-arrival** | Email + WhatsApp sequence | "Visa, packing, airport pickup — we handle it all" |
| **In India** | WhatsApp + In-app + Coordinator | "Daily check-ins, schedule updates" |
| **Post-treatment** | Survey, follow-up care, referral request | "How was your experience? Share it with others" |
| **Advocacy** | Review platforms, case study requests | "Your story helps others make the decision" |

---

## 6. Operations Plan

### 6.1 Hospital Partner Onboarding

**Phase 1 — Vetted Partners (current):**
- Direct agreements with 10-15 hospitals across India
- Fixed commission structure
- Manual coordination via WhatsApp/email
- Hospital profile in system with accreditations (JCI, NABH)

**Phase 2 — Platform Integration:**
- Hospital partner portal for referral management
- Digital report upload
- Automated commission tracking
- Quality scorecard based on outcomes

**Phase 3 — Open Marketplace:**
- Any accredited hospital can join
- Tiered partnership levels (Gold, Silver, Bronze)
- Patient reviews and ratings
- Dynamic pricing

### 6.2 Patient Journey SOP (Current Workflow)

```
1. INQUIRY
   └─ Lead comes in via web form, WhatsApp, email, or phone
   └─ Auto-assigned to next available coordinator
   └─ Response SLA: < 30 minutes (target)

2. QUALIFICATION
   └─ Coordinator calls/WhatsApps lead within 1 hour
   └─ Understands treatment need, timeline, budget
   └─ Checks medical records if available
   └─ Creates patient record, moves to "Qualified" stage

3. QUOTATION
   └─ Coordinator requests quotes from 1-3 partner hospitals
   └─ Creates comparison in system
   └─ Sends to patient with treatment plan
   └─ Follows up: Day 1, Day 3, Day 7, Day 14

4. BOOKING
   └─ Patient selects hospital and treatment package
   └─ Agreed quote converted to invoice
   └─ Patient pays deposit (30-50%)
   └─ Visa documentation process begins
   └─ Status: "Confirmed"

5. PRE-ARRIVAL
   └─ Visa assistance (invitation letter, embassy support)
   └─ Flight booking coordination
   └─ Accommodation booking
   └─ Airport pickup scheduled
   └─ Pre-treatment instructions sent
   └─ Status: "Pre-Arrival"

6. ARRIVAL
   └─ Coordinator meets at airport
   └─ Transfers to accommodation
   └─ First hospital visit
   └─ Pre-op consultation with surgeon
   └─ Status: "Arrived"

7. TREATMENT
   └─ Pre-op tests and clearances
   └─ Procedure(s)
   └─ Hospital stay coordination
   └─ Daily coordinator check-ins
   └─ Status: "In Treatment"

8. RECOVERY
   └─ Post-op monitoring
   └─ Follow-up appointments
   └─ Medication management
   └─ Status: "Recovery"

9. DEPARTURE
   └─ Final medical check
   └─ Discharge summary
   └─ Return transport
   └─ Balance payment
   └─ Status: "Departure"

10. POST-CARE
    └─ Day 7 follow-up call
    └─ Day 30 follow-up call
    └─ Satisfaction survey (NPS)
    └─ Request Google review / testimonial
    └─ Referral program invitation
    └─ Status: "Closed"
```

### 6.3 Key Performance Indicators

| KPI | Current | Target | Timeline |
|-----|---------|--------|----------|
| Lead response time | ~2 hours | < 30 min | Phase 0.5 |
| Lead-to-qualified rate | ~40% | > 60% | Phase 1 |
| Qualified-to-booked rate | ~25% | > 40% | Phase 1 |
| Average deal cycle | ~45 days | < 30 days | Phase 2 |
| Patient NPS | Not tracked | > 70 | Phase 3 |
| Coordinator capacity | ~5 patients | > 20 patients | Phase 2 |
| Quote turnaround | ~1 hour | < 15 min | Phase 1 |
| Invoice-to-payment | ~7 days | < 3 days | Phase 1 |

---

## 7. Technology Roadmap (Updated)

### Phase 0.5 — Right Now (1-2 weeks)
- Real bcrypt password auth (replace hardcoded demo credentials)
- Leads UI page (currently API-only)
- Patient detail page with activity timeline
- Lead → Patient conversion workflow
- Supabase Storage for file uploads
- Database indexes
- Fix build hanging issue
- Fix seed script

### Phase 1 — Foundation + Money (weeks 3-10)
- Multi-tenancy (Tenant model, tenantId on all queries)
- Audit log (Prisma middleware)
- RBAC (role-based permissions)
- Team management (invite, CSV bulk)
- Invoicing module (create, PDF, email, track payments, overdue reminders)
- Quotes module (multi-hospital comparison, e-signature, convert to invoice)
- Communications inbox (WhatsApp via Twilio, Email via Resend, threaded view, templates)

### Phase 2 — Operations (weeks 11-18)
- Visa management (per-country checklists, FRRO, expiry alerts)
- Accommodation (hotel partnerships, booking calendar, auto-bill)
- Transport logistics (airport pickup, driver scheduling)
- Calendar / Appointments (surgeon scheduling, conflict detection)
- Notifications (in-app + WhatsApp + email)

### Phase 3 — Staff + Insights (weeks 19-26)
- Doctors / Staff profiles, availability, performance
- Reports / Analytics (revenue funnel, conversion, COA, dashboards)
- Integrations Hub (payment gateways, calendar sync, accounting)

### Phase 4 — Inventory + Insurance (weeks 27-34)
- Equipment / Inventory tracking
- Insurance (pre-auth, claims, settlement)
- Outcomes / Quality (surveys, PROMs, NPS tracking)

### Phase 5 — Portals + SaaS (weeks 35-44)
- Patient self-service portal (portal.santos.care)
- Hospital partner portal (partners.santos.care)
- SaaS billing & subscriptions
- Multi-tenant signup flow with 14-day trial

---

## 8. Development Environment Setup

### 8.1 Recommended MCP Stack for Development

```
OpenCode (AI Coding Agent)
├── Context7 MCP        → Live docs for Next.js, Prisma, Tailwind, etc.
├── PostgreSQL MCP      → Schema inspection, query debugging
├── GitHub MCP          → PR review, issue management, code search
├── Sentry MCP          → Production error context during debugging
├── Filesystem MCP      → File operations (built-in)
└── Obsidian MCP        → Project knowledge base access
```

### 8.2 Local Development

```bash
# 1. Clone and install
git clone git@github.com:santosnexus/santos.care.git
cd santos.care

# 2. Install dependencies (both apps)
cd public-site && npm install
cd ../santocare-ops && npm install

# 3. Set up environment
cd santocare-ops
cp .env.example .env
# Edit .env: add DATABASE_URL or leave blank for mock mode

# 4. Start development
# Terminal 1: Ops Hub (port 3000)
cd santocare-ops && npm run dev

# Terminal 2: Public site (port 3001)
cd public-site && PORT=3001 npm run dev
```

### 8.3 Testing Strategy

```bash
# Unit tests (vitest)
cd santocare-ops && npx vitest

# Test-driven approach:
# 1. Write test first (red)
# 2. Implement feature (green)
# 3. Refactor
# 4. Run all tests before commit
```

Current test coverage: minimal (2 service test files). Target: 60%+ coverage by Phase 1.

### 8.4 CI/CD Pipeline

```yaml
# .github/workflows/ci.yml (existing)
steps:
  - lint         # ESLint
  - typecheck    # TypeScript strict
  - test         # Vitest (unit + integration)
  - build        # next build (verify no hangs)
```

---

## 9. Key Competitors to Monitor

| Company | URL | What to Watch |
|---------|-----|---------------|
| **PlacidWay** | placidway.com | Largest marketplace; their AI search feature ("PlacidWhere") |
| **MetoCRM** | metocrm.com | Turkey-focused CRM; feature updates |
| **InstaPract** | instapract.com | Telehealth + medical tourism platform |
| **Planports** | planports.com | Health tourism CRM with accounting |
| **DGS Healthcare** | dgshealthcare.com | CRM + marketing for medical tourism |
| **MedGo** | medgo.com | Patient matching platform |
| **Patients Beyond Borders** | patientsbeyondborders.com | Content authority; accreditation focus |

---

## 10. Immediate Action Items

### This Week
1. [ ] Fix build hanging (add `output: "standalone"`, check SWC deps)
2. [ ] Rotate all hardcoded credentials
3. [ ] Enforce `NEXTAUTH_SECRET` env var check
4. [ ] Fix Prisma seed script
5. [ ] Add auth to unprotected API routes
6. [ ] Set up Obsidian vault with project structure
7. [ ] Install smart Obsidian plugins (Smart Connections, Dataview, Templater)
8. [ ] Set up MCP stack in OpenCode

### This Month
1. [ ] Complete Phase 0.5 quick wins
2. [ ] Write first test suite for each service layer
3. [ ] Start Phase 1: Multi-tenancy + RBAC
4. [ ] Begin hospital partner onboarding (Phase 1 ops)
5. [ ] Publish first 3 treatment videos on YouTube
6. [ ] Launch Google Ads campaign for top 5 treatments

### This Quarter
1. [ ] Complete Phase 1 (Invoicing, Quotes, Communications)
2. [ ] Achieve 60%+ test coverage
3. [ ] Onboard 10 hospitals to partner portal
4. [ ] Process 50+ patients through the system
5. [ ] Establish SEO baseline (target: top 10 for 10 key terms)
6. [ ] Build 3 backlinks from medical tourism directories

---

*This document is a living strategy guide. Update monthly based on market changes, user feedback, and development progress.*
