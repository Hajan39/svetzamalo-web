# Přehled raw obsahu z původního webu a co z něj ještě vytěžit

> **Stav 14. 9. 2026 večer:** část 2 realizována – 60 nových destinačních článků z raw podkladů je v Sanity
> (Slovinsko 3, Švýcarsko 4, BVI 3, Gran Canaria 3, Francie 6, Itálie 7, Portoriko 2, Samoa 2, Fuerteventura 5,
> Galapágy 3, Colombo 1, Vietnam 6, Ekvádor 6, Dominikánská republika 8, Mauricius 1, Bali 1, Lombok 1, USVI 1,
> Norsko 1). Pipeline: `migration/content/ZADANI-NOVE-CLANKY.md` → `scripts/check-new-articles.mjs` →
> `scripts/import-sanity.mjs <země> --only=…`. Zbývá část 3 (Mexiko: HEIC fotky + rozšíření) a část 4 (fotky pro 4 články).

Zdroj: `C:/Trask_dev/Programs/HAJAN/migration/raw/` – 34 stránek stažených z lowcost-traveling.com
(`content.json` = text po blocích, `images/` = fotky), plus `raw/mexico/` (jen fotky a seznam míst).
Sanity dnes: 343 destinačních článků + 6 návodů. Stav k 14. 9. 2026.

## 1. Co v raw je

| Raw stránka | Text (znaků) | Fotek | Článků v Sanity | Pokrytí raw textu články |
|---|---|---|---|---|
| dominikanska-republika | 84 000 | 215 | 10 | **slabé** – 8 velkých sekcí bez článku |
| ekvador | 70 000 | 189 | 8 | **slabé** – města a Amazonie bez článků |
| vietnam-cs | 52 000 | 74 | 15 | střední – články jsou obecné, místa chybí |
| galapagy | 42 000 | 104 | 7 | střední – ostrovy v jednom článku |
| sri-lanka-cs | 39 000 | 80 | 14 | dobré |
| mauricius | 36 000 | 38 | 22 | dobré |
| spanelsko-fuerteventura | 34 000 | 86 | 6 | **slabé** – 5 míst bez článku |
| jizni-thajsko | 29 000 | 82 | 37 | dobré |
| francie | 27 000 | 48 | 13 (z toho 10 Paříž) | **slabé** – Alpy a Provence bez článků |
| bali-cs | 20 000 | 39 | 9 | dobré |
| samoa | 19 000 | 57 | 7 | střední |
| italie-sever | 19 000 | 38 | 7 | **slabé** – města v jednom článku |
| portoriko | 17 500 | 47 | 7 | dobré |
| britske-panenske-ostrovy | 17 000 | 56 | 8 | střední |
| malajsie | 16 000 | 32 | 27 | dobré |
| rim | 16 000 | 30 | 7 | dobré |
| pariz | 13 500 | 29 | 10 | dobré |
| spanelsko-gran-canaria | 12 000 | 25 | 5 | střední |
| lombok-cs | 11 500 | 21 | 8 | dobré |
| singapur | 11 000 | 38 | 17 | dobré |
| slovinsko | 11 000 | 16 | 6 | střední |
| americke-panenske-ostrovy | 9 600 | 22 | 6 | dobré |
| svycarsko | 8 400 | 16 | 7 | střední – města bez článků |
| nusa-penida-cs, gili-cs | 6 500 / 6 300 | 8 / 15 | 8 / 8 | dobré |
| vatikan, oslo, berlin, andorra-cs | 5 500 / 5 200 / 4 900 / 4 300 | 8 / 17 / 15 / 6 | 5 / 8 / 9 / 10 | dobré |
| stockholm, monaco, lucemburk, san-marino | 3 300 / 3 000 / 2 600 / 2 000 | 8 / 7 / 5 / 7 | 10 / 5 / 5 / 5 | dobré (raw je chudší než Sanity) |
| **mexico** | 0 (jen `notes.md` se seznamem míst) | **2 180** (HEIC z prosince 2025) | 15 | – |

Celkem 660 000 znaků původního textu a asi 3 600 vlastních fotek. Migrace v květnu z raw udělala
především „průvodce zemí“ a obecné články (doprava, low-cost, itinerář); **konkrétní místa uvnitř zemí
zůstala nevytěžená**. Přitom právě dotazy na konkrétní místo („Saona výlet“, „Chamonix levně“,
„Cofete pláž“) mají nejmenší konkurenci v češtině.

## 2. Nové články, které z raw jdou napsat hned (text i fotky existují)

Řazeno podle množství podkladů × sezónního potenciálu. U každého je v raw 1–5 tisíc znaků vlastních
poznámek z cesty plus fotky, takže článek je z 60 % hotový.

