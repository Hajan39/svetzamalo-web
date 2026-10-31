# Dosah – obsahový stroj, plán prvních 4 týdnů

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rozjet pravidelnou produkci 8–10 článků týdně (rozšíření krátkých článků + návody) a jednorázově napojit distribuci, aby web do listopadu 2026 měl 400+ návštěv měsíčně.

**Architecture:** Obsah vzniká jako JSON v migračním formátu (`migration/content/...`), kontroluje ho `scripts/check-new-articles.mjs`, do Sanity ho dostává `scripts/import-sanity.mjs --only=` (nové články) a nový `scripts/append-article-blocks.mjs` (rozšíření existujících článků bez přepisu úprav ze Studia). Web sám se nemění; čte Sanity.

**Tech Stack:** Node 22+, `@sanity/client` (token z `~/.config/sanity/config.json`), PyMuPDF/sharp pro obrázky, subagenti pro psaní.

**Spec:** `docs/superpowers/specs/2026-09-15-dosah-obsahovy-stroj-design.md`

## Global Constraints

- Čas majitele ≤ 2 h týdně; rozpočet 0 Kč.
- Rytmus 8–10 článků týdně, publikovat průběžně (denně 1–3), nikdy 20+ za den.
- Žádná garance / vrácení peněz, žádná změna ceny, žádné nové země, EN zůstává noindex.
- Veřejné stránky nesmí volat Postgres (Neon free plan).
- Každý článek: vykání, „my“, ceny „zhruba“ s rokem 2026, FAQ blok, interní odkazy podle pole `slug` cílového JSONu, fotky jen z `raw/<rawSlug>/images/`.
- Vše prochází `node scripts/check-new-articles.mjs` (nové) nebo `--append` režimem (rozšíření) na ✓.
- Práce v `C:/Trask_dev/Programs/HAJAN/migration` (obsah + skripty) a `C:/Trask_dev/Programs/HAJAN/svetzamalo-web` (web, docs). Migration složka není git repo; docs a kód webu commitovat.

---

### Task 0: Jednorázové napojení distribuce (majitel, 1 hodina)

**Files:** žádné v repu; Vercel env.

- [ ] **Step 1:** Search Console → přidat vlastnost „doména“ `svetzamalo.cz` (DNS TXT záznam), po ověření Sitemaps → `https://svetzamalo.cz/sitemap.xml`.
- [ ] **Step 2:** Seznam Webmaster (search.seznam.cz/wm) → přidat web, ověřit (meta tag `seznam-wmt` už je v hlavičce), přidat sitemap.
- [ ] **Step 3:** Bing Webmaster Tools → „Import from Google Search Console“.
- [ ] **Step 4:** Pinterest business účet → Settings → Claim → website `svetzamalo.cz` (meta tag pošli Claudovi, přidá ho do `Layout.astro`) → Bulk create pins → RSS `https://svetzamalo.cz/rss.xml`.
- [ ] **Step 5:** IFTTT (free) → applet „RSS Feed: New feed item → Facebook Pages: Create a link post“, feed `https://svetzamalo.cz/rss.xml`.
- [ ] **Step 6:** Vercel → Environment Variables → `SOCIAL_FACEBOOK=https://www.facebook.com/<stránka>` (+ `SOCIAL_YOUTUBE`, pokud je) → Redeploy.
- [ ] **Step 7:** Poslat Claudovi Pinterest meta tag a potvrzení, že sitemap je v Search Console přijatá.

---

### Task 1: Nástroj na rozšiřování existujících článků

**Files:**
- Create: `migration/scripts/append-article-blocks.mjs`
- Modify: `migration/scripts/import-sanity.mjs` (export konverzních funkcí)
- Modify: `migration/scripts/check-new-articles.mjs` (režim `--append`)
- Create: `migration/content/ZADANI-ROZSIRENI.md`

