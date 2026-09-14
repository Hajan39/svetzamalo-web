# Obsahový plán Svět za málo (10/2026 – 9/2027)

Navazuje na audit z 14. 9. 2026. Cíl: víc návštěv z vyhledávání na dotazy, které mají blízko ke koupi
průvodce, a prodej knihy z každého článku, ne jen z prodejní stránky.

## 1. Co říkají data (Sanity, 14. 9. 2026)

| Metrika | Stav |
|---|---|
| Článků celkem | 343, poslední nový 23. 5. 2026 |
| Typ článku | 343× `destination-guide`, **0× obecný návod** |
| Článků pod 2 500 znaků | 99 (29 %) |
| Článků s cenami v Kč | 38 (11 %) |
| Článků s FAQ blokem | 0 |
| Nejslabší země (průměr znaků) | Mexiko 1 960, San Marino 2 300, Mauricius 2 390, Andorra 2 420, Thajsko 2 470 |
| Nejsilnější země | Vietnam 8 400, Srí Lanka 5 660, Portoriko 4 660 |

Dvě díry, které brzdí prodej:

1. **Chybí evergreen obsah k tématům knihy.** Kniha řeší letenky, dokumenty, pojištění, peníze, ubytování,
   balení, eSIM. Web k nim nemá jediný článek, takže Google k nám nepošle nikoho, kdo hledá „cestovní
   pojištění srovnání“ nebo „karta bez poplatků v zahraničí“. To jsou lidé s nejvyšší ochotou koupit.
2. **Třetina článků je tenká.** Krátké články bez cen a bez FAQ neobsazují long-tail dotazy typu
   „kolik stojí den v Thajsku 2026“ a Google je řadí pod delší konkurenci.

## 2. Priorita A – 14 evergreen článků k tématům knihy (do konce 2026)

Každý článek = jedna kapitola knihy zdarma „v malém“, zakončená `BookCta`. Rozsah 6–9 tis. znaků,
struktura podle šablony v části 7. Pořadí podle sezóny (leden = plánování léta, letenky).

| # | Pracovní název (H1) | Hledaný dotaz | Kapitola knihy | Termín |
|---|---|---|---|---|
| 1 | Jak najít levné letenky: postup, který funguje i v roce 2026 | levné letenky jak hledat | Letenky | říjen 2026 |
| 2 | Karta do zahraničí bez poplatků: srovnání pro Čechy 2026 | karta do zahraničí bez poplatků | Peníze | říjen 2026 |
| 3 | Cestovní pojištění: co musí krýt a na čem se šetřit nesmí | cestovní pojištění srovnání | Zdraví a pojištění | listopad 2026 |
| 4 | eSIM na cesty: kdy se vyplatí a jak ji koupit za pár korun | esim cestování | Mobilní tarif | listopad 2026 |
| 5 | Chybné tarify (error fares): jak je najít a kdy do nich jít | error fare letenky | Letenky | prosinec 2026 |
| 6 | Kolik stojí cestování? Reálné rozpočty na den podle regionů | rozpočet na cestování na den | Plánování | prosinec 2026 |
| 7 | Co sbalit na dlouhou cestu: seznam na 2 týdny až půl roku | co sbalit na dovolenou seznam | Balení | leden 2027 |
| 8 | Víza a vstup do země: kde Čech vízum potřebuje a kde ne (2027) | víza pro Čechy seznam zemí | Dokumenty | leden 2027 |
| 9 | Ubytování zdarma nebo skoro: housesitting, Couchsurfing, výměny | ubytování zdarma cestování | Ubytování | únor 2027 |
| 10 | Jak nepřeplatit za směnu peněz: letiště, terminál, výběry | směna peněz v zahraničí | Peníze | únor 2027 |
| 11 | Nízkonákladovky bez překvapení: zavazadla, poplatky, triky | ryanair wizz zavazadla tipy | Letenky | březen 2027 |
| 12 | Offline aplikace na cesty, které opravdu použiješ | aplikace na cestování | Aplikace | březen 2027 |
| 13 | Práce na cestách: jak si cestu zaplatit průběžně | práce při cestování | Pokročilé | duben 2027 |
| 14 | Luxusní destinace za rozumné peníze: Maledivy, Seychely, Mauricius levně | maledivy levně | Pokročilé | květen 2027 |

