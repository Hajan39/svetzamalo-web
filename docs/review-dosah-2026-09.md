# Review: jak dostat Svět za málo mezi víc lidí (14. 9. 2026)

Stav po dnešní práci: 413 článků, prodejní stránka s obálkou, autory, obsahem knihy a ukázkou za e-mail,
čtyřdílná e-mailová sekvence, affiliate odkazy na první zmínku, RSS, IndexNow, sitemap se všemi stránkami.
Technická stránka SEO je hotová. **Co teď rozhoduje, je distribuce a měření**, ne další kód.

## 1. Co udělat tento týden (hodina práce, největší dopad)

| # | Krok | Proč | Kde |
|---|---|---|---|
| 1 | **Search Console**: ověřit doménu (DNS TXT), odeslat `https://svetzamalo.cz/sitemap.xml`, zapnout e-mailové notifikace | Bez toho neuvidíš, které z 70 nových článků Google indexuje a na jaké dotazy se zobrazují. Jediný zdroj pravdy pro SEO. | search.google.com/search-console |
| 2 | **Seznam Webmaster**: meta tag `seznam-wmt` už na webu je, přidat web a sitemap | Seznam má v ČR 15–20 % vyhledávání a u cestovatelských dotazů víc. IndexNow, který jsem dnes zapnul, funguje jen když je web v Seznam Webmasteru registrovaný. | reporter.seznam.cz / search.seznam.cz/wm |
| 3 | **Bing Webmaster Tools**: import ze Search Console jedním klikem | Bing + DuckDuckGo + Copilot; zdarma, 5 minut. IndexNow pak zabírá i tady. | bing.com/webmasters |
| 4 | **Facebook URL** do env `SOCIAL_FACEBOOK` (a YouTube, pokud je) | Footer a `sameAs` ve schématu Organization; Google tím spojuje web s profily. | Vercel → Environment Variables |
| 5 | **Přednášky → QR kód** na `https://svetzamalo.cz/book/kompletni-pruvodce?utm_source=talk&utm_medium=qr` na poslední slide | Osm besed ročně, publikum je přesně cílovka. Dnes z přednášek nevede na knihu nic. | slidy |

## 2. Kanály seřazené podle poměru úsilí a dopadu

### A. Vyhledávání (už běží, jen krmit)
- 70 nových článků potřebuje 2–6 týdnů na indexaci. Nic dalšího hromadně nepublikovat, sledovat Search Console.
- Pak podle dat: dotazy s pozicí 5–15 jsou kandidáti na rozšíření (šablona v `docs/obsahovy-plan-2026-2027.md`).
- Zbývajících 8 návodů (co sbalit, víza, ubytování zdarma…) psát průběžně, 1 za 2 týdny. Mají nejvyšší kupní záměr.
- **Google Discover**: články mají velké obrázky i `max-image-preview:large`; Discover začne servírovat po několika týdnech stabilního provozu, pomáhá pravidelné publikování (ne nárazové).

### B. Pinterest (nejpodceněnější kanál pro cestovní obsah)
- Cestování je na Pinterestu druhá největší kategorie a piny žijí měsíce, ne hodiny jako na Instagramu.
- Založit firemní účet, ověřit doménu, zapnout „Rich Pins“ (článek → automaticky název a popis z OG tagů, které máme).
- Z každého článku 1 vertikální pin (1000×1500) s titulkem: Canva šablona, 5 minut na článek. Začít u 60 nových destinačních článků, které mají vlastní fotky.
- RSS → Pinterest umí automaticky publikovat nové články jako piny (Nastavení → Hromadné vytváření → RSS). **Dnes přidaný `/rss.xml` je přesně pro tohle.**

### C. Facebook a Instagram
- Účty existují (kniha na ně odkazuje), web na ně do dneška neodkazoval.
- Automatizace: RSS → Buffer / Zapier / IFTTT → nový článek = post na FB stránku. Nulová ruční práce.
- Skupiny: „Cestování za málo“, „Backpackeři“, „Levné letenky“ a podobné skupiny mají desítky tisíc členů. Pravidlo: odpovídat na konkrétní dotazy odkazem na konkrétní článek, ne postovat reklamu. 2–3 odpovědi týdně = stabilní stovky návštěv.
- Instagram: karusel „5 chyb, které v {země} stojí peníze“ z každého low-cost článku; link v bio na `/book`.

