# Svet za malo Astro frontend

Production Astro replacement for the original `svetzamalo-web` frontend. Content, book settings, feature flags and contact email are managed in Strapi.

## Stack

- Astro 6 with the Vercel adapter
- Tailwind CSS via `@tailwindcss/vite`
- Strapi 5 REST API
- Vercel Web Analytics and Speed Insights, enabled from Strapi `site-config.enableAnalytics`

## Local setup

```sh
npm install
cp .env.example .env
npm run dev
```

Required local env:

- `STRAPI_URL` - Strapi API base URL, usually `http://localhost:1337`
- `SITE_URL` / `PUBLIC_SITE_URL` - public frontend URL used for canonical URLs and sitemap generation
- `STRAPI_API_TOKEN` - optional, only if public endpoints are protected

## Production env on Vercel

Set these before deploying `main`:

```sh
SITE_URL=https://svetzamalo.cz
PUBLIC_SITE_URL=https://svetzamalo.cz
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
