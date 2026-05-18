# Svet za malo Astro frontend

Production Astro replacement for the original `svetzamalo-web` frontend.

Content model is hybrid:
- Sanity is primary for editorial content (articles, destinations)
- Strapi stays primary for operational features (site config, leads/orders, ebook flow)
- Strapi is also fallback for editorial reads when Sanity is unavailable or missing data

## Stack

- Astro 6 with the Vercel adapter
- Tailwind CSS via `@tailwindcss/vite`
- Sanity Content Lake + `@sanity/client`
- Strapi 5 REST API (operations + fallback)
- Vercel Web Analytics and Speed Insights, enabled from Strapi `site-config.enableAnalytics`

## Local setup

```sh
npm install
cp .env.example .env
npm run dev
```

Required local env:

- `PUBLIC_CONTENT_SOURCE` - `sanity` (default, Sanity primary + Strapi fallback) or `strapi` (Strapi only)
- `PUBLIC_SANITY_PROJECT_ID` - Sanity project id
- `PUBLIC_SANITY_DATASET` - Sanity dataset, usually `production`
- `PUBLIC_SANITY_API_VERSION` - Sanity API version, e.g. `2025-01-01`
- `PUBLIC_SANITY_READ_TOKEN` - optional, for private Sanity reads
- `SANITY_API_TOKEN` - optional server-side token for Sanity
- `STRAPI_URL` - Strapi API base URL, usually `http://localhost:1337`
- `SITE_URL` / `PUBLIC_SITE_URL` - public frontend URL used for canonical URLs and sitemap generation
- `STRAPI_API_TOKEN` - optional, if Strapi endpoints are protected; must allow creating book interests and orders when used
- `BOOK_ORDER_TEST_EMAILS` - optional comma-separated exact email allowlist for testing ebook lead, bank transfer, or gateway flow without creating Strapi records or sending emails. Add `?testMode=1` to `/book` to reveal disabled book flows in the UI.
- `BOOK_ORDER_TEST_VARIABLE_SYMBOL` - optional variable symbol used by the test order bypass, default `9999999999`

## Production env on Vercel

Set these before deploying `main`:

```sh
SITE_URL=https://svetzamalo.cz
PUBLIC_SITE_URL=https://svetzamalo.cz
PUBLIC_CONTENT_SOURCE=sanity
PUBLIC_SANITY_PROJECT_ID=bh335dwp
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2025-01-01
PUBLIC_SANITY_READ_TOKEN=<optional-token>
SANITY_API_TOKEN=<optional-server-token>
STRAPI_URL=https://<production-strapi-host>
STRAPI_API_TOKEN=<optional-token>
STRAPI_GET_CACHE_TTL_SECONDS=3600
STRAPI_GET_CACHE_MAX_ENTRIES=100
```

For Comgate checkout, enable and configure gateway fields in Strapi **Nastavení webu**. The web sends UI value `comgate` to its local order API, then the server maps it to Strapi `paymentMethod: "gateway"` and redirects to the Comgate URL returned by Strapi.

Also enable Vercel Web Analytics and Speed Insights in the Vercel project. Tracking scripts are rendered only when `enableAnalytics` is enabled in Strapi Site Config.

## Strapi API request budget

Strapi is used only for operational features: site config, page/email copy, lead capture, orders, and ebook token downloads. Editorial traffic is served from Sanity.

To stay under low Strapi API limits, the frontend uses two cache layers:

- Public SSR pages send `Cache-Control: public, max-age=0, s-maxage=3600, stale-while-revalidate=86400`, so Vercel/CDN can reuse rendered pages instead of calling Strapi on every page view.
- Strapi GET calls are cached in the server process for `STRAPI_GET_CACHE_TTL_SECONDS` seconds. Default is `3600`; set `0` to disable during debugging.

The middleware deliberately sends `no-store` for API routes, draft mode, URLs with query strings, `/ebook/download`, `/book/success`, and affiliate redirects. Those paths may contain tokens, emails, payment references, or tracking decisions and must not be CDN-cached.

Recommended production values for a 2.5k monthly Strapi request budget:

```sh
STRAPI_GET_CACHE_TTL_SECONDS=3600
STRAPI_GET_CACHE_MAX_ENTRIES=100
```

If the site gets more traffic, prefer increasing CDN cache duration or prerendering stable pages before moving more runtime reads back to Strapi.

## Checks

```sh
npm run check
npm run build
```

After local Vercel builds, `.vercel/output` is generated temporarily and ignored by git.

## Release note

This app is intended to replace the original frontend in `github.com/Hajan39/svetzamalo-web`. Keep the original code in a branch such as `old`, then deploy this Astro code from `main`.
