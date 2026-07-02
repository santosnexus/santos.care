# Improvement Backlog

Track ongoing improvements to the Heal India platform. Items are prioritized by impact and urgency.

**Status legend:** 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low · ✅ Done

---

## P0 — Critical (do first)

- ✅ **Public site built** — All 24 routes returning 200 (8 static + 8 treatments + 6 countries + 10 blog)
- ✅ **Ops Hub connected to Prisma** — All API routes use `lib/db.ts` store with mock/Prisma fallback
- ✅ **Session-based auth** — JWT cookies via jose; backward compat with Basic Auth
- ✅ **Lead capture** — Public form posts to `/api/leads/capture` (same-origin proxy)
- ✅ **Database schema** — 11 Prisma entities ready for Supabase
- ✅ **Supabase connected** — Real PostgreSQL DB live in production (japan region), all 12 tables created, demo data seeded, end-to-end lead flow verified
- ✅ **MERN migration plan** — Comprehensive 1400-line learning reference at `MERN_MIGRATION.md`

## P1 — High Priority (this week)

- 🟠 **Configure real Supabase** — Set DATABASE_URL, run migrations, seed
- 🟠 **Domain configuration** — Connect santos.care to public-site, ops.santos.care to ops-hub
- 🟠 **Google Search Console** — Submit sitemap, verify ownership
- 🟠 **Real testimonials** — Replace mock testimonials with real patient stories (with consent)
- 🟠 **Real hospital logos** — Add actual hospital images and credentials

## P2 — Medium Priority (this month)

- 🟡 **Google Analytics** — Add NEXT_PUBLIC_GA_ID to public site
- 🟡 **Conversion tracking** — Set up Google Ads + Facebook Pixel for lead source attribution
- 🟡 **Email integration** — Connect lead capture to SendGrid/Resend for confirmation emails
- 🟡 **WhatsApp Business API** — Replace wa.me links with proper Business API for automation
- 🟡 **Multi-language** — Add Arabic, Swahili, French versions for key markets
- 🟡 **PDF generation** — Auto-generate treatment plan PDFs for patients
- 🟡 **Patient portal** — Self-service portal for patients to check status, upload docs
- 🟡 **File upload** — Add real file upload to Documents module (currently filePath only)
- 🟡 **Image optimization** — Add real images to blog posts and treatment pages

## P3 — Low Priority (next quarter)

- 🟢 **CRM integrations** — Connect to Salesforce, HubSpot, or Zoho CRM
- 🟢 **Marketing automation** — Drip campaigns via ActiveCampaign or Mailchimp
- 🟢 **A/B testing** — Set up Vercel Edge Config for homepage testing
- 🟢 **Live chat** — Add Intercom or Crisp widget
- 🟢 **AI chatbot** — Initial triage chatbot for common questions
- 🟢 **Video testimonials** — Record and host patient video stories
- 🟢 **Hospital comparison tool** — Side-by-side comparison of partner hospitals
- 🟢 **Cost calculator** — Interactive cost calculator on homepage
- 🟢 **Insurance integration** — Connect with international insurance providers
- 🟢 **Telemedicine** — Video consultation feature for pre-treatment planning

## P4 — Backlog (future)

- 🟢 **Mobile apps** — iOS + Android for staff (Ops Hub)
- 🟢 **Offline mode** — PWA for Ops Hub in low-connectivity areas
- 🟢 **Advanced analytics** — Cohort analysis, retention metrics
- 🟢 **Multi-currency** — Display prices in patient's local currency
- 🟢 **API for partners** — Allow hospitals to push patient updates
- 🟢 **Real-time notifications** — WebSocket-based live updates in Ops Hub
- 🟢 **Compliance** — GDPR, HIPAA-equivalent, ISO 27001 documentation
- 🟢 **Audit log** — Track all data changes for compliance

---

## Recently Completed (this session)

- 2026-07-02 ✅ Built public-site with 24 routes (Next.js 14, Tailwind, TypeScript)
- 2026-07-02 ✅ Created 8 treatment pages with cost comparisons and procedures
- 2026-07-02 ✅ Created 6 country pages with localized content
- 2026-07-02 ✅ Imported 10 blog posts with SEO metadata
- 2026-07-02 ✅ Added lead capture form with WhatsApp fallback
- 2026-07-02 ✅ Built sitemap.xml and robots.txt
- 2026-07-02 ✅ Refactored Ops Hub API routes to use Prisma with mock fallback
- 2026-07-02 ✅ Added session-based auth (JWT in HTTP-only cookies)
- 2026-07-02 ✅ Created login page at `/login`
- 2026-07-02 ✅ Created database seed script
- 2026-07-02 ✅ Created health check API
- 2026-07-02 ✅ Created public lead capture endpoint
- 2026-07-02 ✅ Wrote comprehensive README.md and SETUP.md

---

## Next Action Items

1. **Set up Supabase** (1 hour) — Create project, get connection string, run migrations
2. **Deploy public-site to Vercel** (30 min) — Connect to santos.care
3. **Deploy ops-hub to Vercel** (30 min) — Connect to ops.santos.care
4. **Add real content** (2-3 hours) — Real testimonials, hospital logos, blog images
5. **Set up analytics** (1 hour) — Google Analytics, Search Console, conversion tracking
6. **Test end-to-end** (1 hour) — Submit lead, verify in Ops Hub, follow up via WhatsApp

**Estimated time to production-ready: 1-2 days** (with Supabase credentials)
