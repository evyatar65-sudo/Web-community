# Deployment Guide

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Vercel](https://vercel.com) account (recommended) or any Node.js host

---

## 1. Supabase Setup

### Database

1. Open your Supabase project → **SQL Editor**
2. Run the full contents of `supabase/schema.sql`

### Storage Bucket

In the SQL Editor, run:

```sql
INSERT INTO storage.buckets (id, name, public)
  VALUES ('uploads', 'uploads', true)
  ON CONFLICT (id) DO NOTHING;
```

> The bucket is set to **public** so avatars and archive images are accessible without authentication. The RLS policies in `schema.sql` restrict who can *upload*.

### Admin User

After your first user registers and is visible in the `profiles` table, promote them to admin:

```sql
UPDATE profiles SET role = 'admin' WHERE id = '<user-uuid>';
```

### Email Templates (optional)

To send approval notification emails, deploy a Supabase Edge Function.  
See the trigger template at the bottom of `supabase/schema.sql`.

---

## 2. Environment Variables

Create `.env.local` for local development:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

For production (Vercel), add these in **Project Settings → Environment Variables**.

---

## 3. Local Development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # verify production build passes
npm run lint      # ESLint check
```

---

## 4. Vercel Deployment

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

### Option B — GitHub Integration

1. Push to your GitHub repository
2. Import the project in [vercel.com/new](https://vercel.com/new)
3. Set environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy

The `vercel.json` in this repo configures security headers automatically.

---

## 5. Custom Domain

In Vercel → **Domains**, add your domain (e.g. `sayeret-nachal.org.il`).

Update the sitemap base URL in `app/sitemap.ts` and robots.txt origin in `app/robots.ts`.

---

## 6. Post-Deployment Checklist

- [ ] Database schema applied (`supabase/schema.sql`)
- [ ] Storage bucket created (`uploads`)
- [ ] Environment variables set in Vercel
- [ ] First admin user promoted in Supabase
- [ ] Contact form tested (check server logs)
- [ ] Registration flow tested end-to-end
- [ ] Custom domain configured (optional)
