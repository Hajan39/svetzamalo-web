# Svět za málo – web

Astro 6 frontend for [svetzamalo.cz](https://svetzamalo.cz): Czech budget-travel guides plus a
small shop that sells one PDF book and gives away a lead-magnet ebook.

## Stack

- **Astro 6** (`output: "server"`) on the Vercel adapter, Tailwind CSS 4
- **Sanity** – articles, destinations (`country`), continents, affiliate links, site config
- **Neon Postgres** – orders, leads, payment events, admin sessions (`db/schema.sql`)
- **Comgate** – card payments; bank transfer with QR (SPAYD) as the fallback
- **Resend** – transactional e-mail (free ebook, bank instructions, paid book link, admin login)
- Vercel Web Analytics + Speed Insights, rendered when `enableAnalytics` is on in site config

## Local setup

```sh
npm install
cp .env.example .env   # fill in at least the Sanity project and DATABASE_URL
npm run dev
```

`.env.example` documents every variable. Without `DATABASE_URL` the site renders but the shop
refuses orders and leads; without `RESEND_API_KEY` orders are stored but no mail goes out and the
download link has to be copied from `/admin`.

Run `db/schema.sql` once in the Neon SQL editor before the first order.

## Shop flow

- `/book/kompletni-pruvodce` – sales page → `POST /api/orders`
  - `comgate` → redirect to the gateway → `POST /api/comgate/callback` marks the order paid and
    e-mails the download link (`/api/ebook/download?token=…`)
  - `bank_transfer` → `/book/success` with QR + variable symbol → marked paid manually in `/admin`
- `LeadCapture` forms → `POST /api/leads` → free ebook e-mail
- `/admin` – orders, leads, gateway events, readiness checks. Login by e-mailed one-time link
  (`ADMIN_EMAILS`) or the fallback `ADMIN_PASSWORD`.

The paid PDF must live outside `public/` (`PAID_BOOK_FILE_URL`); `/admin` warns if it is exposed.

## Caching

Public SSR pages send `public, max-age=0, s-maxage=3600, stale-while-revalidate=86400` so the
Vercel CDN serves them. The middleware sends `no-store` for API routes, draft mode, URLs with a
query string, `/ebook/download`, `/book/success` and affiliate redirects. Published Sanity reads
go through Sanity's CDN; draft mode bypasses it.

Astro's built-in origin check is off (`checkOrigin: false`) because it rejected Comgate's
server-to-server webhook; the equivalent check lives in `src/middleware.ts` and exempts that path.

## Checks

```sh
npm run check   # astro check
npm test        # vitest
npm run build
```
