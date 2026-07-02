# Santos Care CRM + ERP — Product Roadmap

**Vision:** Build a complete medical tourism CRM + ERP that starts as the operations backbone for Heal India, then evolves into a multi-tenant SaaS that other medical tourism companies can license.

**Stack:** Next.js 14 + Prisma + PostgreSQL (Supabase) + React (built into Next.js)
**Timeline:** 9-12 months to v1.0
**Effort:** 5-10 hours/week solo development
**Status:** Phase 0 (Foundation) ✅ complete, Phase 1 starting

---

## 1. Product Vision

### What is "Santos Care CRM + ERP"?

A unified platform that handles:
- **CRM side:** Leads, pipeline, communication, marketing automation
- **ERP side:** Operations, finance, logistics, compliance, reporting
- **Patient portal:** Self-service for patients (status, documents, payments, itinerary)
- **Multi-tenant SaaS:** Each medical tourism company gets their own isolated workspace

### Why combine CRM + ERP?

Most "medical tourism platforms" are either:
- **CRM-only** (e.g., HubSpot) — great for sales, terrible for ops
- **ERP-only** (e.g., Odoo) — great for ops, no patient context
- **Hospital management** (e.g., Epic) — built for one hospital, not a facilitator

Medical tourism is unique because the "customer" is the **patient** but you also coordinate with **multiple hospitals**, **hotels**, **transport**, and **embassies**. You need both CRM (patient lifecycle) AND ERP (multi-vendor orchestration).

### Who uses it?

| User | What they do |
|---|---|
| **Marketing team** | Creates campaigns, sees lead sources, conversion rates |
| **Sales / Counselors** | Handle inquiries, send quotes, follow up |
| **Operations coordinators** | Manage visa, hotel, transport, scheduling |
| **Finance** | Invoices, payments, commissions, reports |
| **Management** | KPIs, dashboards, strategic reports |
| **Doctors** (external) | See patient summaries, accept referrals |
| **Patients** | Self-service portal (status, documents, payments) |
| **Hospital partners** | Receive patient referrals, upload reports |
| **Hotel partners** | Receive booking requests, update availability |

---

## 2. Multi-Tenancy Strategy (Day 1)

**Decision:** Multi-tenant from day 1 with shared database, shared schema, `tenantId` discriminator column.

### Why this approach?

| Approach | Pros | Cons |
|---|---|---|
| **Shared DB, shared schema, tenantId** ✅ | Simple, fast, cheap (Supabase free tier supports many tenants) | Noisy neighbor risk |
| Shared DB, separate schema per tenant | Better isolation | Schema migration nightmare |
| Separate DB per tenant | Best isolation | Expensive, complex migrations |

For 1-3 person team starting out, **shared schema with `tenantId`** is the right call. Can migrate to separate schemas later if needed.

### Schema pattern

Every table gets a `tenantId` column. Every query filters by `tenantId`. Authentication injects `tenantId` into the request context.

```prisma
model Patient {
  id        String   @id @default(cuid())
  tenantId  String   // <-- every row belongs to a tenant
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  // ... other fields

  @@index([tenantId])
  @@index([tenantId, stage])  // composite indexes for common queries
  @@map("patients")
}

model Tenant {
  id        String   @id @default(cuid())
  slug      String   @unique  // "santos-care", "meditrip-india"
  name      String
  domain    String?  @unique  // custom domain (santos.care)
  status    TenantStatus @default(ACTIVE)
  plan      TenantPlan    @default(STARTER)

  users     User[]
  patients  Patient[]
  leads     Lead[]
  // ... relations to all other tables

  createdAt DateTime @default(now())
  @@map("tenants")
}
```

### Tenant resolution

Multiple ways to identify the tenant:
1. **Subdomain** (santos.care, meditrip.care) — primary
2. **Custom domain** (santos.care → tenant "santos")
3. **JWT claim** (every session token includes `tenantId`)
4. **Header** (X-Tenant-ID for API access)

The resolver checks all four in order.

### Tenant onboarding flow

