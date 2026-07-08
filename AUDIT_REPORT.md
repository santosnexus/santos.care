# Santos Care — Full Codebase Audit Report

**Date:** 2026-07-02
**Auditor:** OpenCode automated audit
**Repo:** `github.com/santosnexus/santos.care`

---

## 1. Executive Summary

- **What it is:** A medical tourism CRM platform with two Next.js apps — a public marketing site and a private operations dashboard — sharing a single PostgreSQL database on Supabase.
- **What works end-to-end:** You can log in, see a dashboard with stats/charts, manage patients through a 10-stage pipeline, create/convert leads, manage partners and tasks, generate invoices and quotes, send and receive messages in a threaded inbox, upload documents, and view an audit log of all changes. The demo deployment is live at `santos-care.vercel.app`.
- **Critical security issue:** 12 out of 28 API routes (43%) have **no authentication at all** — anyone who finds the API URLs can read, create, modify, or delete patient records, leads, partners, tasks, and documents. Only invoices, quotes, messages, users, and audit logs are properly protected.
- **Production credentials hardcoded in source code:** The password `He@lInd!a2026` appears in 7+ source files that are committed to GitHub (including `.env.example`), and a fallback JWT signing secret is visible in the source code.
- **No tests exist anywhere** — zero unit tests, integration tests, or end-to-end tests for either application.
- **No error boundary, no rate limiting, no CORS configuration, no input validation on most routes** — these are standard production-readiness items that are entirely missing.
- **Builds hang in CI/CD** — both Next.js apps fail to complete a production build in a reasonable time, and the public site has missing SWC binary dependencies.
- **The database schema is well-designed** with 21 tables, proper indexes, foreign keys, and multi-tenant isolation. This is the strongest part of the codebase.
- **The Prisma seed script has bugs** — it references `tenantId: "santos"` but never creates a Tenant record, and the user/patient/lead/partner/task mock data objects lack the required `tenantId` field, so the seed will fail at runtime.

---

## 2. Current State — What Works Today

### What an end-to-end user can do:

1. **Landing page** (`/login`): See a login form with pre-filled demo credentials.
2. **Dashboard** (`/`): View aggregate stats (total patients, active leads, revenue, task completion), a daily signups chart, a patient stage distribution pie chart, and a recent activity feed.
3. **Patients** (`/patients`): See a paginated table with search, filters (by stage, country, coordinator), inline stage change, view patient detail modal with stage history timeline.
4. **Leads** (`/leads`): See a table with source/status filtering, create new leads, convert leads to patients.
5. **Partners** (`/partners`): Manage hospital, ayurveda, lab, transport, and equipment partners with agreement status tracking.
6. **Tasks** (`/tasks`): Kanban-style board with drag-and-drop status changes, create/edit tasks assigned to team members.
7. **Invoices** (`/invoices`): List with stats (total outstanding, overdue, paid), status/date filtering, create invoices with line items, record payments.
8. **Quotes** (`/quotes`): List similar to invoices, create quotes with line items, status tracking.
9. **Inbox** (`/inbox`): Split-pane threaded message view with WhatsApp/Email/SMS/Internal channels, create new messages.
10. **Documents** (`/documents`): Upload files (base64-encoded, up to 5MB), view by category.
11. **Marketing** (`/marketing`): Placeholder page.
12. **Analytics** (`/analytics`): Charts page.
13. **Roadmap** (`/roadmap`): Product roadmap view.
14. **Settings** (`/settings`): Audit log viewer, team management (add/invite/deactivate users), integration settings.
15. **Authentication**: Login via email+password generates a JWT stored in an HTTP-only cookie (`sc-ops-session`). Basic Auth fallback (username/password in middleware).

### Public site (`public-site/`):
- Homepage with medical tourism content, treatments listing (10+ procedures with cost tables), country guides, blog (10 articles with PDFs), FAQ, visa guide, contact form with lead capture API, privacy policy, sitemap, robots.txt.

### Deployments:
- **Ops Hub:** `https://santos-care.vercel.app` (login: `admin@santos.care`)
- **Public Site:** `https://santos-care-web.vercel.app`

---

