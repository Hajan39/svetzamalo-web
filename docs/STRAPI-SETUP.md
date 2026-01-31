# Strapi CMS – Struktura obsahu

Tento dokument popisuje kompletní strukturu content typů, které je potřeba vytvořit ve Strapi pro správné fungování s frontendem.

## 🚀 Rychlý start

```bash
# 1. Vytvoř Strapi projekt (ve složce vedle frontendu)
npx create-strapi-app@latest strapi-backend --quickstart

# 2. Spusť Strapi
cd strapi-backend
npm run develop

# 3. Otevři admin panel
# http://localhost:1337/admin

# 4. Nastav .env.local ve frontendu
VITE_STRAPI_URL=http://localhost:1337
```

---

## 📦 Content Types

### 1. Destination (Destinace)

**Collection Type:** `destination`

| Pole | Typ | Povinné | Popis |
|------|-----|---------|-------|
| `name` | Text (Short) | ✅ | Název destinace (např. "Thailand") |
| `slug` | UID (from name) | ✅ | URL slug (auto-generováno) |
| `type` | Enumeration | ✅ | `country`, `region`, `city`, `microstate` |
| `continent` | Enumeration | ✅ | `europe`, `asia`, `africa`, `caribbean`, `northAmerica`, `southAmerica`, `oceania` |
| `flagEmoji` | Text (Short) | | Emoji vlajky (např. 🇹🇭) |
| `heroImage` | Media (Single) | | Hlavní obrázek |
| `languages` | JSON / Text | ✅ | Pole jazyků ["Thai", "English"] |
| `timezone` | Text (Short) | | Časové pásmo (např. "UTC+7") |
| `visaInfo` | Text (Long) | | Informace o vízu |
| `bestTimeToVisit` | Text (Short) | | Nejlepší období (např. "November to February") |
| `currency` | Component | ✅ | Komponenta měny (viz níže) |
| `seo` | Component | ✅ | SEO metadata (viz níže) |
| `articles` | Relation (hasMany) | | Propojení na články |

---

### 2. Article (Článek)

**Collection Type:** `article`

| Pole | Typ | Povinné | Popis |
|------|-----|---------|-------|
| `title` | Text (Short) | ✅ | Nadpis článku |
| `slug` | UID (from title) | ✅ | URL slug |
| `articleType` | Enumeration | ✅ | `destination-guide`, `place-guide`, `practical-info`, `itinerary`, `list` |
| `tags` | JSON / Text | | Pole tagů ["beaches", "budget"] |
| `coverImage` | Media (Single) | | Hlavní obrázek článku |
| `intro` | Text (Long) | ✅ | Úvodní odstavec |
| `sections` | Component (Repeatable) | ✅ | Sekce článku (viz níže) |
| `places` | Component (Repeatable) | | Místa na mapě |
| `faq` | Component (Repeatable) | | FAQ položky |
| `destination` | Relation (belongsTo) | | Propojení na destinaci |
| `seo` | Component | ✅ | SEO metadata |
| `publishedAt` | DateTime | | Datum publikace |

---

## 🧩 Components (Komponenty)

### shared.currency

| Pole | Typ | Popis |
|------|-----|-------|
| `code` | Text (Short) | Kód měny (EUR, USD, THB) |
| `name` | Text (Short) | Název (Euro, Thai Baht) |
| `symbol` | Text (Short) | Symbol (€, $, ฿) |
| `exchangeRateToUsd` | Decimal | Kurz k USD |
| `budgetPerDay` | Component | Denní rozpočty |

### shared.budget-per-day

| Pole | Typ | Popis |
|------|-----|-------|
| `budget` | Integer | Budget cestování ($/den) |
| `midRange` | Integer | Střední třída ($/den) |
| `luxury` | Integer | Luxus ($/den) |

### shared.seo

| Pole | Typ | Popis |
|------|-----|-------|
| `metaTitle` | Text (Short) | Meta title |
| `metaDescription` | Text (Long) | Meta description |
| `keywords` | JSON | Pole klíčových slov |
| `ogTitle` | Text (Short) | Open Graph title |
| `ogDescription` | Text (Long) | Open Graph description |
| `ogImage` | Media (Single) | Open Graph obrázek |

### article.section

| Pole | Typ | Popis |
|------|-----|-------|
| `sectionId` | Text (Short) | ID sekce (getting-there, where-to-stay) |
| `title` | Text (Short) | Nadpis sekce |
| `content` | Rich Text / Markdown | Obsah sekce |

### article.place

| Pole | Typ | Popis |
|------|-----|-------|
| `name` | Text (Short) | Název místa |
| `description` | Text (Long) | Popis |
| `latitude` | Decimal | Zeměpisná šířka |
| `longitude` | Decimal | Zeměpisná délka |
| `placeType` | Enumeration | `beach`, `landmark`, `city`, `nature`, `restaurant`, `hotel` |