1. New company signs up at `santos.care/signup`
2. Creates a workspace (name, slug, plan)
3. Becomes the first ADMIN user
4. Gets a 14-day trial
5. Can invite team members
6. Can connect custom domain

---

## 3. Module Architecture

### Current modules (keep)

1. **Dashboard** — KPIs overview
2. **Patients** — patient pipeline
3. **Tasks** — task management
4. **Partners** — hospitals, hotels, etc.
5. **Documents** — file library
6. **Marketing** — campaign tracking
7. **Analytics** — funnel, revenue
8. **Roadmap** — phase tracking (internal)
9. **Settings** — tenant config

### New modules to add

| # | Module | Phase | Effort |
|---|---|---|---|
| 10 | **Inbox / Communications** | Phase 1 | 3 weeks |
| 11 | **Invoicing / Payments** | Phase 1 | 3 weeks |
| 12 | **Quotes / Proposals** | Phase 1 | 2 weeks |
| 13 | **Visa Management** | Phase 2 | 2 weeks |
| 14 | **Accommodation** | Phase 2 | 2 weeks |
| 15 | **Transport / Logistics** | Phase 2 | 2 weeks |
| 16 | **Calendar / Appointments** | Phase 3 | 2 weeks |
| 17 | **Doctors / Staff** | Phase 3 | 2 weeks |
| 18 | **Reports / Analytics** | Phase 3 | 3 weeks |
| 19 | **Audit Log** | Phase 1 (foundation) | 1 week |
| 20 | **Notifications** | Phase 2 | 2 weeks |
| 21 | **Integrations Hub** | Phase 3-4 | 3 weeks |
| 22 | **Equipment / Inventory** | Phase 4 | 2 weeks |
| 23 | **Insurance** | Phase 4 | 2 weeks |
| 24 | **Outcomes / Quality** | Phase 4 | 2 weeks |
| 25 | **Patient Portal** | Phase 5 | 3 weeks |
| 26 | **Hospital Partner Portal** | Phase 5 | 2 weeks |
| 27 | **Settings: Team & RBAC** | Phase 1 | 2 weeks |
| 28 | **Settings: Billing & Subscription** | Phase 5 | 2 weeks |

### Total: 19 new modules, ~50 weeks of work at 5-10h/week = ~12 months

---

## 4. Phased Roadmap

### Phase 0 — Foundation ✅ COMPLETE

**Status:** Done (this is where we are)
- Public marketing site
- Lead capture form
- Basic ops hub with 9 modules
- Supabase database
- Auth (Basic + JWT)
- Deployment to Vercel

**Lines of code:** ~6,500
**Time to build:** 2 weeks (with AI assistance)

---

### Phase 0.5 — Quick Wins (Weeks 1-2) — STARTING NOW

**Goal:** Ship the most useful small improvements before doing the big multi-tenant migration.

#### 0.5.1 Leads UI page (currently API only)
- New `/leads` page in ops hub
- Lead list with filters
- Lead detail with notes
- Add to sidebar navigation
- "Convert to patient" button

#### 0.5.2 Patient detail page
- Click a patient → see full profile
- Activity timeline (every task, note, communication)
- Related entities (tasks, documents, communications)
- Edit patient info

#### 0.5.3 Convert lead → patient workflow
- One-click conversion
- Auto-fills patient form from lead data
- Marks lead as CONVERTED
- Links the two

#### 0.5.4 Real password authentication
- Add `passwordHash` field to User model
- Replace mock `demo` password with bcrypt
- Seed real passwords for existing users
- Update login endpoint

#### 0.5.5 File upload for Documents
- Add upload form to Documents page
- Use Supabase Storage for files
- Store public URLs in Document.filePath
- Allow download/view

#### 0.5.6 Database indexes
- Add indexes on `patients.stage`, `patients.country`, `patients.assignedCoordinatorId`
- Add indexes on `leads.status`, `leads.source`
- Add indexes on `tasks.assignedToId`, `tasks.status`
- Add index on `documents.category`
- Add index on `communications.patientId`
- Add index on `audit_logs.tenantId` (forward-looking)

