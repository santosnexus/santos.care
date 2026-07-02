# Installation & Deployment Guide

> Complete setup instructions for SantoCare Operations Hub

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Database Setup (Optional)](#database-setup-optional)
3. [Environment Configuration](#environment-configuration)
4. [Running the Application](#running-the-application)
5. [Production Build](#production-build)
6. [Vercel Deployment](#vercel-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Prerequisites

| Tool | Version | Check Command |
|------|---------|---------------|
| Node.js | 18.17+ | `node --version` |
| npm | 9+ | `npm --version` |
| Git | 2.0+ | `git --version` |

### Step 1: Clone the Repository

```bash
cd /mnt/d/santos.care
cd santocare-ops
```

### Step 2: Install Dependencies

```bash
npm install
```

If installation times out, try:

```bash
npm install --prefer-offline --no-audit --no-fund
```

Or use yarn:

```bash
yarn install
```

### Step 3: Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`.

---

## Database Setup (Optional)

The dashboard currently runs with mock data and does not require a database for the static demo. For production use with real data:

### Option 1: Supabase (Recommended)

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the connection string from Project Settings → Database
4. Add to `.env.local`:

```env
DATABASE_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
```

### Option 2: Local PostgreSQL

```bash
# Install PostgreSQL
sudo apt install postgresql

# Create database
sudo -u postgres createdb santocare

# Set DATABASE_URL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/santocare"
```

### Apply Prisma Schema

```bash
npx prisma generate
npx prisma db push
```

This creates the tables defined in `prisma/schema.prisma`.

---

## Environment Configuration

Create a `.env.local` file in the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/santocare"

# Authentication
NEXTAUTH_SECRET="generate-a-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=""

# Optional: WhatsApp Business API
WHATSAPP_BUSINESS_TOKEN=""
WHATSAPP_PHONE_NUMBER_ID=""
```

### Generating NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

---

## Running the Application

### Development Mode

```bash
npm run dev
```

Features enabled:
- Hot module replacement
- TypeScript type checking
- Source maps
- Detailed error overlay

### Production Build

```bash
npm run build
npm run start
```

Builds the application for production and starts the server.

### Lint

```bash
npm run lint
```

---

## Production Build

### Build Process

1. **Install production dependencies:**
   ```bash
   npm ci --only=production
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Start:**
   ```bash
   npm run start
   ```

### Build Output

The build produces:
- Optimized static and server-rendered pages
- API routes compiled to serverless functions
- CSS bundles
- Image optimization

---

## Vercel Deployment

Vercel is the recommended hosting platform for Next.js applications.

### One-Click Deploy

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select the repository
5. Configure environment variables
6. Click "Deploy"

### Manual CLI Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Production deploy
vercel --prod
```

### Environment Variables on Vercel

Set in Project Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | Your DB connection | Production, Preview |
| `NEXTAUTH_SECRET` | Random secret | Production |
| `NEXTAUTH_URL` | Your domain | Production |

### Custom Domain

1. Go to Project Settings → Domains
2. Add your domain (e.g., `ops.santos.care`)
3. Configure DNS:
   - For apex: A record to `76.76.21.21`
   - For subdomain: CNAME to `cname.vercel-dns.com`

### Recommended Subdomain

For the operations hub, deploy at a separate subdomain:
- `ops.santos.care`
- `internal.santos.care`
- `dashboard.santos.care`

This keeps the public marketing site (santos.care) separate from the internal operations hub.

---

## Troubleshooting

### Common Issues

#### 1. `next: not found` After Install

**Solution:** Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 2. PostCSS / Tailwind Errors

**Solution:** Ensure postcss.config.mjs uses correct plugins:
```javascript
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
export default config;
```

#### 3. TypeScript Errors

**Solution:** Run type check:
```bash
npx tsc --noEmit
```

#### 4. Build Timeout

**Solution:** Increase Node memory:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### 5. Port 3000 Already in Use

**Solution:** Use a different port:
```bash
npm run dev -- --port 3001
```

#### 6. Module Not Found Errors

**Solution:** Check tsconfig.json paths:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Getting Help

- Next.js docs: https://nextjs.org/docs
- Tailwind docs: https://tailwindcss.com/docs
- Prisma docs: https://www.prisma.io/docs
- Supabase docs: https://supabase.com/docs

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] All dependencies installed without errors
- [ ] `npm run build` completes successfully
- [ ] Environment variables configured
- [ ] Database schema applied
- [ ] Authentication tested
- [ ] API routes tested
- [ ] Mobile responsive verified
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Backup strategy in place
- [ ] Team access permissions set

---

**Last Updated:** June 29, 2026