**Interfaces:**
- Consumes: `toPortableText(blocks, bundle, article)` a `uploadImage` z `SanityImporter` (import-sanity.mjs), `readJson`, `listCountryBundles` z `article-refresh-lib.mjs`.
- Produces: soubor `content/<kontinent>/<země>-cs/articles/<slug>.append.json` ve tvaru
  `{ "slug": "...", "rawSlug": "...", "seoDescription"?: string, "excerpt"?: string, "content": [bloky v migračním formátu] }`;
  příkaz `node scripts/append-article-blocks.mjs <země>-cs --only=slug1,slug2 [--dry-run]`, který bloky převede na Portable Text, nahraje fotky a **připojí** je za poslední blok publikovaného dokumentu `article.<slug>.cs` (`patch.insert('after','content[-1]', blocks)`), volitelně nastaví `seoDescription`/`excerpt`.

- [ ] **Step 1:** V `import-sanity.mjs` přidat na konec `export { SanityImporter, documentId, stableKey }` (třída už existuje, jen ji vyexportovat) a zabalit volání `main()` do `if (process.argv[1] && process.argv[1].endsWith('import-sanity.mjs')) main().catch(...)`, aby import modulu nespouštěl CLI.
- [ ] **Step 2:** Napsat `append-article-blocks.mjs`:

```js
#!/usr/bin/env node
import {readFileSync, existsSync} from 'node:fs'
import {resolve} from 'node:path'
import {createClient} from '@sanity/client'
import {SanityImporter, documentId} from './import-sanity.mjs'
import {listCountryBundles, readJson} from './article-refresh-lib.mjs'

const [country, ...flags] = process.argv.slice(2)
const only = (flags.find((f) => f.startsWith('--only=')) ?? '').slice(7).split(',').filter(Boolean)
const dryRun = flags.includes('--dry-run')
if (!country || only.length === 0) {
  console.error('Usage: node scripts/append-article-blocks.mjs <country-slug> --only=slug1,slug2 [--dry-run]')
  process.exit(1)
}
const token = process.env.SANITY_AUTH_TOKEN
if (!token && !dryRun) { console.error('SANITY_AUTH_TOKEN required'); process.exit(1) }
const client = createClient({projectId: 'bh335dwp', dataset: 'production', apiVersion: '2025-01-01', token, useCdn: false})
const importer = new SanityImporter({client, dryRun, skipAssets: false})
const bundle = listCountryBundles().find((b) => b.country.slug === country)
if (!bundle) { console.error(`No bundle for ${country}`); process.exit(1) }

for (const slug of only) {
  const file = resolve(bundle.countryDir, 'articles', `${slug}.append.json`)
  if (!existsSync(file)) { console.error(`missing ${file}`); process.exit(1) }
  const append = readJson(file)
  const docId = documentId('article', slug, 'cs')
  const blocks = await importer.toPortableText(append.content, bundle, {slug, rawSlug: append.rawSlug})
  const existing = await client.fetch('*[_id == $id][0]{ _id, "n": count(content) }', {id: docId})
  if (!existing) { console.error(`document ${docId} not found`); process.exit(1) }
  console.log(`${slug}: appending ${blocks.length} block(s) to ${existing.n} existing`)
  if (dryRun) continue
  let patch = client.patch(docId).setIfMissing({content: []}).insert('after', 'content[-1]', blocks)
  if (append.seoDescription) patch = patch.set({seoDescription: append.seoDescription})
  if (append.excerpt) patch = patch.set({excerpt: append.excerpt})
  await patch.commit()
}
console.log('done')
```