## 3. Errors & Bugs Found (Severity-Ranked)

### 🔴 Critical

| # | Issue | Location | Description |
|---|-------|----------|-------------|
| C1 | **Build hangs indefinitely** | Both apps — `npm run build` | `next build` hangs at "Creating an optimized production build" with no error. The public site also warns about missing SWC dependencies. This blocks all Vercel deployments and CI/CD. |
| C2 | **Prisma seed will fail at runtime** | `prisma/seed.ts` + `data.ts` | The data objects for users, patients, leads, partners, and tasks lack the required `tenantId` field (declared `String` not `String?` in the schema). Invoices/quotes reference `tenantId: "santos"` but no Tenant record is ever created. |
| C3 | **JWT tokens signed with public fallback secret** | `src/lib/auth.ts:8`, `src/lib/tenant.ts:58` | If `NEXTAUTH_SECRET` env var is not set (which is not enforced), tokens are signed with `"fallback-dev-secret-change-in-production-please"` — visible in the public repo. Anyone can forge valid session tokens. |
| C4 | **Production password in .env.example committed to git** | `santocare-ops/.env.example:14` | `OPS_AUTH_PASS="He@lInd!a2026"` is the actual production password stored in the tracked `.env.example` file. The password is also hardcoded in 7 source files. |

### 🟠 High

| # | Issue | Location | Description |
|---|-------|----------|-------------|
| H1 | **12/28 API routes have zero authentication** | See table in §4 | Patients, leads, partners, tasks, and documents CRUD routes have no auth checks. An attacker who discovers the API URLs can read/write/delete all data. |
| H2 | **No CORS configuration** | `src/middleware.ts`, all API routes | Cross-origin requests from the public site to the ops hub API are silently blocked by the browser. The lead capture form, which lives on a different domain, will fail. |
| H3 | **No input validation on most API routes** | All unprotected routes | Request bodies are destructured with no schema validation (no zod, no yup, no manual checks). Malformed requests pass through silently. |
| H4 | **No rate limiting on public endpoints** | `public-site/src/app/api/leads/capture/route.ts` | The lead capture API is explicitly public with no auth, but rate limiting (documented as planned) is not implemented. Vulnerable to spam/abuse. |
| H5 | **Basic Auth credentials exposed in client-side code** | 4 component files: `patients/[id]/page.tsx`, `leads/page.tsx`, `documents/page.tsx` | `Authorization: "Basic " + btoa("santos:He@lInd!a2026")` is hardcoded in browser-delivered JavaScript. Anyone viewing the page source or network tab gets the credentials. |
| H6 | **PII/PHI logged to stdout** | `public-site/src/app/api/leads/capture/route.ts:52` | Full lead body (name, email, phone, country, treatment interest) is logged as plaintext when the ops hub URL is not configured. |

### 🟡 Medium

| # | Issue | Location | Description |
|---|-------|----------|-------------|
| M1 | **No automated tests** | Entire codebase | Zero test files, zero test configuration. No safety net for refactoring or regression detection. |
| M2 | **No global error boundary** | `src/app/layout.tsx`, no `error.tsx` | Unhandled exceptions in API routes (especially invoices) produce generic 500 errors with no structured JSON response. No `global-error.tsx` exists either. |
| M3 | **npm audit: 2 vulnerabilities (1 critical)** | `santocare-ops` — `next` and `postcss` | Next.js 14.2.5 has 26 known advisories (cache poisoning, DoS, SSRF, XSS, authorization bypass). PostCSS has a moderate XSS issue. |
| M4 | **npm audit: 8 vulnerabilities (1 critical, 6 high)** | `public-site` — `next`, `postcss`, `glob`, `minimatch` | Same Next.js issues plus ReDoS in glob + minimatch. |
| M5 | **No env var validation at startup** | All source files | No zod/env validation schema. Missing required vars silently fall back to hardcoded development credentials. |
| M6 | **Hardcoded tenant configuration** | `src/middleware.ts:48-50` | Tenant data is an inline array literal rather than fetched from the database or env configurable. |
| M7 | **Seed script logs password to console** | `prisma/seed.ts:62` | `console.log(\`... (password: ${defaultPassword})\`)` logs the seeded password during database setup. |
| M8 | **`document.isPublic` field without guard** | `prisma/schema.prisma` + API routes | Documents have a `isPublic` boolean with no application-level checks preventing PHI-containing documents from being marked public. |
| M9 | **AuditLog stores PHI in `before`/`after` JSON** | `prisma/schema.prisma` — `AuditLog.before`/`after` | Changes to PHI fields (patient treatment, diagnosis) are serialized into audit log JSON columns, creating a secondary unencrypted PHI store. |

