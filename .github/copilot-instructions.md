# Lowcost Traveling – AI Coding Agent Instructions

## Project Overview

Budget travel blog built with **TanStack Start** (React meta-framework), **React 19**, **TanStack Router** (file-based routing), and **TanStack Query** for data fetching. Deploys as a **static site** with prerendered routes via `app.config.ts`.

## Architecture

### Routing & Data Flow
- **File-based routing** in `src/routes/` – files become routes (e.g., `articles.$slug.tsx` → `/articles/:slug`)
- **Route loaders** prefetch data server-side, then hydrate with React Query hooks for reactivity
- Pattern: loader fetches → `useLoaderData()` provides initial data → React Query hook takes over with `initialData`

```tsx
// Example from articles.$slug.tsx
loader: async ({ params, context }) => {
  const article = await fetchArticleBySlug(params.slug)
  return { article }
},
component: function Page() {
  const { article: loaderArticle } = Route.useLoaderData()
  const { data: article } = useArticleBySlug(slug, { initialData: loaderArticle })
}
```

### Content Architecture
- **Local content** in `src/content/` – articles (`data.ts`) and destinations used as fallback/development data
- **Strapi CMS integration** in `src/integrations/strapi/` – production content source
  - API functions in `api.ts` automatically fallback to local content when Strapi is unavailable
  - Set `VITE_STRAPI_URL` env var to enable Strapi; without it, local data is used
  - Hooks in `hooks.ts` abstract React Query patterns for all content types
- Types in `src/types/` – `Article`, `Destination`, `ContentBlock`, etc.

### Component Organization
| Directory | Purpose |
|-----------|---------|
| `src/components/ui/` | Shadcn primitives (Button, Input) using CVA variants |
| `src/components/layout/` | Header, Footer, Container – used in `__root.tsx` |
| `src/components/article/` | Article rendering (Hero, Section, FAQ, Places) |
| `src/components/monetization/` | AffiliateBox, NewsletterCta, LeadMagnet |
| `src/components/seo/` | Breadcrumbs, StructuredData for JSON-LD |

## Key Conventions

### Styling
- **Tailwind CSS v4** with CSS custom properties in `src/styles.css`
- Use `cn()` from `@/lib/utils` for conditional classes: `cn("base-class", condition && "active")`
- Design tokens: `--primary`, `--foreground`, `--background-secondary` (see styles.css)

### Internationalization
- Use `useTranslation()` hook from `@/lib/i18n` for **all** UI text
- Translation keys are nested: `t('articlesPage.title')`, `t('nav.destinations')`
- Add translations to **all 4 locales** (`en`, `cs`, `es`, `de`) when adding new keys
- Page-specific keys: `homePage.*`, `articlesPage.*`, `destinationsPage.*`, `about.*`

### Adding UI Components
```bash
pnpm dlx shadcn@latest add <component-name>
```

### Path Aliases
- `@/` maps to `src/` – always use `@/components`, `@/lib`, `@/types`, etc.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Static build (uses prerender routes from `app.config.ts`) |
| `npm run test` | Vitest tests |
| `npm run check` | Biome lint + format check |

## Testing Patterns

- Tests in `*.test.tsx` files alongside components
- Setup in `src/test/setup.ts` – includes jest-dom matchers and browser API mocks
- Wrap components needing React Query in test providers

## Static Prerendering

Add new routes to `app.config.ts` → `server.prerender.routes` array for static generation:
```ts
routes: ['/', '/destinations', '/articles', '/about', '/articles/new-article-slug']
```

## File Patterns for New Features

| Feature | Location | Notes |
|---------|----------|-------|
| New route | `src/routes/routename.tsx` | Use `createFileRoute()`, add to `app.config.ts` prerender |
| New article | `src/content/articles/data.ts` | Add entry + prerender route |
| New component | `src/components/<category>/` | Add barrel export to `index.ts` |
| New translations | `src/lib/i18n.ts` | Add keys to all 4 locale objects |

## Strapi Integration Notes

When Strapi CMS is connected (`VITE_STRAPI_URL` set):
- Content is fetched from Strapi API with automatic transformation
- Article/Destination types match local TypeScript definitions
- Images served from Strapi media library

Development mode (no Strapi):
- All `fetch*` functions in `src/integrations/strapi/api.ts` return local content
- Local data in `src/content/` serves as both fallback and seed content

## File Patterns for New Features

- **New route**: Create `src/routes/routename.tsx` with `createFileRoute()` export
- **New article**: Add entry to `src/content/articles/data.ts` + prerender route
- **New component**: Place in appropriate `src/components/` subdirectory with barrel export in `index.ts`