Ke každému:
- Vlastní `country` reference není (obecný článek) → do schématu přidat `articleType: "guide"` a v šabloně
  článku zobrazit místo destinace štítek „Návod“. Sitemap a listing s tím počítají.
- Interní odkazy: 3–5 destinačních článků, kde se téma projevuje (např. letenky → „Jak se dostat na Galapágy“).
- Affiliate: Revolut/Wise (karta), Airalo/Nomad (eSIM), Skyscanner (letenky), TrustedHousesitters — všechny
  už jsou v Sanity jako `affiliateLink`, stačí použít klíčová slova pro auto-náhradu.
- CTA: `BookCta` inline po 2. sekci (už automaticky) + závěrečný odstavec „Tohle je jedna kapitola z 40“.

## 3. Priorita B – rozšíření 99 krátkých článků (průběžně, 8–10 týdně)

Levnější než nové články: URL už existuje, stačí přidat obsah. Cíl: každý článek nad 3 500 znaků,
s cenami, FAQ a sezónou.

**Co doplnit do každého (šablona rozšíření):**
1. Blok **„Kolik to stojí (2026)“** – 4–6 řádků v Kč i místní měně: vstup, doprava z hubu, jídlo, nocleh.
2. Blok **„Kdy jet“** – 2 odstavce: sezóna, davy, počasí, kdy je to nejlevnější.
3. Blok **„Jak se tam dostat“** – z nejbližšího hubu, čas, cena, kde koupit jízdenku.
4. **3 otázky FAQ** (`h2` „Časté otázky“ + `h3` otázky) – Google z nich dělá rozbalovací výsledky.
5. **2 interní odkazy** na sousední články téže země + odkaz na průvodce zemí.
6. Fotka, pokud chybí (4 články).

**Pořadí zemí podle dopadu** (krátkých článků / celkem):

| Země | Krátkých | Poznámka |
|---|---|---|
| Thajsko | 19 / 37 | největší provoz, ostrovy = vysoká komerční hodnota |
| Mauricius | 15 / 22 | téměř všechny články pod 2 500 |
| Mexiko | 15 / 15 | **všechny** články jsou krátké, Yucatán je silné téma na zimu |
| Indonésie | 7 / 33 | Bali a Gili na dotazech nejvíc |
| Andorra | 6 / 10 | zimní sezóna, lyžování |
| Malajsie, Singapur | 5 / 27, 5 / 17 | |
| Itálie, San Marino, Vatikán | 4 / 14, 4 / 5, 3 / 5 | Řím jako celek |
| Slovinsko | 3 / 6 | léto 2027 |

Časový plán: Thajsko + Mexiko říjen–prosinec 2026 (zimní sezóna), Mauricius leden–únor, Indonésie a
Malajsie březen–duben, Evropa květen–červen.

## 4. Priorita C – díry v destinacích (nové články, 2 týdně od 2027)

Standardní sada pro zemi: průvodce · kdy jet · doprava · rozpočet/ceny · co sbalit · itinerář · jídlo ·
low-cost · bezpečnost. Kde chybí:

| Země | Chybí | Návrh článku |
|---|---|---|
| Mexiko | kdy jet, doprava, rozpočet, co sbalit, itinerář, jídlo, bezpečnost | „Yucatán na 2 týdny: itinerář a rozpočet“, „Autobusy ADO a colectiva: jak cestovat po Yucatánu“, „Kolik stojí Mexiko: ceny 2026“, „Je Yucatán bezpečný?“, „Co jíst na Yucatánu“, „Kdy jet do Mexika“, „Co sbalit do Mexika“ |
| Monako | co sbalit, jídlo | „Kde v Monaku jíst pod 20 €“ |
| Lucemburk, San Marino, Vatikán | itinerář z okolí | „San Marino a Rimini za víkend“, „Lucemburk + Trevír za 2 dny“ |
| Galapágy | rozpočet | „Galapágy bez plavby: kolik reálně stojí 10 dní“ |
| Německo | jídlo, rozpočet | „Berlín: kolik stojí víkend“ |
| Norsko, Švédsko | rozpočet, jídlo | „Norsko za 1 000 Kč na den: jde to?“ |
| Švýcarsko | co sbalit, jídlo, itinerář kratší | „Švýcarsko za víkend vlakem z Prahy“ |
| Slovinsko | co sbalit, jídlo, kdy jet | „Slovinsko: kdy jet k Bledu bez davů“ |
| Portoriko, Samoa, BVI, USVI | co sbalit, itinerář (BVI/USVI) | „Karibik: co sbalit“ (sdílený), „BVI a USVI za 10 dní“ |
| Andorra | jídlo, kdy jet | „Andorra v zimě vs. v létě“ |