#### 0.5.7 Activity timeline on patient
- New component showing all events chronologically
- Reuses existing data, just new view

#### Phase 0.5 deliverables
- 1 new module: Leads (UI)
- 1 new page: Patient detail
- 1 new workflow: Lead → Patient conversion
- 1 new feature: Real password auth
- 1 new feature: File upload
- Better DB performance (indexes)
- **Time saved:** ~1 hour/day immediately
- **Time investment:** ~2 weeks

---

### Phase 1 — Communication & Money (Weeks 3-10)

**Goal:** Replace all manual email/WhatsApp/invoicing with the system. The two biggest pain points for any medical tourism business.

#### 1.1 Multi-tenancy foundation (Week 3-4)
- Add `Tenant` model + `tenantId` on every table
- Tenant resolver middleware
- Subdomain-based tenant detection
- Update all existing API routes to scope by `tenantId`
- Migration script: assign all existing data to a default tenant

#### 1.2 Audit log (Week 4)
- New `AuditLog` table: `(id, tenantId, userId, action, entityType, entityId, before, after, createdAt)`
- Hook into Prisma middleware to auto-log every create/update/delete
- Audit log viewer UI in Settings
- Critical for SaaS compliance

#### 1.3 RBAC (Week 5)
- Update `User` model: `role` enum already exists, add `permissions: Json` for fine-grained
- Roles: SUPER_ADMIN, ADMIN, MANAGER, SALES, COORDINATOR, FINANCE, MARKETING, VIEWER
- Permission helpers: `can(user, 'patient:create')` returns boolean
- Sidebar/UI shows only allowed modules
- API routes enforce permissions

#### 1.4 Team management (Week 5-6)
- Invite team members via email
- Email templates for invitation
- Pending/active/deactivated states
- Bulk invite via CSV

#### 1.5 Invoicing module (Week 6-8)
**New `Invoice` model:**
```prisma
model Invoice {
  id          String   @id @default(cuid())
  tenantId    String
  patientId   String
  number      String   // "INV-2026-0042"
  status      InvoiceStatus  // DRAFT, SENT, VIEWED, PARTIAL, PAID, OVERDUE, CANCELLED
  currency    String   @default("USD")

  lineItems   InvoiceLineItem[]
  subtotal    Float
  taxRate     Float   @default(0)
  taxAmount   Float
  total       Float
  amountPaid  Float   @default(0)

  issueDate   DateTime @default(now())
  dueDate     DateTime

  sentAt      DateTime?
  viewedAt    DateTime?
  paidAt      DateTime?

  notes       String?
  terms       String?

  payments     Payment[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([tenantId, status])
  @@index([tenantId, patientId])
}

model InvoiceLineItem {
  id          String   @id @default(cuid())
  invoiceId   String
  invoice     Invoice  @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  description String
  quantity    Float
  unitPrice   Float
  total       Float

  category    LineItemCategory  // SURGERY, HOSPITAL, HOTEL, TRANSPORT, VISA, SERVICE
  refId       String?  // link to Patient, Hotel booking, etc.
}

model Payment {
  id          String   @id @default(cuid())
  tenantId    String
  invoiceId   String
  invoice     Invoice  @relation(fields: [invoiceId], references: [id])

  amount      Float
  currency    String
  method      PaymentMethod  // BANK_TRANSFER, CARD, CASH, CHEQUE, INSURANCE, OTHER
  reference   String?
  notes       String?

  receivedAt  DateTime @default(now())
  recordedById String
}
```

**Features:**
- Create quote → convert to invoice with one click
- Line items with categories (surgery, hotel, etc.) for reporting
- Multi-currency support (USD, EUR, GBP, AED, KES, INR)
- Tax support (per-line or per-invoice)
- Auto-numbering: `INV-{YEAR}-{SEQ}`
- PDF generation (use `@react-pdf/renderer`)
- Email invoice to patient (with payment link)
- Track payments: partial, full, overpayment
- Status: Draft → Sent → Viewed → Partial → Paid
- Overdue reminders (cron job)
- Public invoice URL (no login required to view)
- Commission calculation (auto-split invoice into hospital share, agency share)

