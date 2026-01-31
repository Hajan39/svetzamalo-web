# Strapi Integration

Integrace pro připojení frontendu k Strapi CMS.

## Konfigurace

### 1. Environment Variables

Vytvořte soubor `.env.local` v kořenovém adresáři projektu a přidejte:

```env
# Strapi API URL (default: http://localhost:1337)
VITE_STRAPI_URL=http://localhost:1337

# Strapi API Token (volitelné, pro chráněné endpointy)
# Vygenerujte v Strapi Admin: Settings > API Tokens
VITE_STRAPI_API_TOKEN=your_strapi_api_token
```

### 2. Strapi Setup

Ujistěte se, že máte v Strapi vytvořené content types:
- **Destination** - pro destinace
- **Article** - pro články

## Použití

### React Query Hooks

Nejjednodušší způsob, jak načítat data ze Strapi, je použít React Query hooky:

```tsx
import { useDestinations, useDestinationBySlug, useArticles } from '@/integrations/strapi'

// Načtení všech destinací
function DestinationsList() {
  const { data: destinations, isLoading, error } = useDestinations()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {destinations?.map(dest => (
        <li key={dest.id}>{dest.name}</li>
      ))}
    </ul>
  )
}

// Načtení destinace podle slug
function DestinationPage({ slug }: { slug: string }) {
  const { data: destination } = useDestinationBySlug(slug)

  if (!destination) return <div>Not found</div>

  return <h1>{destination.name}</h1>
}

// Načtení článků
function ArticlesList() {
  const { data: articles } = useArticles()

  return (
    <div>
      {articles?.map(article => (
        <article key={article.id}>
          <h2>{article.title}</h2>
          <p>{article.intro}</p>
        </article>
      ))}
    </div>
  )
}
```

### API Methods

Můžete také použít API metody přímo (bez React Query):

```tsx
import {
  fetchDestinations,
  fetchDestinationBySlug,
  fetchArticles,
  fetchArticleBySlug,
} from '@/integrations/strapi'

// V async funkci nebo useEffect
async function loadData() {
  const destinations = await fetchDestinations()
  const destination = await fetchDestinationBySlug('thailand')
  const articles = await fetchArticles()
  const article = await fetchArticleBySlug('thailand-guide')
}
```

### Pokročilé dotazy

Pro pokročilejší dotazy můžete použít `StrapiQueryParams`:

```tsx
import { strapiClient } from '@/integrations/strapi'

// Filtrování
const response = await strapiClient.get('/destinations', {
  filters: {
    continent: { $eq: 'asia' },
    type: { $eq: 'country' },
  },
  sort: ['name:asc'],
  pagination: {
    page: 1,
    pageSize: 10,
  },
  populate: '*',
})
```

## Dostupné Hooks

### Destinace
- `useDestinations()` - všechny destinace
- `useDestinationBySlug(slug)` - destinace podle slug
- `useDestinationById(id)` - destinace podle ID
- `useDestinationsByContinent(continent)` - destinace podle kontinentu

### Články
- `useArticles()` - všechny články
- `useArticleBySlug(slug)` - článek podle slug
- `useArticleById(id)` - článek podle ID
- `useArticlesByDestination(destinationId)` - články pro destinaci
- `useArticlesByTag(tag)` - články podle tagu
- `useLatestArticles(limit)` - nejnovější články

## TypeScript Typy

Všechny typy jsou plně typované:

```tsx
import type { Destination, Article } from '@/types'
import type { StrapiResponse, StrapiQueryParams } from '@/integrations/strapi'
```

## Error Handling

Všechny hooky a API metody automaticky zpracovávají chyby:

```tsx
const { data, error, isLoading } = useDestinations()

if (error) {
  // Zpracování chyby
  console.error('Failed to load destinations:', error)
}
```

## Caching

React Query automaticky cacheuje data s defaultní dobou expirace 5 minut. Můžete to změnit:

```tsx
useDestinations({
  staleTime: 1000 * 60 * 10, // 10 minut
})
```

## Migrace z lokálních dat

Pro postupné přechod z lokálních dat můžete použít feature flag:

```tsx
import { FEATURE_FLAGS } from '@/lib/constants'
import { useDestinations } from '@/integrations/strapi'
import { getDestinations } from '@/content'

function useDestinationsData() {
  const { data: strapiData } = useDestinations({
    enabled: FEATURE_FLAGS.useStrapi,
  })
  const localData = getDestinations()

  return FEATURE_FLAGS.useStrapi ? strapiData : localData
}
```