- [ ] **Step 3:** Do `check-new-articles.mjs` přidat režim `--append`: když je první argument `--append`, u každého souboru kontrolovat jen `slug`, `rawSlug`, `content` (validní bloky, fotky existují, INTERNAL_LINK cíle existují podle pole `slug` sousedních JSONů nebo 6 návodů, text ≥ 2 000 znaků, obsahuje „Kolik to stojí“ a „Časté otázky“ a rok 2026, žádné „garanc“); `seoDescription` pokud je uvedena 120–170 znaků. Implementace: na začátku souboru `const appendMode = process.argv[2] === '--append'; const files = process.argv.slice(appendMode ? 3 : 2)` a v cyklu větvit požadovaná pole.
- [ ] **Step 4:** Napsat `content/ZADANI-ROZSIRENI.md` (zkopírovat tón a pravidla ze `ZADANI-NOVE-CLANKY.md`, ale výstup = `.append.json` s bloky, které se **připojí za stávající text**: `## Kolik to stojí (2026)`, `## Kdy jet`, `## Jak se tam dostat`, `## Časté otázky` (3× h3), závěrečný odstavec s 2 interními odkazy; 1–2 fotky z raw, které v článku ještě nejsou; nová `seoDescription` 140–160 znaků; neopakovat, co už článek říká – subagent si stávající JSON přečte).
- [ ] **Step 5:** Ověřit dry-run na jednom článku: vytvořit ručně `content/asia/thajsko-cs/articles/phuket-itinerar-cs.append.json` s jedním odstavcem a spustit
  `SANITY_AUTH_TOKEN=$(node -e "process.stdout.write(require('C:/Users/jhanc/.config/sanity/config.json').authToken)") node scripts/append-article-blocks.mjs thajsko-cs --only=phuket-itinerar-cs --dry-run`
  Očekáváno: `phuket-itinerar-cs: appending 1 block(s) to N existing`, žádná chyba. Testovací soubor pak smazat.
- [ ] **Step 6:** Do `docs/raw-obsah-prehled.md` (web repo) připsat odstavec „Rozšiřování: `.append.json` → `check-new-articles.mjs --append` → `append-article-blocks.mjs`“. Commit + push web repa.

---

### Task 2: Týden 1 – rozšíření 19 krátkých článků o Thajsku

**Files:**
- Create: `migration/content/asia/thajsko-cs/articles/<slug>.append.json` pro slugy:
  `ko-lanta-low-cost-cs, krabi-doprava-cs, phuket-itinerar-cs, similanske-ostrovy-proc-jet-cs, phi-phi-top-mista-cs, phuket-top-mista-cs, ko-lanta-pruvodce-cs, phi-phi-low-cost-cs, khao-lak-low-cost-cs, khao-lak-itinerar-cs, thajsko-jidlo-cs, thajsko-kam-jet-cs, phuket-pruvodce-cs, thajsko-transfery-ostrovy-cs, thajsko-doprava-cs, ko-rok-snorchlovani-cs, thajsko-prakticky-cs, thajsko-low-cost-cs, thajsko-plaze-cs`

**Interfaces:**
- Consumes: Task 1 nástroje; raw `raw/jizni-thajsko/content.json` (29 tis. znaků, sekce Krabi okolí, Phi Phi, Khao Lak, Wat Chalong, Similany, Patong, Skútr, Ko Rok, Khao Lak NP), fotky `raw/jizni-thajsko/images/` (82).

- [ ] **Step 1:** Spustit 3 subagenty paralelně (Phuket+Similany 7 slugů; Krabi+Phi Phi+Lanta+Ko Rok 6; Thajsko obecné 6) se zadáním: přečíst `ZADANI-ROZSIRENI.md`, stávající JSON článku, raw sekci; napsat `.append.json`; spustit `node scripts/check-new-articles.mjs --append <soubory>` do ✓; vrátit jen seznam souborů + výstup kontroly.
- [ ] **Step 2:** Zkontrolovat výstupy checkerem znovu ze své strany; namátkou přečíst 2 soubory (ceny, tón).
- [ ] **Step 3:** Publikovat po dnech (Task constraint: max 3 denně): `append-article-blocks.mjs thajsko-cs --only=<3 slugy>` každý den, 7 dní.
- [ ] **Step 4:** Po každém dni ověřit 1 URL na produkci s `?v=` parametrem: nový `<h2>Kolik to stojí` je v HTML, počet `cdn.sanity.io` obrázků vzrostl, žádné `INTERNAL_LINK` v textu.
- [ ] **Step 5:** V neděli poslat majiteli seznam 19 URL ke 20minutové kontrole.