### 🟢 Low

| # | Issue | Location | Description |
|---|-------|----------|-------------|
| L1 | **Placeholder email on lead conversion** | `leads/[id]/convert/route.ts:31` | Uses `unknown-{timestamp}@placeholder.local` when a lead lacks an email. |
| L2 | **Stub stage history data** | `patients/page.tsx:436-449` | Timeline uses hardcoded mock data instead of querying `StageChange` records. |
| L3 | **Document preview is placeholder text** | `documents/page.tsx:254` | "This is a preview..." text for non-seeded document IDs. |
| L4 | **4 unused imports** | Dashboard, patients, tasks, partners pages | `Funnel/FunnelChart/LabelList`, `Filter`, `FilterIcon`, `X` imported but never used. |
| L5 | **README claims documentation files that don't exist** | Root `README.md`, `santocare-ops/README.md` | References to `INSTALLATION.md`, `ARCHITECTURE.md`, `USER_GUIDE.md`, `API_DOCUMENTATION.md`, `BUILD_LOG.md` — none of these files exist in the repo. |
| L6 | **3 .env.example vars declared but never read by code** | `LEAD_WEBHOOK_URL`, `LEAD_NOTIFICATION_EMAIL`, `NEXT_PUBLIC_GA_ID` | These vars are documented but have zero `process.env` references in any source file. |
| L7 | **2 env vars used in code but missing from .env.example** | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Required for Supabase file storage but not documented in `.env.example`. |
| L8 | **Demo credentials in login form defaults** | `login/page.tsx:9-10` | Email and password pre-filled as `useState` defaults (`admin@santos.care`, `He@lInd!a2026`). |

---

## 4. Security & Compliance Gaps

### Patient Health Information (PHI) Exposure Risks

| Risk | Severity | Details |
|------|----------|---------|
| **43% of API routes are unauthenticated** | 🔴 Critical | Patients, leads, partners, tasks, and documents CRUD routes have no auth checks — any of the following could be exploited to access PHI: GET `/api/patients` lists all patients with names, phone, email, treatment type, treatment description; GET `/api/patients/[id]` returns full patient records including PHI fields. |
| **PHI stored in plaintext in database** | 🟠 High | Patient.treatmentType, Patient.treatmentDescription, Note.content, Communication.content, Quote.treatmentPlan, Document.filePath — all unencrypted at rest. PostgreSQL TDE (Transparent Data Encryption) would encrypt at the storage layer, but no application-level field encryption is implemented. |
| **PHI could be logged in audit trail** | 🟠 High | `AuditLog.before`/`after` are JSON columns that capture the full state of changed records. If a patient's treatment details change, the old and new values (including PHI) are stored in the audit log. |
| **File uploads stored as base64 in database** | 🟠 High | `documents/upload/route.ts` stores file contents as base64 strings in the `Document.filePath` column. These are medical records (reports, scans) stored unencrypted. |
| **Base64-encoded credentials exposed to all visitors** | 🟠 High | 4 client-side components include `btoa("santos:He@lInd!a2026")`. Anyone who visits the dashboard pages can extract these credentials from the JavaScript bundle. |
| **No data retention or deletion policy** | 🟡 Medium | No soft-delete fields on `Patient`, `Lead`, or `Message`. Hard-deleting would lose audit trail history; keeping indefinitely may violate data protection regulations (GDPR, HIPAA). |
| **`isPublic` field on documents without safeguards** | 🟡 Medium | A document containing a medical report could accidentally be marked `isPublic: true` with no application-level check preventing it. |
| **Analytics events could capture PHI** | 🟡 Medium | `AnalyticsEvent.eventData` is a freeform JSON column. If any analytics instrumentation logs patient-specific data, it would be stored unencrypted. |
| **No input sanitization** | 🟡 Medium | With no validation in 12/28 routes, an attacker could inject arbitrary content (including script tags if content is ever rendered unsafely) into any field. |