**Nové země** až po dorovnání výše. Kandidáti podle přednášek a poptávky Čechů: Japonsko, Nový Zéland,
Austrálie, Peru, Keňa/Seychely – všechny už jsou téma přednášek, materiál existuje. Každá nová země =
minimálně 8 článků ze standardní sady najednou, jinak se v indexu neuchytí.

## 5. Priorita D – programatické rozpočtové stránky (kód, 1 session)

`/destinations/guide/{slug}/rozpocet` z `quickFacts` + nové pole `budgetPerDay` (nízký / střední /
pohodlný, v místní měně) na `country`. Stránka: tabulka 3 rozpočtů přepočtená přes Frankfurter API do Kč,
seznam „na čem se v {země} nejvíc přeplácí“, odkazy na low-cost článek země a `BookCta`. Dotazy
„kolik stojí dovolená v {země}“ mají stabilní hledanost a dnes ji berou agregátory. 28 stránek jedním
šablonovým souborem; obsahová práce = vyplnit 28×3 čísla v Sanity.

## 6. Sezónní kalendář

| Měsíc | Co lidé hledají | Co publikovat / oživit |
|---|---|---|
| říjen–listopad | zimní úniky, Vánoce v teple | Thajsko, Mexiko, Mauricius, Srí Lanka; A1, A2, A3 |
| prosinec | dárky, plánování léta | prodejní stránka: „Dárek pro cestovatele“ (voucher = objednávka na cizí e-mail), A5, A6 |
| leden–únor | letenky na léto, Asie | A7, A8, A9, A10; Indonésie, Malajsie, Vietnam oživit |
| březen–duben | Evropa jaro, city-breaky | A11, A12; Itálie, Řím, Vatikán (Velikonoce), Andorra treky |
| květen–červen | léto, Skandinávie, Alpy | A13, A14; Norsko, Švédsko, Švýcarsko, Slovinsko |
| červenec–srpen | last minute, Karibik mimo sezónu | BVI/USVI, Portoriko, Samoa; „levná dovolená v srpnu“ |
| září | podzimní Asie, plánování zimy | Srí Lanka, Vietnam sever; roční revize cen |

## 7. Šablona článku (pro nové i rozšířené)

```
H1  {Téma}: {konkrétní slib}                     ≤ 60 znaků, klíčové slovo na začátku
Úvod 2–3 věty: pro koho, co se dozví, jedno číslo (cena/čas)
H2  Rychlá odpověď                              3–5 odrážek, to nejdůležitější
H2  {Hlavní část 1}  … H2 {Hlavní část 3–5}     každá 2–4 odstavce, konkrétní čísla
H2  Kolik to stojí (2026)                       tabulka nebo odrážky v Kč + místní měna
H2  Kdy jet / Kdy to řešit
H2  Chyby, které stojí peníze                   2–3 body → přirozený můstek k knize
H2  Časté otázky                                 3 × H3 otázka + 2–3 věty odpověď
Závěr: co dál (2 interní odkazy) + jedna věta o průvodci
```

Pravidla: seoTitle ≤ 60 znaků, seoDescription 140–160 znaků s číslem a slovem „levně“ nebo „kolik stojí“;
excerpt = první věta úvodu; každý článek min. 1 fotka s alt textem; ceny vždy s rokem; žádné „v tomto
článku se podíváme“, začínat odpovědí.

## 8. Kadence a měření

- **Kadence:** 2 nové články + 8 rozšíření týdně = cca 6 hodin práce týdně. Za 12 měsíců: ~100 nových,
  99 rozšířených.
- **Měření (Search Console, měsíčně):** kliky na články priority A; počet dotazů s pozicí 4–10 (kandidáti na
  rozšíření); pokrytí („indexováno / objeveno, neindexováno“).
- **Konverze (`/admin`):** leady podle `source` (`article_inline` vs. `article` vs. `lead_success`), prodeje,
  affiliate kliky podle článku. Za 3 měsíce vyhodnotit, které země a témata prodávají, a podle toho přeřadit
  priority v části 3 a 4.
- **Revize:** jednou ročně (září) projít články s cenami a aktualizovat rok v nadpisu i tabulce.