---

### Task 3: Týden 2 – Mexiko: fotky z HEIC + 15 rozšíření + 3 nová místa

**Files:**
- Modify/run: `migration/scripts/convert-mexico-heic.mjs` (existuje; mapuje složky `Photos-3-001` → `raw/mexico/images/img-NNN.jpg`)
- Create: `migration/content/caribbean/mexico-cs/articles/<slug>.append.json` pro 15 mexických článků (slugy: `coba-pruvodce-cs, isla-mujeres-pruvodce-cs, tulum-pruvodce-cs, izamal-pruvodce-cs, calakmul-pruvodce-cs, cancun-pruvodce-cs, uxmal-pruvodce-cs, cozumel-pruvodce-cs, bacalar-pruvodce-cs, merida-pruvodce-cs, campeche-pruvodce-cs, valladolid-pruvodce-cs, chichen-itza-pruvodce-cs, palenque-pruvodce-cs, rio-lagartos-pruvodce-cs`)
- Create: 3 nové články `cenoty-valladolid-cs`, `progreso-cs`, `misol-ha-roberto-barrios-cs` (formát nových článků, `rawSlug: "mexico"`)

- [ ] **Step 1:** Spustit `cd migration && node scripts/convert-mexico-heic.mjs` (pokud padne na `heic-convert`, `npm i` v migration). Očekáváno: `raw/mexico/images/img-*.jpg` a `raw/mexico/content.json` s polem `images` (alt = název složky/místa). Pokud skript `content.json` netvoří, vytvořit ho ručně: `{ "slug": "mexico", "blocks": [], "images": [{ "localFile": "img-001.jpg", "alt": "<místo z názvu složky>" }, ...] }` skriptem z názvů složek.
- [ ] **Step 2:** Ověřit, že `check-new-articles.mjs` fotky pro `rawSlug: "mexico"` najde (existence `raw/mexico/images/<file>`).
- [ ] **Step 3:** 3 subagenti: 5 rozšíření každý (+ třetí agent i 3 nové články). Mexické články nemají raw text, podklad = stávající článek + `raw/mexico/notes.md` + obecné znalosti Yucatánu; ceny jen orientační s rokem, doprava ADO/colectivo.
- [ ] **Step 4:** Kontrola, publikace po 3 denně (`append-article-blocks.mjs mexico-cs --only=...`, nové přes `import-sanity.mjs mexico-cs --only=...`), ověření na produkci jako v Task 2.

---

### Task 4: Týden 3 – Mauricius 15 rozšíření + návod „Co sbalit na dlouhou cestu“

**Files:**
- Create: `migration/content/africa/mauricius-cs/articles/<slug>.append.json` pro slugy `piton-de-la-petite-riviere-noire-cs, blue-bay-snorchl-tipy-cs, le-morne-pruvodce-cs, mahebourg-pruvodce-cs, blue-bay-pruvodce-cs, mauricius-hory-top-cs, le-morne-brabant-cs, mauricius-pruvodce-cs, mauricius-vodopady-top-cs, mahebourg-trh-cs, mauricius-low-cost-cs, port-louis-top-mista-cs, mahebourg-zakladna-cs, mauricius-itinerar-cs, rochester-chamarel-cs`
- Create (návod, Sanity přímo přes MCP `create_documents` jako u prvních 6): `article.co-sbalit-na-dlouhou-cestu.cs`, `articleType: "Návod"`, zdroj kniha str. 143–156 („Balit, či nebalit?“).

