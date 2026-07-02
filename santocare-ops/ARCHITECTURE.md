# Architecture Documentation

> Technical architecture and design decisions for SantoCare Operations Hub

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Patterns](#architecture-patterns)
3. [Data Model](#data-model)
4. [Routing Strategy](#routing-strategy)
5. [Component Architecture](#component-architecture)
6. [State Management](#state-management)
7. [Security Considerations](#security-considerations)
8. [Performance Strategy](#performance-strategy)
9. [Future Enhancements](#future-enhancements)

---

## System Overview

SantoCare Operations Hub is a Next.js 14 application built using the **App Router** pattern, leveraging server-side rendering for optimal performance and SEO, while maintaining rich client-side interactivity for the dashboard experience.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                       │
│                   (ops.santos.care)                          │
└─────────────────────────────────────────────────────────────┘
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   PUBLIC     │    │  INTERNAL   │    │   STAFF     │
│   PAGES      │    │  DASHBOARD  │    │   PORTAL    │
│              │    │             │    │             │
│ • Login      │    │ • Dashboard │    │ • My Tasks   │
│ • Stakeholder│    │ • Pipeline  │    │ • Schedule   │
│   Reports    │    │ • Partners  │    │ • Patients   │
└──────────────┘    │ • Marketing │    └──────────────┘
                    │ • Analytics │
                    │ • Settings  │
                    └──────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │   DATABASE   │
                    │  (PostgreSQL)│
                    │   Supabase   │
                    └──────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │  EXTERNAL    │
                    │  SERVICES    │
                    │              │
                    │• WhatsApp    │
                    │• Email       │
                    │• File Store  │
                    └──────────────┘
```

### Tech Stack Rationale

| Choice | Why |
|--------|-----|
| **Next.js 14 App Router** | Modern routing, server components, API routes in one framework |
| **TypeScript** | Catch errors at compile time, especially for healthcare data |
| **Tailwind CSS** | Rapid development, consistent design, small bundle |
| **Recharts** | Declarative charts that work well with React state |
| **PostgreSQL** | ACID compliance for financial and medical records |
| **Prisma** | Type-safe database queries, automatic migrations |
| **Vercel** | Zero-config Next.js deployment, edge functions |

---

## Architecture Patterns

### 1. Route Groups

The app uses Next.js **Route Groups** (parentheses in folder names) to organize routes without affecting URL structure:

```
src/app/
├── (dashboard)/          # Routes requiring authentication + dashboard layout
│   ├── layout.tsx        # Sidebar + main content wrapper
│   ├── page.tsx          # / → Dashboard home
│   ├── patients/         # /patients
│   ├── tasks/            # /tasks
│   └── ...
├── (auth)/               # Future: login, register, forgot password
└── api/                  # API routes (no UI)
```

**Benefit:** Different layouts for authenticated vs. public areas, clean URL structure.

### 2. Server Components vs. Client Components

- **Server Components (default)**: Static content, SEO-friendly pages
- **Client Components (`"use client"`)**: Interactive dashboards, forms, charts

All dashboard pages use client components because they require:
- Real-time state updates
- Form handling
- Interactive charts
- Filters and search

### 3. Component Composition

The UI follows a three-tier composition:

```
Page (data orchestration)
  └─ Section Component (data transformation)
       └─ UI Component (presentation)
            └─ Primitive (Button, Input, etc.)
```

Example:
```
PatientsPage
  └─ PatientKanban
       └─ Card
            └─ CardHeader, CardContent
```

### 4. Mock-First Development

The app is built with mock data embedded in components, allowing:
- Immediate visual feedback without database setup
- Easy unit testing
- Demo-ready for stakeholders
- Smooth transition to real API when database is connected

---

## Data Model

The Prisma schema defines 11 core entities with relationships:

### Core Entities

```
User ─────┬────── Patient ──── Task
          │         │
          │         ├── StageChange
          │         ├── Document
          │         ├── Note
          │         └── Communication
          │
          ├── Task
          │
          └── Document, Note

Patient ──── Partner (via Document/Note)

Lead (independent, may convert to Patient)

RoadmapItem (independent)
AnalyticsEvent (independent, for tracking)
```

### Entity Details

#### User
- Authentication and role-based access
- 5 roles: Admin, Manager, Coordinator, Marketing, Stakeholder

#### Patient
- 10-stage pipeline (enum: PipelineStage)
- Multi-currency cost tracking
- Travel timeline (inquiry → discharge)
- Follow-up schedule array
- Linked documents, notes, communications

#### Task
- 4 types: Patient, General, Marketing, Partner
- 4 priorities: Low, Medium, High, Urgent
- 4 statuses: Pending, In Progress, Completed, Cancelled
- Optional patient linkage
- Recurring task support

#### Partner
- 6 categories: Hospital, Ayurveda, Lab, Transport, Nursing, Equipment
- Agreement status tracking
- Performance metrics (revenue, satisfaction)

#### Lead
- 8 sources: WhatsApp, Website, Facebook, Google Ads, Referral, etc.
- 5 statuses: New, Contacted, Qualified, Converted, Lost
- UTM tracking for marketing attribution
- Conversion to Patient

#### Document
- Polymorphic (links to Patient, Partner, or both)
- File metadata (path, type, size)
- Public visibility for stakeholder access

#### Note
- Polymorphic (Patient or Partner)
- Author tracking

#### Communication
- 4 types: WhatsApp, Email, Call, Message
- 2 directions: Inbound, Outbound
- Patient-linked

#### RoadmapItem
- Phase-based milestone tracking
- Progress percentage
- Status: Pending, In Progress, Completed, Delayed

---

## Routing Strategy

### App Router Structure

```
/                          → Dashboard home
/patients                  → Patient pipeline (Kanban + Table)
/tasks                     → Task management
/partners                  → Partner network
/marketing                 → Marketing module (Leads, Campaigns, Content)
/documents                 → Document repository
/analytics                 → Analytics dashboard
/roadmap                   → 90-day roadmap tracker
/settings                  → System settings

/api/patients              → GET, POST patients
/api/patients/[id]         → GET, PUT, DELETE single patient
/api/tasks                 → GET, POST tasks
/api/tasks/[id]            → GET, PUT, DELETE single task
/api/partners              → GET, POST partners
/api/partners/[id]         → GET, PUT, DELETE single partner
/api/leads                 → GET, POST leads
/api/leads/[id]            → GET, PUT, DELETE single lead
/api/documents             → GET, POST documents
/api/documents/[id]        → GET, DELETE single document
```

### API Design

RESTful conventions:
- `GET /api/{resource}` — List with optional filters
- `POST /api/{resource}` — Create
- `GET /api/{resource}/{id}` — Read single
- `PUT /api/{resource}/{id}` — Update
- `DELETE /api/{resource}/{id}` — Delete

**Example:** `GET /api/patients?stage=CONFIRMATION&country=Kenya`

### Middleware (Planned)

- Authentication check on `(dashboard)` routes
- Role-based access control
- Rate limiting on API routes
- Request logging

---

## Component Architecture

### UI Primitives (`src/components/ui/`)

Self-contained, design-system components:

| Component | Purpose | Variants |
|-----------|---------|----------|
| `Button` | Action trigger | default, destructive, outline, ghost, link |
| `Card` | Content container | header, content, footer |
| `Badge` | Status indicator | default, success, warning, info, destructive |
| `Input` | Text input | text, email, tel, number, date |
| `Label` | Form label | — |
| `Select` | Dropdown | native select with custom styling |
| `Textarea` | Multi-line input | — |
| `Dialog` | Modal overlay | with header, footer |
| `Tabs` | Tabbed interface | list, trigger, content |
| `Table` | Data table | header, body, row, cell |
| `Avatar` | User display | image, fallback |
| `Progress` | Progress bar | linear |
| `Skeleton` | Loading state | — |

### Layout Components

- `Sidebar` — Main navigation with mobile drawer support
- `MobileHeader` — Mobile-only header with menu toggle

### Design Tokens

CSS custom properties enable theming and consistency:

```css
--background, --foreground
--card, --card-foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--destructive, --destructive-foreground
--border, --input, --ring
--sidebar, --sidebar-foreground
--chart-1, --chart-2, --chart-3, --chart-4, --chart-5
```

All defined in `globals.css` for both light and dark modes.

---

## State Management

### Local State (useState)

For component-local state:
- Form values
- Modal open/close
- Filter selections
- View modes (Kanban/Table)

### Server State (Planned: React Query)

For data fetching and caching:
- Patient lists
- Task lists
- Partner data

### URL State (Search Params)

For shareable state:
- Filter combinations
- Pagination
- Active tab

### Form State (Planned: react-hook-form + zod)

For complex forms with validation:
- Add Patient
- Add Task
- Add Partner

---

## Security Considerations

### Data Classification

| Sensitivity | Examples | Access |
|-------------|----------|--------|
| **High** | Medical records, payment info | Admin + assigned coordinator only |
| **Medium** | Patient contact, treatment plans | Internal staff |
| **Low** | Hospital names, public content | All staff + stakeholders |

### Planned Security Measures

1. **Authentication**
   - NextAuth.js with credentials provider
   - JWT session strategy
   - 24-hour session expiry

2. **Authorization (RBAC)**
   - Role-based route protection
   - Field-level access control
   - Audit logging for sensitive operations

3. **Data Protection**
   - HTTPS only in production
   - Environment variable encryption
   - Database connection string in Vercel env
   - No PHI (Personal Health Information) in logs

4. **API Security**
   - Rate limiting
   - CSRF protection
   - Input validation with zod
   - SQL injection prevention via Prisma

---

## Performance Strategy

### Current Optimizations

1. **Code Splitting**
   - App Router automatic per-page bundles
   - Dynamic imports for heavy components
   - Tree-shaking of unused code

2. **Image Optimization**
   - Next.js Image component (planned)
   - WebP format support
   - Lazy loading

3. **CSS Optimization**
   - Tailwind purges unused classes in production
   - Critical CSS inlined

4. **Caching**
   - Browser cache for static assets
   - API route caching where appropriate
   - React Query for client-side cache (planned)

### Future Optimizations

- Database query optimization with proper indexes
- Server-side rendering for patient details
- Edge functions for API routes
- CDN for static assets
- WebSocket for real-time updates

---

## Future Enhancements

### Phase 2 (Weeks 5-8)

- Real database integration with Supabase
- Authentication via NextAuth
- Real-time updates with Supabase subscriptions
- Document upload to Supabase Storage
- Email integration for task assignments

### Phase 3 (Weeks 9-12)

- WhatsApp Business API integration for patient comms
- Marketing automation
- Lead capture from website forms
- SEO analytics integration

### Phase 4 (Weeks 13+)

- Mobile app (React Native)
- Advanced analytics with ML predictions
- AI-powered treatment recommendations
- Multi-language support (English, Arabic, French)
- Telemedicine integration

### Long-term (6-12 months)

- EHR (Electronic Health Records) integration
- Insurance claim management
- Multi-currency support
- Compliance reporting (HIPAA-equivalent for India)
- Patient portal (separate from internal hub)

---

**Last Updated:** June 29, 2026
**Architecture Version:** 1.0
