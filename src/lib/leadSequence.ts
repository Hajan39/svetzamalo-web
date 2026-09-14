// The follow-up sequence for people who took the free ebook. Four mails over
// two weeks that walk from "here is one mistake" to "here is the whole method",
// ending on the paid book. Content lives here as plain functions so it can be
// unit-tested and previewed without a database or a mail provider.
import { SHOP } from "./shopConfig";

export interface SequenceLead {
	email: string;
	sequence_step: number;
	unsubscribe_token: string;
}

export interface SequenceStep {
	/** Days after the previous mail (the free ebook counts as day 0). */
	daysAfterPrevious: number;
	subject: string;
	heading: string;
	html: (lead: SequenceLead) => string;
	text: (lead: SequenceLead) => string;
}

const bookUrl = `${SHOP.siteUrl}/book/kompletni-pruvodce`;
const p = (html: string) => `<p style="margin:0 0 12px;">${html}</p>`;
const link = (href: string, label: string) =>
	`<a href="${href}" style="color:#0f6cbd;font-weight:600;">${label}</a>`;

export function unsubscribeUrl(lead: Pick<SequenceLead, "unsubscribe_token">) {
	return `${SHOP.siteUrl}/api/unsubscribe?token=${encodeURIComponent(lead.unsubscribe_token)}`;
}