### D. E-mail (běží, doladit)
- Sekvence z free ebooku a ukázky je zapnutá. Za měsíc zkontrolovat v `/admin` počty v krocích a prodeje.
- Chybí **pravidelný newsletter** pro leady, kteří sekvenci dokončili: 1× měsíčně „3 nové články + 1 tip“. Jde postavit automaticky z RSS (další cron), nebo ručně z Resend za 20 minut měsíčně. Doporučuji nejdřív ručně, ať vidíš, co lidi otvírají.

### E. Backlinky a PR (pomalé, ale trvalé)
- **Přednášky** jsou nejsilnější aktivum: každá knihovna nebo škola má web a ráda odkáže na hosta. Poslat pořadatelům po akci 2 věty + odkaz na `/about` a na knihu.
- Rozhovor pro cestovatelské podcasty a weby (Cestujlevně, Hedvábná stezka, Travel Bible): mají hlad po hostech s konkrétními čísly („46 zemí, 235 stran chyb“).
- Seznam Médium / články na Medium.com nebo v komunitních magazínech s odkazem na web: 1 článek měsíčně přepsaný z webu.
- Wikipedie: u českých hesel destinací (Samoa, Galapágy…) bývá sekce Externí odkazy prázdná. Přidat jen tam, kde je článek opravdu nejlepší český zdroj; jinak to editoři smažou.

### F. Placená propagace (až po měření)
- **Sklik**: dotazy „levné letenky jak“, „cestovní pojištění srovnání“, „karta do zahraničí“ jsou levné (jednotky Kč za klik) a vedou na naše návody s CTA na knihu. Test 1 500 Kč / měsíc, měřit prodeje přes UTM v `/admin`.
- **Meta Ads** na free ebook (lead magnet): cílová cena leadu do 20 Kč je v cestovní nice reálná; sekvence pak prodává sama. Test až když sekvence prokáže konverzi na organických leadech.
- Nedělat: Google Ads na značkové dotazy, bannery, influencery bez měření.

### G. Web samotný (drobnosti, nízká priorita)
- Výkon: změřit na pagespeed.web.dev (mobil) homepage, článek, prodejní stránku. Očekávám zelené SEO i přístupnost; u výkonu hlídat LCP obálky a fontů. Pokud LCP > 2,5 s, další krok je self-hosting fontů.
- Sdílecí tlačítka nepřidávat, konverze je nízká a zpomalují stránku. OG obrázky pro sdílení fungují.
- Komentáře nepřidávat (moderace, spam). Diskuse ať běží ve FB skupinách, kde jsou lidi.

## 3. Měření: co sledovat 1× měsíčně (30 minut)

| Metrika | Kde | Cíl na konci roku 2026 |
|---|---|---|
| Kliky z vyhledávání | Search Console → Výkon | +50 % proti září |
| Indexované stránky | Search Console → Indexování | 400+ z 436 |
| Leady (ebook + ukázka) | `/admin` | 100 / měsíc |
| Krok sekvence → prodej | `/admin` → sekvence, objednávky | 3 % leadů koupí |
| Prodeje podle zdroje | `/admin` + UTM (`?utm_source=`) | vědět, odkud přišel každý kupující |
| Affiliate kliky podle článku | `/admin` → Affiliate kliky | vyměnit URL u 5 nejklikanějších partnerů za skutečné affiliate |
| Top 10 článků podle návštěv | Vercel Analytics | rozšířit je na 5 000+ znaků |

## 4. Co nedělat

- Nepřidávat další země ani jazyky, dokud současných 28 zemí nemá provoz. EN verze je noindex a má zůstat.
- Neměnit ceny ani nezavádět slevy, dokud není 30 prodejů k porovnání.
- Nepublikovat 60 článků najednou znovu. Google odměňuje rytmus, ne dávky.
