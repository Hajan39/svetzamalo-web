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
- `STRAPI_API_TOKEN` - optional, if Strapi endpoints are protected

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
```

Also enable Vercel Web Analytics and Speed Insights in the Vercel project. Tracking scripts are rendered only when `enableAnalytics` is enabled in Strapi Site Config.

## Checks

```sh
npm run check
npm run build
```

After local Vercel builds, `.vercel/output` is generated temporarily and ignored by git.

## Release note

This app is intended to replace the original frontend in `github.com/Hajan39/svetzamalo-web`. Keep the original code in a branch such as `old`, then deploy this Astro code from `main`.