### Authentication Architecture

The codebase has a **dual auth system**:

1. **JWT session** (preferred): Password + email login via `src/lib/auth.ts` → JWT in `sc-ops-session` cookie → verified in middleware via `jose` library.
2. **Basic Auth** (fallback): Username/password checked in middleware → bypasses session entirely.

**Risk:** The Basic Auth fallback means a static credential pair can access every route that the middleware protects. Combined with the hardcoded fallback values, this is a single point of compromise.

### HIPAA/GDPR Compliance Gaps

| Requirement | Status | Gap |
|-------------|--------|-----|
| Access controls (who can see what data) | ❌ Missing | Only 16/28 routes have `requirePermission`. The other 12 have zero access controls. |
| Audit trail of PHI access | ⚠️ Partial | `AuditLog` tracks data *changes* but not data *access* (reads). No logging of who viewed patient records. |
| Encryption at rest | ❌ Missing | No field-level encryption for PHI fields. |
| Encryption in transit | ✅ Present | HTTPS is handled by Vercel/Next.js. |
| Data backup | ❓ Unknown | Depends on Supabase configuration, not visible in codebase. |
| Data retention/deletion | ❌ Missing | No retention policies, soft-delete, or archival mechanism in the schema or application code. |
| Incident response plan | ❌ Missing | Not in codebase. |
| Business Associate Agreement (BAA) | ❓ Unknown | Would need to verify with Supabase. |
| Patient consent management | ❌ Missing | No consent records, no opt-in/opt-out mechanism. |
| Breach notification capability | ❌ Missing | No way to determine what data was exposed during a breach (no access logging). |

---

## 5. Missing Features

### Core Medical Tourism Platform Features

| Feature | Status | Notes |
|---------|--------|-------|
| **Patient intake / registration** | ⚠️ Partial | Leads can be captured from public site and converted to patients manually. No self-service patient portal or online intake forms. |
| **Provider / hospital directory** | ⚠️ Partial | Partner model exists with `HOSPITAL` category, but no public-facing provider directory with profiles, accreditations, or reviews. |
| **Booking / scheduling** | ❌ Missing | No appointment scheduling, no calendar integration, no procedure date selection. Patient `expectedTravelDate` and `actualTravelDate` fields exist but aren't connected to any booking flow. |
| **Payments / billing** | ⚠️ Partial | Invoices and payments can be recorded manually. No payment gateway integration (Stripe, PayPal, Razorpay), no online payment collection, no multi-currency support beyond a `currency` string field. |
| **Medical records / document management** | ⚠️ Partial | Document upload works but stores files as base64 in DB. No medical records viewer, no HL7/FHIR integration, no imaging (DICOM) support, no lab results integration. |
| **Messaging / communications** | ⚠️ Partial | Internal message inbox works. No WhatsApp API integration (fields exist in schema), no email delivery (SendGrid/Mailgun), no SMS gateway. |
| **Itinerary / travel logistics** | ❌ Missing | Patient `expectedTravelDate`, `actualTravelDate`, `dischargeDate` exist. No itinerary builder, no flight booking, no hotel booking, no visa assistance workflow, no airport pickup scheduling. |
| **Multi-language support** | ❌ Missing | All UI text is hardcoded in English. No i18n framework (next-intl, react-i18next). The public site content mentions "patients from Kenya, UAE, UK" but all content is English-only. |
| **Multi-currency** | ❌ Missing | `currency` string field exists on invoices/quotes. No exchange rate handling, no multi-currency display, no currency conversion. |
| **Patient portal / self-service** | ❌ Missing | Patients cannot log in, view their own records, pay invoices, or message their coordinator. All operations require a staff user to log into the ops hub. |
| **Provider verification / credentialing** | ❌ Missing | No provider credential verification, no license validation, no accreditation tracking, no quality score. |
| **Marketing automation** | ❌ Missing | Lead capture exists but no email campaigns, no drip sequences, no retargeting, no CRM-triggered communications. |
| **Analytics / business intelligence** | ⚠️ Partial | Basic dashboard charts (signups, stage distribution, tasks). No revenue forecasting, no conversion funnel analysis, no provider performance metrics, no patient outcome tracking, no cost analysis. |
| **Compliance / regulatory** | ❌ Missing | No HIPAA/GDPR compliance features, no patient consent management, no data retention automation, no breach detection. |