#### 1.6 Quotes module (Week 8-9)
**New `Quote` model** (similar to Invoice but pre-deal):
- `Quote.status`: DRAFT, SENT, VIEWED, ACCEPTED, REJECTED, EXPIRED
- Multi-hospital comparison: single quote with options from 2-3 hospitals
- Treatment plan attached (text + attachments)
- Patient e-signature for acceptance
- Convert accepted quote → invoice + patient record
- Validity period (e.g., 30 days)
- PDF generation

#### 1.7 Communications / Inbox (Week 9-10)
**New models:**
```prisma
model Message {
  id           String   @id @default(cuid())
  tenantId     String
  channel      MessageChannel  // WHATSAPP, EMAIL, SMS, INTERNAL
  direction    MessageDirection  // INBOUND, OUTBOUND
  patientId    String?
  leadId       String?

  fromAddress  String?
  toAddress    String?
  subject      String?
  bodyHtml     String?
  bodyText     String?

  whatsappId   String?
  fromPhone    String?
  toPhone      String?
  body         String?

  status       MessageStatus  // QUEUED, SENT, DELIVERED, READ, FAILED

  threadId     String?
  inReplyToId  String?

  template     String?
  variables    Json?

  sentAt       DateTime?
  deliveredAt  DateTime?
  readAt       DateTime?

  externalId   String?
  errorMessage String?

  createdAt    DateTime @default(now())
  createdById  String?

  @@index([tenantId, patientId, createdAt])
  @@index([tenantId, leadId, createdAt])
  @@index([tenantId, threadId])
}

model MessageTemplate {
  id           String   @id @default(cuid())
  tenantId     String
  name         String
  channel      MessageChannel
  subject      String?
  bodyHtml     String?
  bodyText     String?
  variables    String[]
  category     TemplateCategory
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
}
```

**Features:**
- Unified inbox: all WhatsApp/email/SMS in one view
- Threaded conversations (group messages by patient/lead)
- Per-patient timeline: see every message ever sent/received
- Template library with merge fields (`{{patientName}}`, `{{treatment}}`)
- Schedule messages (send later)
- Auto-responders (e.g., "First inquiry → send welcome template")
- WhatsApp Business API integration (Twilio or 360dialog)
- Email: SendGrid or Resend
- SMS: Twilio (optional)
- Open tracking, click tracking, read receipts
- Failed message retry logic
- Bulk send (campaigns)

**Integrations to set up:**
- **Twilio** for WhatsApp Business API (~$0.005/msg)
- **Resend** for email (free tier: 3,000/month, then $20)
- **Twilio** for SMS (~$0.04/SMS)

#### Phase 1 deliverables
- 3 new modules: Invoicing, Quotes, Communications
- Foundation: Multi-tenancy, RBAC, Audit log, Team management
- 8 new DB entities
- 3rd-party integrations: Twilio, Resend
- **Time saved:** ~2-3 hours/day
- **Revenue impact:** Can actually invoice and collect payments

---

### Phase 2 — Operations & Logistics (Weeks 11-18)

**Goal:** Manage the full patient journey from arrival to departure.

#### 2.1 Visa management (Week 11-12)
**New `VisaApplication` model:**
- Per-country visa checklist (Kenya, UK, UAE, etc.)
- Document checklist with file upload
- Status: Documents collected → Submitted → In review → Approved → Stamped
- Embassy details per country
- FRRO registration (for India, after arrival)
- Visa expiry alerts
- Multiple applicants per case (patient + attendants)

#### 2.2 Accommodation module (Week 13-14)
**New `Hotel`, `HotelBooking` models:**
- Hotel partner list (room types, rates, photos, amenities)
- Per-patient booking calendar
- Multi-night bookings
- Auto-bill to patient invoice
- Special rates per hospital (negotiated contracts)
- Check-in/check-out tracking
- Cancellation policy

#### 2.3 Transport / Logistics (Week 15-16)
**New `TransportBooking`, `Vehicle` models:**
- Airport pickup scheduling
- Intra-city transport (hospital visits, sightseeing)
- Vehicle types (sedan, SUV, ambulance, wheelchair-accessible)
- Driver assignments
- Cost per km or flat rate
- Auto-bill to invoice

