# עמותת בוגרי סיירת נח"ל — Website

Next.js 14 (App Router) website for the Sayeret Nachal Veterans Association.

## Commands

```bash
npm run dev      # Development server on http://localhost:3000
npm run build    # Production build (must pass before pushing)
npm run lint     # ESLint check
```

## Environment Variables

Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Architecture

- **Framework**: Next.js 14 App Router, TypeScript
- **Styling**: Tailwind CSS with custom design tokens (see `tailwind.config.ts`)
- **Auth & DB**: Supabase (`lib/supabase/client.ts` for browser, `lib/supabase/server.ts` for server)
- **Language**: Hebrew, RTL (`dir="rtl"` on `<html>`)

## Key Directories

```
app/              # Pages (Next.js App Router)
  admin/          # Admin panel (adminOnly PrivateRoute)
  members/        # Members directory + [id] profile
  events/         # Events list + [id] detail with RSVP
  forum/          # Community forum
  archive/        # Historical archive
  alumni-benefits/ # Jobs, benefits, networking
  ...
components/
  layout/         # Navbar, Footer
  ui/             # PageHero, SectionTitle, MemberCard, EventCard,
                  # PrivateRoute, Skeleton
lib/
  supabase/       # client.ts, server.ts, middleware.ts
  types.ts        # TypeScript interfaces
supabase/
  schema.sql      # Full DB schema + RLS policies
```

## Auth Flow

1. User registers at `/register` → `status: 'pending'`
2. Admin approves at `/admin` → `status: 'approved'`
3. User can now access private pages

## User Roles & Statuses

- `status`: `pending` | `approved` | `rejected`
- `role`: `member` | `admin`

Private pages use `<PrivateRoute>`. Admin pages use `<PrivateRoute adminOnly>`.

## Database Setup

Run `supabase/schema.sql` in the Supabase SQL editor. Then create a storage bucket named `uploads`.

## Design System

Colors defined in `tailwind.config.ts`:
- `green-darkest` (#1a2e1a) — hero backgrounds
- `green-dark` (#2d5a27) — primary buttons
- `green-mid` (#3d7a35) — hover states
- `green-light` (#6aaa5e) — accents
- `green-pale` (#e8f5e3) — light backgrounds
- `gold` (#c9a84c) — memorial, donate CTA

## JSX Notes

Do **not** use `\"` inside JSX attribute strings (e.g., `title="...\"..."`).
Instead use single-quote delimiters (`title='...'`) or curly braces (`title={"..."}`).