### Feature-Level Completeness (within ops hub)

| Feature | List/View | Create | Edit | Delete | Search | Filter | Detail |
|---------|-----------|--------|------|--------|--------|--------|--------|
| Dashboard | ✅ | — | — | — | — | — | — |
| Patients | ✅ | ⚠️ (no form) | ⚠️ (inline only) | ❌ | ✅ | ✅ | ⚠️ (modal) |
| Leads | ✅ | ⚠️ (inline) | ⚠️ (minimal) | ❌ | ❌ | ✅ | ❌ |
| Partners | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Tasks | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Invoices | ✅ | ✅ | ⚠️ (status only) | ❌ | ❌ | ✅ | ❌ |
| Quotes | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Inbox | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Documents | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Marketing | ❌ | — | — | — | — | — | — |
| Analytics | ⚠️ (charts) | — | — | — | — | — | — |
| Roadmap | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Users | ✅ | ⚠️ (invite) | ⚠️ (basic) | ⚠️ (deactivate) | ❌ | ❌ | ❌ |
| Audit Logs | ✅ | — | — | — | ❌ | ❌ | ❌ |

Key: ✅ = Works | ⚠️ = Partial | ❌ = Missing | — = N/A

---

## 6. Architecture Recommendations

### What To Refactor Before Adding More Features

#### Priority 1: Authentication Layer (fix the 43% gap)

**Why:** 12/28 API routes have zero auth. If you add features on top of this, the new code will inherit the same vulnerability pattern. Fixing it retroactively becomes harder as the codebase grows.

**Action:**
- Add `requirePermission` wrappers to all unprotected routes (patients, leads, partners, tasks, documents).
- Remove the Basic Auth fallback from client-side code and use the JWT session cookie instead.
- Add a `fetchWithAuth` utility function for client-side API calls that automatically attaches the session cookie.
- Validate that all new routes follow the pattern established by invoices/quotes/messages.

#### Priority 2: Input Validation (add zod schemas)

**Why:** Without validation, any feature added on top of unvalidated inputs is fragile. Database constraint violations, injection attacks, and data corruption are all possible.

**Action:**
- Add `zod` as a dependency.
- Define Zod schemas for every entity (PatientSchema, LeadSchema, InvoiceCreateSchema, etc.) in a `src/schemas/` directory.
- Add a `validate(schema)` middleware that can wrap API route handlers.
- Remove the current ad-hoc validation patterns (destructuring without checks, optional null propagation).

#### Priority 3: Service Layer (extract business logic from routes)

**Why:** Currently, business logic (lead conversion, invoice calculation) lives inline in route handlers. This makes it impossible to unit test business rules, and duplicating logic across routes is inevitable.

**Action:**
- Create `src/services/` directory.
- Extract: `convertLeadToPatient`, `calculateInvoiceTotals`, `generateInvoiceNumber`, `generateQuoteNumber`, `sendMessageViaChannel`, `uploadDocument`.
- Route handlers should only parse the request, call a service function, and format the response.
- This enables unit testing without HTTP overhead.

#### Priority 4: Error Handling Infrastructure

**Why:** Missing error boundaries and try/catch on many routes means unhandled exceptions crash the API with no structured response.

**Action:**
- Add `error.tsx` and `global-error.tsx` for the Next.js App Router.
- Add a global error handler wrapper: `withErrorHandling(handler)` that wraps every API route with try/catch and returns structured JSON errors.
- Add structured logging (pino/winston) to replace `console.log`/`console.error`.
- Remove all `console.log` calls that log request bodies (especially PII).

#### Priority 5: Build & Deploy Stability