#### 2.4 Calendar / Appointments (Week 17-18)
**New `Appointment`, `Surgery` models:**
- Full calendar view (FullCalendar or react-big-calendar)
- Appointment types: consultation, pre-op, surgery, post-op, follow-up, Ayurveda session
- Doctor availability management
- Surgery scheduling with hospital + doctor + patient
- Pre-op checklist per appointment
- Reminders (email/SMS/WhatsApp 24h before)
- Conflict detection
- Resource allocation (operating room, equipment)

#### 2.5 Notifications (Week 18)
**New `Notification` model + real-time:**
- In-app notifications (bell icon)
- Email notifications (configurable)
- WhatsApp notifications (configurable)
- Per-user notification preferences
- Real-time updates via WebSocket (or polling fallback)

#### Phase 2 deliverables
- 4 new modules: Visa, Accommodation, Transport, Calendar
- 8 new DB entities
- **Time saved:** ~4-5 hours/day
- **Operational impact:** Can manage 10x more patients with same effort

---

### Phase 3 — Calendar, Staff & Insights (Weeks 19-26)

#### 3.1 Doctors / Staff module (Week 19-20)
- Doctor profiles, specializations
- Hospital affiliations
- Availability calendar
- Performance metrics
- Commission structure per doctor (referral fees)

#### 3.2 Reports / Analytics (Week 21-23)
**Pre-built reports:**
- Revenue by month, by country, by treatment
- Conversion funnel (lead → patient → completed)
- Patient acquisition cost
- Top performing hospitals
- Staff performance
- Commission payouts
- Outstanding invoices / aging
- Patient satisfaction

**Custom report builder:**
- Drag-and-drop columns
- Filter by any field
- Group by any field
- Date range
- Export CSV/Excel/PDF
- Schedule email reports

#### 3.3 Integrations Hub (Week 24-26)
**Third-party integrations:**
- **Hospital APIs** (if available — Aster, Amrita) — receive patient updates
- **Payment gateways** — Stripe, Razorpay (online invoice payment)
- **Calendar sync** — Google Calendar, Outlook
- **Accounting** — QuickBooks, Xero (sync invoices/payments)
- **Communication** — Twilio (WhatsApp/SMS), SendGrid/Resend (email)
- **Cloud storage** — Supabase Storage, S3, R2 (file uploads)
- **Video** — Zoom, Twilio Video, Daily.co (teleconsultation)
- **Marketing** — Google Ads, Facebook Ads (lead source attribution)
- **Analytics** — Google Analytics, Mixpanel, PostHog

#### Phase 3 deliverables
- 3 new modules: Doctors, Reports, Integrations
- 6 new DB entities
- **Time saved:** ~6-7 hours/day
- **Strategic impact:** Can make data-driven decisions

---

### Phase 4 — Inventory, Insurance, Outcomes (Weeks 27-34)

#### 4.1 Equipment / Inventory (Week 27-29)
- Wheelchair, oxygen, hospital bed tracking
- Rental vs purchase
- Maintenance logs
- Cost allocation per patient

#### 4.2 Insurance (Week 30-32)
- Insurance provider list
- Pre-authorization workflow
- Claim submission
- Coverage verification
- Co-pay tracking
- Settlement

#### 4.3 Outcomes / Quality (Week 33-34)
- Post-treatment surveys
- Complication tracking
- Recovery milestones
- Patient-reported outcomes (PROMs)
- Quality metrics
- NPS score

#### Phase 4 deliverables
- 3 new modules: Equipment, Insurance, Outcomes
- 6 new DB entities
- **Time saved:** ~8 hours/day
- **Compliance impact:** Insurance-ready, ISO 27001-ready

---

### Phase 5 — Patient & Partner Portals + SaaS Polish (Weeks 35-44)

