# Setup Guide

Step-by-step instructions to take this project from code to live production.

## 1. Prerequisites

- Node.js 20+ (`node --version`)
- npm 10+ (`npm --version`)
- A [Supabase](https://supabase.com) account (free tier works)
- A [Vercel](https://vercel.com) account
- A domain (`santos.care`) and a subdomain (`ops.santos.care`)

## 2. Install Dependencies

From the project root:

```bash
cd public-site && npm install
cd ../santocare-ops && npm install
```

## 3. Set Up Supabase (Ops Hub Database)

1. Create a new Supabase project: https://supabase.com/dashboard
2. Wait for the project to provision (~2 minutes)
3. Go to **Settings → Database**
4. Copy the **Connection string** (Transaction pooler, port 6543)
5. Copy the **Direct connection** string (port 5432) — for migrations

## 4. Configure Ops Hub Environment

In `santocare-ops/.env`:

```bash
# Database (from Supabase)
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Auth (generate: openssl rand -base64 32)
NEXTAUTH_SECRET="<32-char random string>"

# Production URL
NEXTAUTH_URL="https://ops.santos.care"
```

## 5. Apply Database Schema

```bash
cd santocare-ops
npx prisma db push        # Creates all 11 tables
npx prisma db seed        # Populates with demo data
```

## 6. Verify Locally

```bash
cd santocare-ops
npm run dev
```

Visit `http://localhost:3000/api/health` — should return:
```json
{"status":"ok","database":"connected","mode":"production"}
```

Visit `http://localhost:3000/login` and log in with:
- Email: `admin@santos.care`
- Password: `demo`

## 7. Configure Public Site Environment

In `public-site/.env.local`:

```bash
NEXT_PUBLIC_OPS_HUB_URL="https://ops.santos.care"   # or http://localhost:3000 for local dev
NEXT_PUBLIC_SITE_URL="https://santos.care"
```

## 8. Test Lead Capture

```bash
# Start public site
cd public-site && npm run dev   # http://localhost:3001

# In another terminal
curl -X POST http://localhost:3000/api/leads/capture \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"+1 555 1234567","country":"USA","treatmentInterest":"Cardiac","source":"WEBSITE"}'
```

Should return `{"success":true,"lead":{"id":"...","name":"Test User"}}`.

## 9. Deploy to Vercel

### Public Site

```bash
cd public-site
npx vercel --prod
```

In Vercel dashboard:
- Add domain: `santos.care` (and `www.santos.care` redirecting to it)
- Add environment variables from `.env.local`

### Ops Hub

```bash
cd santocare-ops
npx vercel --prod
```

In Vercel dashboard:
- Add domain: `ops.santos.care`
- Add environment variables from `.env`
- **Important:** Set `NEXTAUTH_URL` to `https://ops.santos.care`

## 10. Domain Configuration

In your DNS provider, add:

| Type | Name | Value |
|------|------|-------|
| CNAME | @ | cname.vercel-dns.com |
| CNAME | www | cname.vercel-dns.com |
| CNAME | ops | cname.vercel-dns.com |

(Or use Vercel as your DNS provider for auto-configuration.)

## 11. Post-Launch Checklist

- [ ] Visit `https://santos.care` — confirm it loads
- [ ] Submit test lead — confirm it appears in Ops Hub `/leads`
- [ ] Visit `https://ops.santos.care` — log in and verify access
- [ ] Visit `https://santos.care/sitemap.xml` — verify 30+ URLs
- [ ] Submit `https://santos.care` to Google Search Console
- [ ] Submit `https://santos.care/sitemap.xml` to Google Search Console
- [ ] Set up monitoring (Vercel Analytics, Sentry, etc.)
- [ ] Configure custom WhatsApp number (update `lib/utils.ts`)
- [ ] Configure real email sender for contact form
- [ ] Update `README.md` and `SETUP.md` with real credentials

## 12. Operational Tips

### Daily
- Check Ops Hub `/dashboard` for new leads
- Follow up on `NEW` and `CONTACTED` leads within 24 hours

### Weekly
- Review pipeline conversion rates
- Add new patients who converted from leads
- Update partner performance metrics

### Monthly
- Run `npm update` in both apps to keep dependencies fresh
- Review blog traffic in Google Analytics
- Backup Supabase database (automatic on paid plans)
- Review and update partner agreements

## 13. Troubleshooting

### Build fails
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Database connection fails
```bash
# Verify DATABASE_URL is correct
echo $DATABASE_URL
# Test connection
npx prisma db push
```

### Auth issues
```bash
# Regenerate NEXTAUTH_SECRET
openssl rand -base64 32
```

### Public site can't reach Ops Hub
- Check CORS configuration on Ops Hub (currently allows same-origin only)
- For cross-origin, add `cors` middleware to Ops Hub
- Use Vercel rewrites to proxy requests

---

Need help? Open an issue or contact dev@santos.care.