### Dominikánská republika (8 článků, zimní sezóna – priorita 1)
Saona (výlet lodí bez cestovky) · Jarabacoa a hory · Santo Domingo za 2 dny · Puerto Plata a sever ·
Cabarete (surf, kite) · Barahona a jihozápad · Lago Enriquillo · Národní park Valle Nuevo

### Ekvádor (6 článků)
Quito za 3 dny (raw 7 000 znaků!) · Amazonie a Tena · Guayaquil · Puerto López a Machalilla (velryby, Isla de la Plata) ·
Cuenca · Baños

### Fuerteventura (5 článků, zima–jaro)
Playa de Cofete · Corralejo a duny · Ostrov Lobos · El Cotillo · Ajuy a jeskyně

### Vietnam (6 článků)
Hanoj – Staré město · Cao Bang a vodopád Ban Gioc · Sapa a Fansipan · Da Lat · Hoi An · Zátoka Ha Long bez drahé plavby

### Severní Itálie (6 článků, jaro)
Milán za den · Benátky levně · Bologna · Florencie a Pisa za 2 dny · Lago di Garda · Elba

### Francie mimo Paříž (5 článků)
Chamonix levně · Les Deux Alpes v létě · Nice, Cannes a Azurové pobřeží za rozumné peníze · Avignon a Provence · Carcassonne

### Galapágy (3 články)
San Cristóbal · Santa Cruz · Isabela – každý ostrov zvlášť (raw 4–5 000 znaků na ostrov)

### Švýcarsko (4 články)
Ženeva · Zürich · Lucern · Bern a Lausanne – vždy „za den a levně“

### Ostatní (po 1–3 článcích)
BVI: Virgin Gorda (The Baths), Mount Sage · Gran Canaria: Las Palmas, Roque Nublo a Bandama ·
Slovinsko: Postojna, Lublaň, Triglav · Portoriko: pevnosti San Juan, Las Tinajas · Samoa: Apia, Namua ·
Sri Lanka: Colombo · Oslo: Besseggen (trek)

**Součet: ~55 článků z existujících podkladů.** Při 2 nových týdně = půl roku obsahu bez jediné nové cesty.

## 3. Mexiko: 2 180 fotek, 15 krátkých článků bez vlastních fotek

`raw/mexico/notes.md` je seznam 30 navštívených míst (Cancún, Valladolid, cenoty, Río Lagartos, Chichén-Itzá,
Izamal, Mérida, Uxmal, Campeche, Palenque, Calakmul, Bacalar, Tulum, Cobá, Isla Mujeres, Cozumel…).
Všech 15 mexických článků je pod 2 300 znaků a fotky mají z jiných zdrojů. Nejrychlejší zlepšení celé země:

1. Převést HEIC → JPG (jednorázový skript, `sharp` nebo `heic-convert`), vybrat 3–5 fotek na místo.
2. Nahrát do Sanity jako `articleImage` do existujících článků (vlastní fotky = důvěryhodnost + obrázkové vyhledávání).
3. Doplnit každý článek o bloky „Kolik to stojí“, „Jak se tam dostat“, FAQ podle šablony v obsahovém plánu.
4. Nové články z míst v notes bez článku: cenoty u Valladolidu (Xcanahaltun, Palomitas), Progreso, Edzná, vodopády Roberto Barrios a Misol-Ha, Los Rápidos de Bacalar.

## 4. Fotky pro 4 články bez obrázku

| Článek | Zdroj fotek v raw |
|---|---|
| `svycarsko-interlaken-berne-alpy-cs` | `raw/svycarsko/images` (16 fotek) |
| `bvi-ostrovy-cs`, `bvi-potapeni-cs` | `raw/britske-panenske-ostrovy/images` (56 fotek) |
| `usvi-st-john-np-cs` | `raw/americke-panenske-ostrovy/images` (22 fotek) |

Fotky se nahrají přes Sanity assets a připojí jako `articleImage` – jedna session.

## 5. Co raw nedá

- Nic k tématům knihy (letenky, pojištění, karty) – ty píšeme z knihy, ne z raw.
- Nové země (Japonsko, Nový Zéland, Austrálie, Peru) – raw je nemá, i když jsou tématem přednášek.
- Ceny v raw jsou z let 2019–2023; při přepisu vždy aktualizovat s rokem.

## 6. Doporučené pořadí

1. **Teď (říjen–listopad):** Dominikánská republika 8 + Fuerteventura 5 + Mexiko fotky a rozšíření – zimní sezóna, lidé plánují.
2. **Prosinec–leden:** Vietnam 6 + Ekvádor 6 + Galapágy 3.
3. **Únor–duben:** Itálie 6 + Francie 5 + Švýcarsko 4 + Slovinsko 3 – jaro a léto v Evropě.
4. Průběžně po jednom: BVI, Gran Canaria, Portoriko, Samoa, Sri Lanka, Oslo.