#### 5.1 Patient portal (Week 35-38)
**Separate URL:** `patients.santos.care` (or `portal.santos.care`)
- View treatment plan, status, upcoming appointments
- Upload medical reports
- View/pay invoices online
- See itinerary (visa, hotel, transport, surgery, recovery)
- WhatsApp button to coordinator
- Multi-language (English, Arabic, Swahili, French initially)
- Mobile-first PWA
- Push notifications (PWA)

#### 5.2 Hospital Partner portal (Week 39-41)
**Separate URL:** `partners.santos.care`
- Receive patient referrals
- Upload medical reports / discharge summaries
- View commission structure
- Mark referrals as accepted/declined
- Update patient status
- Calendar of upcoming patients

#### 5.3 SaaS polish (Week 42-44)
- Billing & subscription management
- Plan tiers (Starter, Pro, Enterprise)
- Usage-based metering
- Invoice customers (the SaaS customers, not the medical patients)
- Stripe integration for SaaS billing
- Marketing site for `santos.care` becomes a SaaS marketing site
- Signup flow with 14-day trial
- Onboarding wizard
- Help docs / knowledge base
- Status page
- Support ticket system

#### Phase 5 deliverables
- 3 new portals: Patient, Hospital Partner, Public SaaS marketing
- 8 new DB entities
- **Time saved:** ~10 hours/day
- **Revenue impact:** Can sell to other companies

---

## 5. New Database Entities (Summary)

### Phase 0.5 (0 new entities, just quick wins)
No schema changes, just UI/auth/indexes.

### Phase 1 (10 new entities)
- `Tenant`
- `User.invitedById`, `User.lastActiveAt`, `User.permissions`
- `AuditLog`
- `Invoice`, `InvoiceLineItem`, `Payment`
- `Quote`, `QuoteLineItem`
- `Message`, `MessageTemplate`

### Phase 2 (8 new entities)
- `VisaApplication`, `VisaDocument`
- `Hotel`, `HotelRoom`, `HotelBooking`
- `Vehicle`, `TransportBooking`
- `Appointment`, `Surgery`
- `Notification`

### Phase 3 (6 new entities)
- `Doctor`, `DoctorAvailability`
- `SavedReport`, `ReportSchedule`
- `Integration`, `Webhook`

### Phase 4 (6 new entities)
- `Equipment`, `EquipmentRental`
- `InsuranceProvider`, `InsuranceClaim`
- `OutcomeSurvey`, `Complication`

### Phase 5 (8 new entities)
- `PatientUser` (for portal)
- `Itinerary`, `ItineraryItem`
- `HospitalPartner`, `PartnerUser`
- `Subscription`, `Plan`
- `SupportTicket`

**Total new entities:** ~38 (on top of existing 11)

---

## 6. Technology Choices (Confirmed)

| Need | Choice | Cost |
|---|---|---|
| Framework | Next.js 14 (App Router) | Free |
| Database | Supabase PostgreSQL | Free tier (500MB) |
| ORM | Prisma | Free |
| File storage | Supabase Storage | Free tier (1GB) |
| Auth | Custom JWT (jose) + bcryptjs | Free |
| WhatsApp | Twilio API | ~$0.005/msg |
| Email | Resend | Free tier 3k/mo, then $20 |
| SMS | Twilio | ~$0.04/SMS |
| Payments | Razorpay (India) + Stripe (international) | 2% per txn |
| Video | Daily.co or Zoom API | $0.004/min |
| Hosting | Vercel | Free tier |
| Analytics | PostHog (self-host) or Plausible | Free |
| Error tracking | Sentry | Free tier |
| PDF | `@react-pdf/renderer` | Free |
| Calendar UI | FullCalendar or react-big-calendar | Free |
| Charts | Recharts | Free |
| Forms | React Hook Form + Zod | Free |
| State | TanStack Query | Free |

**Total estimated monthly cost at scale (100 patients):** ~$50-100/mo

---

## 7. Permission System Design

### Roles (Phase 1)

```prisma
enum Role {
  SUPER_ADMIN   // cross-tenant admin (only Santos Care team)
  ADMIN         // tenant admin
  MANAGER       // team lead
  SALES         // handle leads, quotes
  COORDINATOR   // manage patient ops
  FINANCE       // invoices, payments
  MARKETING     // campaigns, analytics
  VIEWER        // read-only
}
```