**Why:** The build hangs indefinitely, preventing Vercel deployments and CI/CD. This is the most immediate blocker.

**Action:**
- Update Next.js from 14.2.5 to 14.2.35+ (the latest 14.x patch).
- Run `npm install` to fix missing SWC binary dependencies (public-site specific).
- Add `.nvmrc` to pin Node.js version.
- Add `vercel.json` to both apps with explicit build configuration.
- Add `npm run build` and `npm run lint` to a GitHub Actions CI workflow.

#### Priority 6: Env Var Validation

**Why:** Hardcoded fallback secrets are the #1 security risk. Every missing env var silently falls back to a known value.

**Action:**
- Add `@t3-oss/env-nextjs` and define a validated env schema in `src/env.ts`.
- Make `NEXTAUTH_SECRET`, `DATABASE_URL`, `OPS_AUTH_USER`, `OPS_AUTH_PASS` required in production.
- Remove all hardcoded fallback values from source code.
- Update `.env.example` with placeholder values only (no real secrets).

---

## 7. Phased Development Plan

### Phase 0: Stabilize & Fix Critical Bugs (Week 1)

| Task | Effort | Details |
|------|--------|---------|
| Update Next.js to 14.2.35+ | 30 min | Both apps — fixes npm audit critical vulnerabilities |
| Fix Prisma seed script | 2 hours | Add tenant creation, add tenantId to all mock data objects, fix hardcoded IDs |
| Add `NEXTAUTH_SECRET` validation | 1 hour | Add env validation, ensure production env has it set |
| Remove secrets from .env.example | 15 min | Replace with placeholder values, rewrite git history or add to .gitignore |
| Remove hardcoded credentials from client code | 2 hours | Replace with session-based API calls in patients/leads/documents pages |
| Fix build hang (SWC + Lockfile) | 1 hour | Run `npm install` on public-site, verify build completes |
| Add CORS headers to middleware | 1 hour | Allow cross-origin requests from public site domain |
| Add rate limiting to lead capture | 2 hours | Use Upstash or Vercel Rate Limiting |

### Phase 1: Security Hardening (Week 2)

| Task | Effort | Details |
|------|--------|---------|
| Add `requirePermission` to all 12 unprotected routes | 4 hours | Patients, leads, partners, tasks, documents |
| Add client-side auth utility (`fetchWithAuth`) | 2 hours | Remove all `btoa("santos:pass")` patterns |
| Add global error handler wrapper | 2 hours | `withErrorHandling()` for all API routes |
| Add structured logging (pino) | 3 hours | Replace `console.log`/`console.error`, no PII in logs |
| Add `error.tsx` + `global-error.tsx` | 1 hour | Proper error UI for both apps |
| Add input validation (zod schemas) | 4 hours | Start with Patient, Lead, Invoice, Quote |

### Phase 2: Core Feature Completion (Weeks 3-4)

| Task | Effort | Details |
|------|--------|---------|
| Patient create/edit forms | 2 days | Full form with validation, stage management, coordinator assignment |
| Lead create/edit forms | 1 day | Full form with source tracking, UTM params |
| Partner CRUD | 1 day | Full create/edit/delete with agreement management |
| Invoice create/edit forms | 2 days | Line item builder, multi-currency, PDF generation |
| Quote-to-Invoice conversion | 1 day | Convert accepted quote into invoice with line items |
| Quote form with treatment plan | 1 day | Rich text treatment plan, hospital association |
| Email delivery integration (SendGrid) | 1 day | Actually send emails from messaging module |
| WhatsApp integration | 2 days | Twilio WhatsApp API integration |
| File upload to Supabase Storage | 1 day | Replace base64 DB storage with Supabase Storage or S3 |
| Add automated tests | 3 days | Start with unit tests for service layer, then integration tests for critical routes |

### Phase 3: Medical Tourism Features (Weeks 5-6)