### article.faq-item

| Pole | Typ | Popis |
|------|-----|-------|
| `question` | Text (Short) | Otázka |
| `answer` | Text (Long) | Odpověď |

---

## 🔧 Strapi Schema (JSON)

### Destination Schema

Ulož jako `src/api/destination/content-types/destination/schema.json`:

```json
{
  "kind": "collectionType",
  "collectionName": "destinations",
  "info": {
    "singularName": "destination",
    "pluralName": "destinations",
    "displayName": "Destination",
    "description": "Travel destinations (countries, cities, regions)"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "name",
      "required": true
    },
    "type": {
      "type": "enumeration",
      "enum": ["country", "region", "city", "microstate"],
      "required": true,
      "default": "country"
    },
    "continent": {
      "type": "enumeration",
      "enum": ["europe", "asia", "africa", "caribbean", "northAmerica", "southAmerica", "oceania"],
      "required": true
    },
    "flagEmoji": {
      "type": "string"
    },
    "heroImage": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    },
    "languages": {
      "type": "json"
    },
    "timezone": {
      "type": "string"
    },
    "visaInfo": {
      "type": "text"
    },
    "bestTimeToVisit": {
      "type": "string"
    },
    "currency": {
      "type": "component",
      "repeatable": false,
      "component": "shared.currency"
    },
    "seo": {
      "type": "component",
      "repeatable": false,
      "component": "shared.seo"
    },
    "articles": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::article.article",
      "mappedBy": "destination"
    }
  }
}
```

### Article Schema

Ulož jako `src/api/article/content-types/article/schema.json`:

```json
{
  "kind": "collectionType",
  "collectionName": "articles",
  "info": {
    "singularName": "article",
    "pluralName": "articles",
    "displayName": "Article",
    "description": "Travel articles and guides"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "title",
      "required": true
    },
    "articleType": {
      "type": "enumeration",
      "enum": ["destination-guide", "place-guide", "practical-info", "itinerary", "list"],
      "required": true,
      "default": "destination-guide"
    },
    "tags": {
      "type": "json"
    },
    "coverImage": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    },
    "intro": {
      "type": "text",
      "required": true
    },
    "sections": {
      "type": "component",
      "repeatable": true,
      "component": "article.section"
    },
    "places": {
      "type": "component",
      "repeatable": true,
      "component": "article.place"
    },
    "faq": {
      "type": "component",
      "repeatable": true,
      "component": "article.faq-item"
    },
    "destination": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::destination.destination",
      "inversedBy": "articles"
    },
    "seo": {
      "type": "component",
      "repeatable": false,
      "component": "shared.seo"
    }
  }
}
```

---

## 📁 Struktura složek ve Strapi

```
strapi-backend/
├── src/
│   ├── api/
│   │   ├── destination/
│   │   │   ├── content-types/
│   │   │   │   └── destination/
│   │   │   │       └── schema.json
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── services/
│   │   └── article/
│   │       ├── content-types/
│   │       │   └── article/
│   │       │       └── schema.json
│   │       ├── controllers/
│   │       ├── routes/
│   │       └── services/
│   └── components/
│       ├── shared/
│       │   ├── currency.json
│       │   ├── budget-per-day.json
│       │   └── seo.json
│       └── article/
│           ├── section.json
│           ├── place.json
│           └── faq-item.json
```

---

## 🔐 API Permissions

Po vytvoření content typů nastav ve Strapi oprávnění:

1. Jdi do **Settings → Users & Permissions → Roles → Public**
2. Povol pro `destination`:
   - ✅ find
   - ✅ findOne
3. Povol pro `article`:
   - ✅ find
   - ✅ findOne

---

## 🔄 Migrace lokálních dat

Pro import existujících dat z `src/content/` do Strapi můžeš:

1. **Ručně** - přepsat do admin panelu
2. **Skriptem** - vytvořit import script:

```javascript
// scripts/import-to-strapi.js
const destinations = require('../src/content/destinations/data.ts')

async function importDestinations() {
  for (const dest of destinations) {
    await fetch('http://localhost:1337/api/destinations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_TOKEN'
      },
      body: JSON.stringify({ data: dest })
    })
  }
}
```

---

## ✅ Checklist

- [ ] Strapi nainstalován a běží
- [ ] Vytvořeny komponenty (shared.currency, shared.seo, article.section, atd.)
- [ ] Vytvořen content type Destination
- [ ] Vytvořen content type Article
- [ ] Nastaveny relace mezi Destination a Article
- [ ] Nastavena API oprávnění pro Public role
- [ ] Frontend `.env.local` obsahuje `VITE_STRAPI_URL`
- [ ] Testovací data importována