### Permissions matrix

| Action | SUPER_ADMIN | ADMIN | MANAGER | SALES | COORDINATOR | FINANCE | MARKETING | VIEWER |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| View patients | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create patient | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Edit patient | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Delete patient | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| View leads | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ |
| Create lead | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ |
| Convert lead→patient | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| View invoices | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ |
| Create invoice | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |
| Record payment | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |
| Send email | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ |
| Send WhatsApp | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ |
| Manage team | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| View audit log | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Export data | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ |

### Implementation

```typescript
// lib/permissions.ts
const PERMISSIONS: Record<Role, string[]> = {
  SUPER_ADMIN: ['*'],
  ADMIN: [
    'patient:*', 'lead:*', 'invoice:*', 'payment:*', 'quote:*',
    'message:*', 'task:*', 'partner:*', 'document:*',
    'user:read', 'user:invite', 'settings:*', 'audit:read',
  ],
  MANAGER: [
    'patient:read', 'patient:create', 'patient:update',
    'lead:read', 'lead:create', 'lead:update',
    'invoice:read', 'invoice:create', 'invoice:update',
    'payment:read', 'payment:create',
    'message:*', 'task:*', 'partner:read', 'document:read',
  ],
  // ... etc
};

export function can(user: SessionUser, action: string, resource?: any): boolean {
  const perms = PERMISSIONS[user.role];
  if (perms.includes('*')) return true;
  if (perms.includes(action)) return true;
  const [resource_type] = action.split(':');
  if (perms.includes(`${resource_type}:*`)) return true;
  return false;
}
```

---

## 8. Success Metrics

Track these to know you're on the right track:

| Metric | Target | When |
|---|---|---|
| **Time to handle a new lead** | <30 min (vs 2 hours today) | Phase 1 |
| **Time to send a quote** | <15 min (vs 1 hour today) | Phase 1 |
| **Time to invoice** | <5 min (vs 30 min today) | Phase 1 |
| **Time to coordinate full patient journey** | <3 hours (vs 8 hours today) | Phase 2 |
| **Monthly active patients per coordinator** | 20+ (vs 5 today) | Phase 2 |
| **No data lost on cold starts** | 100% (achieved with Supabase) | ✅ |
| **Patient self-service rate** | 60% of inquiries handled in portal | Phase 5 |
| **SaaS customers** | 5 paying customers | Phase 5 |

---

## 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Solo dev burnout at 5-10h/week | High | High | Set realistic scope per phase. Don't try to build everything. |
| Multi-tenant migration breaks data | Medium | Critical | Do migration with full backup, test on staging first |
| Twilio/Resend costs scale unexpectedly | Medium | Medium | Set hard usage limits, alert at $100/mo |
| Patient portal scope creep | High | Medium | Build minimal portal in Phase 5, expand based on usage |
| WhatsApp Business API approval delays | Medium | Low | Can ship Phase 1 with email only, add WhatsApp later |
| SaaS customers don't materialize | Medium | Low | Project still works as single-tenant — no waste |
| Big refactor needed later | Low | High | Multi-tenant from day 1 means less rework |
| Security breach (auth bypass) | Low | Critical | Use Supabase RLS, audit log, regular pen testing |

---

## 10. Recommended Path Forward

I recommend we do these in this exact order:

1. **Quick wins this week** (25 hours): real auth, leads UI, file upload, patient detail page ← **STARTING NOW**
2. **Multi-tenancy + audit + RBAC** (2 weeks): the foundation everything else depends on
3. **Invoicing + Quotes** (3 weeks): start getting paid properly
4. **Communications / Inbox** (3 weeks): replace wa.me with real system
5. **Then continue with Phase 2-5** based on what you've learned

**Total time to v1.0:** ~12 months at 5-10h/week
**Time to "actually usable for real patients":** ~2-3 months

---

*This roadmap is a living document. Update quarterly based on what you learn from real patients using the system.*

*Document version: 1.0 — July 2, 2026*
