# Dosah 10/2026–3/2027: obsahový stroj

## Východisko

Měření k 15. 9. 2026 (Vercel Analytics, poslední období): 75 návštěvníků, 286 zobrazení, 5 návštěv
prodejní stránky, 0 prodejů. 70 % návštěv z vyhledávání (Google 41, Seznam 5, Bing 4). Web má 413 článků,
technické SEO, funnel (lead magnet, ukázka za e-mail, čtyřdílná sekvence) i prodejní stránku hotové.

Závěr: **problém není stránka ani produkt, je to dosah.** Při 5 návštěvách prodejní stránky měsíčně
nelze prodej ani měřit. Prodejní stránka převádí typicky 1–3 %, takže 1 prodej týdně vyžaduje
200–400 návštěv prodejní stránky měsíčně, tj. 5 000–10 000 návštěv webu.

## Omezení

- Čas majitele: do 2 hodin týdně.
- Rozpočet: 0 Kč měsíčně (žádná reklama, žádné placené nástroje).
- Neon free plan: veřejné stránky nesmí sahat do databáze; sekvence, leady a objednávky ano.
- Žádná garance vrácení peněz, žádné slevy a změny ceny do dosažení 200+ návštěv prodejní stránky měsíčně.

## Cíl

| Kontrolní bod | Návštěv / měsíc | Návštěv prodejní stránky | Leadů | Rozhodnutí |
|---|---|---|---|---|
| Start (září 2026) | 75 | 5 | jednotky | – |
| Listopad 2026 | 400+ | 20+ | 10+ | pokud < 200 návštěv: zkontrolovat indexaci v Search Console, ne měnit strategii |
| Leden 2027 | 1 500+ | 60+ | 30+ | první pohled na konverzi leadů ze sekvence |
| Březen 2027 | 3 000+ | 150+ | 60+ | teprve tady ladit prodejní stránku, cenu, nabídku |

Čísla jsou orientační: SEO obsah roste pomalu prvních 8 týdnů a pak zrychluje. Zásadní je trend měsíc
po měsíci, ne absolutní hodnota.

## Strategie: A) obsah jako stroj + jednorázová automatizovaná distribuce

### 1. Produkce obsahu (dělá Claude, majitel schvaluje)

Rytmus **8–10 publikovaných článků týdně**, každý týden, ne v dávkách. Google i Seznam odměňují
pravidelnost; 60 článků najednou už proběhlo a víc takových vln nechceme.

Zdroje a pořadí (podle připravenosti podkladů a sezóny):

1. **Rozšíření 99 krátkých článků** (pod 2 500 znaků) podle šablony: bloky „Kolik to stojí (2026)“,
   „Kdy jet“, „Jak se tam dostat“, 3× FAQ, 2 interní odkazy. Pořadí zemí: Thajsko (19), Mexiko (15),
   Mauricius (15), Indonésie (7), Andorra (6), pak zbytek. Rozšíření existující URL má rychlejší efekt
   než nová URL. **Říjen–prosinec.**
2. **Zbývajících 8 návodů k tématům knihy** (co sbalit, víza, ubytování zdarma, směna peněz,
   nízkonákladovky, aplikace, práce na cestách, luxus levně): 1 za 2 týdny, nejvyšší kupní záměr.
3. **Nová destinační místa z raw**, která zbývají (~30, viz `docs/raw-obsah-prehled.md` část 2), a
   Mexiko: převod HEIC fotek a 6 nových míst z `notes.md`.
4. **28 rozpočtových stránek** `/destinations/guide/{slug}/rozpocet` z `quickFacts` (kód + data),
   jakmile budou články z bodu 1 hotové pro danou zemi. Dotaz „kolik stojí dovolená v {země}“.

Kvalita: každý článek prochází `scripts/check-new-articles.mjs` (fotky, odkazy, FAQ, ceny s rokem,
délka), publikuje se přes `import-sanity.mjs --only`. Faktické tvrzení bez opory v raw nebo v knize se
nepíše; ceny vždy „zhruba“ a s rokem.

### 2. Distribuce (jednorázově 1 hodina majitele, pak automaticky)

- **Search Console** (ověření, sitemap), **Seznam Webmaster**, **Bing Webmaster**: bez nich nevidíme
  indexaci a IndexNow nefunguje.
- **Pinterest business účet** napojený na `https://svetzamalo.cz/rss.xml` (Nastavení → Hromadné
  vytváření pinů z RSS). Každý nový článek = pin automaticky, obrázek z `og:image`.
- **Facebook stránka** napojená na RSS přes IFTTT (free tarif, applet „RSS → Facebook Page“).
- `SOCIAL_FACEBOOK` do env, aby patička a `sameAs` odkazovaly na profil.

Nic dalšího na sociálních sítích se ručně nedělá. Kdyby zbyl čas, jediná ruční aktivita s dobrým
poměrem je odpovědět 1× týdně na dotaz v cestovatelské FB skupině odkazem na konkrétní článek.

### 3. E-mail (běží)

Sekvence z free ebooku a ukázky (D2, D5, D8, D14) jede automaticky. Newsletter pro leady po sekvenci
zatím nezavádíme: při desítkách leadů nemá smysl. Znovu zvážit v lednu 2027.

### 4. Měření (10 minut měsíčně, majitel)

Vždy 1. den měsíce zapsat do `docs/dosah-log.md`: návštěvníci a top 10 stránek (Vercel), kliky a
zobrazení ve vyhledávání + počet indexovaných stránek (Search Console), leady podle zdroje a stav
sekvence (`/admin`), prodeje. Porovnat s tabulkou cílů.

## Co neděláme (do března 2027)

- Nové země a jazyky. EN zůstává noindex.
- Změny ceny, slevy, bundle, garance.
- Reklama, influenceři, PR výjezdy.
- Redesign webu. Prodejní stránka je hotová; dolaďuje se až s daty.
- Hromadné publikování desítek článků za den.

## Role

| Kdo | Co | Kolik |
|---|---|---|
| Claude | píše, kontroluje, publikuje články; kód pro rozpočtové stránky; měsíční vyhodnocení z dat, která dodá majitel | průběžně |
| Majitel | 1× týdně 20 min: projít seznam publikovaných článků (titulky, faktické chyby); 1× měsíčně 10 min: čísla do logu; jednorázově 1 h: účty a napojení RSS | ≤ 2 h týdně |

## Rizika

- **Google indexuje pomalu nebo nové články neřadí.** Poznáme v Search Console do listopadu. Reakce: víc
  interních odkazů z průvodců zemí na nové články, ne další objem.
- **Obsah z raw dojde** (zhruba únor). Pak přechod na rozšiřování podle dotazů ze Search Console
  (pozice 5–15) místo nových témat.
- **Neon compute.** Nový obsah databázi nezatěžuje; hlídat jen leady a cron. Při překročení limitu
  vypnout affiliate zápis kliků (nejméně důležitý).
- **Kvalita při objemu.** Kontrolní skript chytí formu, ne fakta. Týdenní kontrola majitele je jediná
  pojistka; pokud na ni není čas, snížit rytmus na 5 článků týdně, ne vypustit kontrolu.
