# SantoCare Operations Hub

Internal operations dashboard for **Heal India Medi Tourism (santos.care)** — a comprehensive Next.js application for managing the patient pipeline, tasks, partners, marketing, and analytics for a medical tourism business.

> See [README.md](./README.md) for complete documentation, [INSTALLATION.md](./INSTALLATION.md) for setup, [ARCHITECTURE.md](./ARCHITECTURE.md) for technical design, [USER_GUIDE.md](./USER_GUIDE.md) for usage, [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API reference, and [BUILD_LOG.md](./BUILD_LOG.md) for development progress.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Features

- 9 operational modules (Dashboard, Patients, Tasks, Partners, Marketing, Documents, Analytics, Roadmap, Settings)
- Patient pipeline with 10-stage Kanban + Table views
- Task management with priorities and assignments
- Partner network (hospitals, ayurveda, labs, transport, nursing, equipment)
- Marketing module (leads, campaigns, content calendar)
- Document repository
- Analytics dashboard with charts
- 90-day implementation roadmap tracker
- RESTful API routes

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React
- Prisma + PostgreSQL (Supabase)
- Vercel hosting

## Status

Phase 1 (Foundation) complete. Currently running on mock data. Real database integration coming in Phase 2.