- [ ] **Step 1:** Vytáhnout text kapitoly z knihy: `python -c "import pymupdf;d=pymupdf.open(r'<scratchpad>/kniha.pdf');print('\n'.join(d[i].get_text() for i in range(142,156)))"` do souboru ve scratchpadu.
- [ ] **Step 2:** Napsat návod podle šablony návodů (Rychlá odpověď, 3–5 sekcí, Kolik to stojí, Chyby, FAQ, Co dál s odkazem na knihu), 6–8 tis. znaků, affiliate anotace Decathlon (`e511534c-8e26-4a9c-99f6-957d5794895c`); publikovat.
- [ ] **Step 3:** 3 subagenti × 5 rozšíření Mauricius z `raw/mauricius/content.json` (36 tis. znaků, sekce BUS, Tamarin, Stravování, Pronájem auta, Le Pouce, Pláže, Kdy jet/očkování/víza, Le Morne, Hory).
- [ ] **Step 4:** Kontrola, publikace 3 denně, ověření.

---

### Task 5: Týden 4 – Indonésie 7 + Andorra 6 rozšíření + návod „Víza a vstup do země“

**Files:**
- Create: `.append.json` pro Indonésii (`gili-low-cost-cs, bali-priroda-cs, gili-co-sbalit-cs, bali-top-10-cs, bali-pruvodce-cs, nusa-penida-co-sbalit-cs, lombok-top-10-cs`; rawSlug podle ostrova: `bali-cs`, `gili-cs`, `lombok-cs`, `nusa-penida-cs`) a Andorru (`je-andorra-draha-cs, co-sbalit-do-andorry-cs, andorra-pruvodce-prvni-cesta-cs, jak-se-dostat-do-andorry-cs, nejkrasnejsi-treky-andorra-cs, andorra-itinerar-3-dny-cs`; rawSlug `andorra-cs`)
- Create návod `article.viza-a-vstup-do-zeme.cs` ze knihy str. 24–31 (Cestovní pas, Víza, Povolená délka pobytu, Co se stane, když zůstanu déle).

- [ ] **Step 1:** Text kapitoly z knihy (str. 24–31) do scratchpadu, napsat návod, publikovat.
- [ ] **Step 2:** 2 subagenti (Indonésie 7, Andorra 6), kontrola, publikace 3 denně, ověření.
- [ ] **Step 3:** Aktualizovat `docs/obsahovy-plan-2026-2027.md` (✅ u hotových položek) a `docs/raw-obsah-prehled.md`. Commit + push.

---

### Task 6: Měsíční log a první vyhodnocení (1. 10. a 1. 11.)

**Files:**
- Create: `docs/dosah-log.md`

- [ ] **Step 1:** Vytvořit tabulku:

```markdown
# Dosah – měsíční log

| Měsíc | Návštěvníci (Vercel) | Zobrazení | Návštěvy /book/kompletni-pruvodce | Kliky SC | Zobrazení SC | Indexováno | Leady (ebook/sample/newsletter) | Krok sekvence 0/1/2/3/4 | Prodeje | Publikováno článků | Poznámka |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 09/2026 (start) | 75 | 286 | 5 | – | – | – | – | – | 0 | 70 | výchozí stav |
```

- [ ] **Step 2:** 1. dne měsíce majitel doplní řádek (Vercel, Search Console, `/admin`); Claude přidá počet publikovaných článků a 3 věty vyhodnocení proti tabulce cílů ve specu (listopad 400+, leden 1 500+, březen 3 000+).
- [ ] **Step 3:** Pokud v listopadu Search Console ukáže indexováno < 300 stránek: prioritu přesunout na interní prolinkování (průvodce zemí → nové články) místo dalšího objemu. Zapsat do logu.

---

## Self-review

- Spec coverage: produkce (Tasks 2–5), distribuce (Task 0), měření (Task 6), rytmus 8–10/týden (19, 18, 16, 14 článků v týdnech 1–4 při max 3/den), návody 1 za 2 týdny (T4, T5), co neděláme = nikde v úkolech. Rozpočtové stránky (spec bod 4) jsou až po týdnu 4, záměrně mimo tento plán; nový plán po měsíci.
- Placeholder scan: příkazy a soubory konkrétní; jediný otevřený vstup je Pinterest meta tag (od majitele) a mexické `content.json`, pro který je fallback popsán.
- Konzistence názvů: `append-article-blocks.mjs`, přípona `.append.json`, režim `--append`, `--only=` shodně napříč úkoly.