export const LEAD_SEQUENCE: SequenceStep[] = [
	{
		daysAfterPrevious: 2,
		subject: "Nejtišší způsob, jak na cestě utratit navíc",
		heading: "Chyba, kterou nikdo nevidí na účtence",
		html: () =>
			p("Z deseti chyb v ebooku je jedna zvláštní tím, že ji neuvidíš. Nepřeplatíš na hotelu ani na letence — přeplatíš na <strong>penězích samotných</strong>.") +
			p("Směnárna na letišti, dynamický přepočet měny na terminálu („chcete platit v CZK?“ — nikdy), karta s poplatkem za výběr. Každá položka malá, dohromady klidně tisícovka za týden.") +
			p("Co s tím: karta bez poplatků za platby v cizí měně, výběr vždy v místní měně a odmítnout přepočet na terminálu. Tři pravidla, žádné výjimky.") +
			p(`Podrobně to rozebíráme v kapitole o penězích v ${link(bookUrl, "Kompletním průvodci")}, včetně toho, které karty dnes dávají smysl a kolik hotovosti brát s sebou.`),
		text: () =>
			`Chyba, kterou nikdo nevidí na účtence\n\nNepřeplatíš na hotelu ani na letence — přeplatíš na penězích samotných: směnárna na letišti, přepočet měny na terminálu, poplatky za výběr.\n\nCo s tím: karta bez poplatků, výběr vždy v místní měně, odmítnout přepočet na terminálu.\n\nPodrobně v Kompletním průvodci: ${bookUrl}`,
	},
	{
		daysAfterPrevious: 3,
		subject: "Proč vznikl Kompletní cestovatelský průvodce",
		heading: "Seznam, který zůstal po každé cestě",
		html: () =>
			p(`Za webem Svět za málo stojíme s Katkou od roku 2020. Začínali jsme jako studenti s minimem peněz; za deset let z toho bylo 46 zemí a skoro dva roky v Austrálii a na Novém Zélandu. Po každé cestě zůstal seznam věcí, které bychom příště udělali levněji a chytřeji — a ten seznam se pořád opakoval: dokumenty na poslední chvíli, letenka koupená ve špatný týden, pojištění vybrané podle ceny místo podle krytí.`) +
			p("Články na webu řeší jednotlivé destinace. Průvodce je ten seznam pohromadě, v pořadí, v jakém cestu opravdu plánuješ: kam, kdy, za kolik, s jakými dokumenty, pojištěním a kartou — a co dělat, když se něco pokazí.") +
			p(`235 stran, 22 kapitol, PDF hned po zaplacení. ${link(bookUrl, "Co v něm přesně je →")} Nebo si nejdřív ${link(`${SHOP.siteUrl}/downloads/ukazka-kompletni-cestovatelsky-pruvodce.pdf`, "stáhni ukázkovou kapitolu o penězích")}.`) +
			p(`O cestování taky přednášíme pro školy a knihovny — přehled témat najdeš na ${link(`${SHOP.siteUrl}/about`, "stránce o projektu")}.`),
		text: () =>
			`Seznam, který zůstal po každé cestě\n\nZa webem Svět za málo stojíme s Katkou od roku 2020: 46 zemí, dva roky v Austrálii a na Novém Zélandu. Průvodce je seznam toho, co příště udělat levněji a chytřeji, v pořadí, v jakém cestu opravdu plánuješ.\n\n235 stran, PDF, odkaz hned po zaplacení: ${bookUrl}\nUkázková kapitola zdarma: ${SHOP.siteUrl}/downloads/ukazka-kompletni-cestovatelsky-pruvodce.pdf`,
	},
	{
		daysAfterPrevious: 3,
		subject: "Kompletní průvodce: co dostaneš a co když nesedne",
		heading: "Za 490 Kč celý postup — a kapitola zdarma, než se rozhodneš",
		html: () =>
			p("Krátce, co v průvodci je:") +
			`<ul style="margin:0 0 12px;padding-left:20px;">
<li>Plánování bez cestovky: výběr destinace, trasa, termín</li>
<li>Dokumenty a vstup do země, zdraví a pojištění</li>
<li>Letenky: kdy hledat, kde hledat, chybné tarify, nízkonákladovky</li>
<li>Peníze a karty, ubytování a stravování</li>
<li>Balení, mobilní tarif, eSIM a offline aplikace</li>
<li>Pokročilé: luxus za rozumné peníze, práce na cestách</li>
</ul>` +
			p(`Nechceš kupovat naslepo? ${link(`${SHOP.siteUrl}/downloads/ukazka-kompletni-cestovatelsky-pruvodce.pdf`, "Stáhni si celou kapitolu o penězích zdarma")} — je to přesně ten styl a hloubka, jakou má zbytek knihy.`) +
			p(`${link(bookUrl, "Koupit průvodce za 490 Kč →")} Platba kartou nebo převodem, PDF přijde e-mailem.`),
		text: () =>
			`Za 490 Kč celý postup\n\nPlánování, dokumenty, zdraví a pojištění, letenky, peníze, ubytování, balení a aplikace, pokročilé cestování.\n\nUkázková kapitola zdarma: ${SHOP.siteUrl}/downloads/ukazka-kompletni-cestovatelsky-pruvodce.pdf\n\nKoupit: ${bookUrl}`,
	},
	{
		daysAfterPrevious: 6,
		subject: "Poslední mail k průvodci",
		heading: "Tímhle to z naší strany končí",
		html: () =>
			p("Slíbili jsme, že nebudeme otravovat, tak tohle je poslední zpráva k průvodci. Dál budou chodit jen nové články a tipy, a i ty jdou jedním klikem odhlásit.") +
			p("Pokud plánuješ cestu na příští měsíce, dává smysl mít postup po ruce teď — letenky i pojištění se řeší dřív, než člověk čeká.") +
			p(`${link(bookUrl, "Kompletní cestovatelský průvodce →")} 490 Kč, PDF hned po zaplacení.`) +
			p("Díky, že čteš. Šťastnou cestu."),
		text: () =>
			`Tímhle to z naší strany končí\n\nPoslední mail k průvodci. Pokud plánuješ cestu na příští měsíce, postup se hodí mít po ruce teď.\n\n${bookUrl} — 490 Kč, PDF hned po zaplacení.\n\nDíky, že čteš.`,
	},
];

/** The step a lead should receive next, or undefined once the sequence is done. */
export function nextStepFor(lead: Pick<SequenceLead, "sequence_step">): SequenceStep | undefined {
	return LEAD_SEQUENCE[lead.sequence_step];
}

/** Days until the step after `stepIndex`, or null when that was the last one. */
export function daysUntilFollowing(stepIndex: number): number | null {
	return LEAD_SEQUENCE[stepIndex + 1]?.daysAfterPrevious ?? null;
}

export function unsubscribeFooter(lead: SequenceLead) {
	const url = unsubscribeUrl(lead);
	return {
		html: `<p style="margin:16px 0 0;font-size:12px;color:#5a6b7b;">Tyhle maily chodí, protože sis vzal/a ebook zdarma. <a href="${url}" style="color:#5a6b7b;">Odhlásit se</a> jde jedním klikem.</p>`,
		text: `\n\nOdhlásit se: ${url}`,
		url,
	};
}