| Task | Effort | Details |
|------|--------|---------|
| Patient self-service portal | 5 days | Separate login for patients, view records, pay invoices, message coordinator |
| Booking/scheduling system | 3 days | Calendar view, procedure scheduling, hospital availability |
| Provider directory (public site) | 3 days | Hospital profiles, accreditations, specializations, reviews |
| Itinerary builder | 3 days | Flight, hotel, transport, visa workflow management |
| Multi-currency support | 2 days | Exchange rate API integration, dynamic currency display |
| i18n framework | 3 days | Add next-intl, translate UI to target languages (Arabic, Hindi, Swahili) |
| Marketing automation | 3 days | Email drip campaigns, follow-up sequences, lead scoring |

### Phase 4: Compliance & Scale Readiness (Week 7+)

| Task | Effort | Details |
|------|--------|---------|
| HIPAA/GDPR compliance audit | 5 days | BAA with Supabase, encryption review, access logging, retention policy |
| Add PHI field-level encryption | 3 days | Application-layer encryption for sensitive fields |
| Add access audit logging (reads) | 2 days | Log every time a patient record is viewed |
| Add soft-delete mechanism | 2 days | `deletedAt` on Patient, Lead, Message |
| Add data retention automation | 2 days | Auto-anonymize or delete records after retention period |
| Add rate limiting to all API routes | 1 day | Per-user rate limiting with Upstash |
| Performance optimization | 3 days | Prisma query optimization, add missing indexes, implement pagination everywhere |
| Add GitHub Actions CI | 1 day | Automated lint, type-check, test, build on every PR |
| Add staging environment | 1 day | Separate Vercel preview deployment + Supabase branch |

---

## 8. Open Questions

These could not be determined from the codebase alone and need the project owner to clarify:

1. **Target user roles:** The schema defines 9 roles (SUPER_ADMIN, ADMIN, MANAGER, SALES, COORDINATOR, FINANCE, MARKETING, STAKEHOLDER, VIEWER). How are these expected to map to actual team members? Is there a single organization or multiple hospitals/clinics?

2. **Payment provider:** The `PaymentMethod` enum includes BANK_TRANSFER, CARD, CASH, CHEQUE, INSURANCE, OTHER but no payment gateway integration exists. Which payment provider(s) should be integrated (Stripe, Razorpay, Paystack, Square, etc.)? Is multi-currency settlement needed?

3. **Compliance regime:** Is this platform expected to be HIPAA-compliant (US health data), GDPR-compliant (EU patient data), or both? Or is there a specific Indian/Southeast Asian regulatory framework (e.g., India's Digital Personal Data Protection Act)?

4. **Hosting and scaling target:** Is Vercel + Supabase intended to be the production target, or is there a plan to move to dedicated infrastructure (AWS/GCP/Azure)? What are the expected user counts (10 users? 100? 10,000?)?

5. **File storage:** Documents are currently stored as base64 in the database. Is Supabase Storage the intended destination, or should S3/R2/Cloudinary be used instead? Are there expected file types (PDFs, images, DICOM medical imaging)?

6. **Email/SMS delivery:** The schema has `MessageChannel` (WHATSAPP, EMAIL, SMS, INTERNAL) but no delivery provider integration. Which providers should be used (Twilio for WhatsApp/SMS, SendGrid/Resend for email)?

7. **Patient portal:** Should patients have their own login? Currently only staff users can access the ops hub. Is a patient self-service portal planned?

8. **Language support:** The public site and ops hub are entirely in English. Given the target markets (Kenya, UAE, UK, India), which languages need to be supported first? Should the ops hub also be multi-language or only the public site?

9. **Multi-tenancy scope:** The schema is multi-tenant (every model has `tenantId`). Is this intended for multiple hospital chains, or is it a single-tenant deployment with the field for future-proofing?

10. **Custom domains:** The README mentions `santos.care` and `ops.santos.care` as custom domains. Are these configured in Vercel DNS? Is there an SSL certificate plan?

11. **Monorepo tooling:** The repo has two Next.js apps with no monorepo tool (Turborepo, Nx). Is this intentional, or should one be introduced for shared packages/types/utilities?

12. **Data migration plan:** The `MERN_MIGRATION.md` file mentions a migration from MongoDB. Is this still relevant, or has the team fully committed to PostgreSQL/Prisma?

---

*End of audit report. No code changes were made.*
