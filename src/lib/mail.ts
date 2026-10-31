// Transactional e-mail via Resend. Every function is a no-op that reports
// failure instead of throwing, so a mail outage never loses a paid order --
// the order is already in Postgres and /admin can resend the link.
import { Resend } from "resend";
import { SHOP } from "./shopConfig";

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY || "";
const MAIL_FROM =
	import.meta.env.MAIL_FROM || "Svet za malo <info@svetzamalo.cz>";

export function isMailConfigured(): boolean {
	return Boolean(RESEND_API_KEY);
}

async function send(
	to: string,
	subject: string,
	html: string,
	text: string,
	headers?: Record<string, string>,
) {
	if (!isMailConfigured()) {
		console.warn(`[mail] RESEND_API_KEY not set, skipped "${subject}" to ${to}`);
		return false;
	}
	try {
		const resend = new Resend(RESEND_API_KEY);
		const { error } = await resend.emails.send({
			from: MAIL_FROM,
			to,
			subject,
			html,
			text,
			...(headers ? { headers } : {}),
		});
		if (error) {
			console.warn("[mail] Resend rejected the message:", error);
			return false;
		}
		return true;
	} catch (error) {
		console.warn("[mail] send failed:", error);
		return false;
	}
}

function layout(heading: string, bodyHtml: string) {
	return `<!doctype html><html lang="cs"><body style="margin:0;background:#e4eff9;font-family:Ubuntu,Helvetica,Arial,sans-serif;color:#1b2733;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border-radius:10px;">
<tr><td style="padding:26px 26px 6px;font-size:20px;font-weight:700;color:#0f6cbd;">Svět za málo</td></tr>
<tr><td style="padding:6px 26px 0;font-size:26px;font-weight:700;line-height:1.25;">${heading}</td></tr>
<tr><td style="padding:14px 26px 26px;font-size:16px;line-height:1.55;">${bodyHtml}</td></tr>
<tr><td style="padding:0 26px 26px;font-size:12px;line-height:1.6;color:#5a6b7b;border-top:1px solid #dde5ec;padding-top:16px;">
${SHOP.sellerName} &middot; IČO ${SHOP.sellerIco}<br>
<a href="${SHOP.siteUrl}" style="color:#0f6cbd;">svetzamalo.cz</a>
</td></tr>
</table></td></tr></table></body></html>`;
}

function button(href: string, label: string) {
	return `<p style="margin:22px 0;"><a href="${href}" style="display:inline-block;background:#0f6cbd;color:#ffffff;font-size:17px;font-weight:700;padding:14px 30px;border-radius:8px;text-decoration:none;">${label}</a></p>`;
}

export async function sendFreeEbookEmail(to: string) {
	const url = SHOP.freeEbookDownloadUrl;
	return send(
		to,
		"Tvůj e-book od Světa za málo",
		layout(
			"Díky! Tady je tvůj e-book",
			`<p style="margin:0 0 12px;">Jak jsme slíbili, posíláme e-book <strong>${SHOP.freeEbookTitle}</strong>.</p>
			 <p style="margin:0;">Najdeš v něm chyby, které zdražují každou cestu: letenky, ubytování, dopravu, jídlo i směnu peněz. U každé je i to, jak se jí vyhnout.</p>
			 ${button(url, "Stáhnout e-book (PDF)")}
			 <p style="margin:0;font-size:13px;color:#5a6b7b;">Odkaz nevyprší, stáhnout si ho můžeš kdykoli.</p>`,
		),
		`Díky! Tady je tvůj e-book: ${SHOP.freeEbookTitle}\n\nStáhnout: ${url}\n\n${SHOP.sellerName}, IČO ${SHOP.sellerIco}\n${SHOP.siteUrl}`,
	);
}

export async function sendSampleChapterEmail(to: string) {
	const url = `${SHOP.siteUrl}/downloads/ukazka-kompletni-cestovatelsky-pruvodce.pdf`;
	return send(
		to,
		"Ukázková kapitola: Peníze a platební karty",
		layout(
			"Tady je ukázka z průvodce",
			`<p style="margin:0 0 12px;">Posíláme kapitolu <strong>Peníze a platební karty</strong> z knihy <strong>${SHOP.paidBookTitle}</strong> a k ní obsah všech 22 kapitol.</p>
			 <p style="margin:0;">Je to přesně ten styl a hloubka, jakou má zbytek knihy: konkrétní postupy, žádné obecné rady.</p>
			 ${button(url, "Stáhnout ukázku (PDF)")}
			 <p style="margin:0;font-size:13px;color:#5a6b7b;">Celý průvodce: <a href="${SHOP.siteUrl}/book/kompletni-pruvodce" style="color:#0f6cbd;">svetzamalo.cz/book/kompletni-pruvodce</a></p>`,
		),
		`Ukázková kapitola z knihy ${SHOP.paidBookTitle}: Peníze a platební karty\n\nStáhnout: ${url}\n\nCelý průvodce: ${SHOP.siteUrl}/book/kompletni-pruvodce\n\n${SHOP.sellerName}, IČO ${SHOP.sellerIco}`,
	);
}

export async function sendBankInstructionsEmail(order: {
	email: string;
	full_name: string;
	variable_symbol: string;
	amount_minor: number;
	currency: string;
}) {
	const amount = (order.amount_minor / 100).toFixed(0);
	const rows = [
		["Částka", `${amount} ${order.currency}`],
		["Variabilní symbol", order.variable_symbol],
		SHOP.bankAccount ? ["Číslo účtu", SHOP.bankAccountDisplay] : null,
		SHOP.bankIban ? ["IBAN", SHOP.bankIban] : null,
	].filter(Boolean) as [string, string][];

	const table = rows
		.map(
			([k, v]) =>
				`<tr><td style="padding:6px 12px 6px 0;color:#5a6b7b;">${k}</td><td style="padding:6px 0;font-weight:700;">${v}</td></tr>`,
		)
		.join("");

	return send(
		order.email,
		`Objednávka ${SHOP.paidBookTitle}: platební údaje`,
		layout(
			"Máme tvou objednávku",
			`<p style="margin:0 0 14px;">Díky za objednávku <strong>${SHOP.paidBookTitle}</strong>. Zbývá jen zaplatit převodem:</p>
			 <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="font-size:16px;margin:0 0 16px;">${table}</table>
			 <p style="margin:0;">Jakmile platba dorazí, pošleme ti e-mail s odkazem ke stažení. Obvykle do jednoho pracovního dne.</p>
			 <p style="margin:14px 0 0;font-size:13px;color:#5a6b7b;">Nezapomeň prosím uvést variabilní symbol, ať platbu poznáme.</p>`,
		),
		`Objednávka ${SHOP.paidBookTitle}\n\nČástka: ${amount} ${order.currency}\nVariabilní symbol: ${order.variable_symbol}\n${SHOP.bankAccount ? `Účet: ${SHOP.bankAccountDisplay}\n` : ""}${SHOP.bankIban ? `IBAN: ${SHOP.bankIban}\n` : ""}\nPo přijetí platby ti pošleme odkaz ke stažení.\n\n${SHOP.sellerName}, IČO ${SHOP.sellerIco}`,
	);
}

export async function sendPaidBookEmail(to: string, token: string) {
	const url = `${SHOP.siteUrl}/api/ebook/download?token=${encodeURIComponent(token)}`;
	return send(
		to,
		`${SHOP.paidBookTitle} je tvůj, tady je odkaz ke stažení`,
		layout(
			"Platba přijata, děkujeme!",
			`<p style="margin:0 0 12px;">Tady je <strong>${SHOP.paidBookTitle}</strong> ke stažení.</p>
			 ${button(url, "Stáhnout knihu")}
			 <p style="margin:0;font-size:13px;color:#5a6b7b;">Odkaz je osobní. Ulož si soubor k sobě, ať ho máš po ruce i offline.</p>`,
		),
		`Platba přijata. ${SHOP.paidBookTitle} ke stažení:\n${url}\n\n${SHOP.sellerName}, IČO ${SHOP.sellerIco}`,
	);
}

export async function sendAdminLoginEmail(to: string, loginUrl: string) {
	return send(
		to,
		"Přihlášení do administrace Svět za málo",
		layout(
			"Přihlášení do administrace",
			`<p style="margin:0 0 12px;">Klikni na odkaz a budeš přihlášen. Platí 15 minut a jde použít jen jednou.</p>
			 ${button(loginUrl, "Přihlásit se")}
			 <p style="margin:0;font-size:13px;color:#5a6b7b;">Pokud jsi o přihlášení nežádal, tento e-mail ignoruj. Bez kliknutí se nic nestane.</p>`,
		),
		`Přihlášení do administrace Svět za málo\n\nOdkaz (platí 15 minut, jen jedno použití):\n${loginUrl}\n\nPokud jsi o přihlášení nežádal, e-mail ignoruj.`,
	);
}


/** One mail of the free-ebook follow-up sequence (src/lib/leadSequence.ts). */
export async function sendSequenceEmail(
	to: string,
	subject: string,
	heading: string,
	bodyHtml: string,
	text: string,
	unsubscribeUrl: string,
) {
	return send(to, subject, layout(heading, bodyHtml), `${text}\n\n${SHOP.sellerName}, IČO ${SHOP.sellerIco}`, {
		"List-Unsubscribe": `<${unsubscribeUrl}>`,
		"List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
	});
}

/** Shared shape for the shop mails: a fresh order has priced lines, a stored one has rows. */
interface ShopMailLine {
	title: string;
	variantLabel: string;
	unitMinor: number;
	quantity: number;
}

interface ShopMailOrder {
	email: string;
	full_name: string;
	variable_symbol: string;
	amount_minor: number;
	shipping_minor: number;
	currency: string;
	payment_method: string;
	shipping_method: string | null;
	shipping_point_name: string | null;
	address_street: string | null;
	address_city: string | null;
	address_zip: string | null;
}

function czk(minor: number): string {
	return `${Math.round(minor / 100)} Kč`;
}

function itemRowsHtml(lines: ShopMailLine[]): string {
	return lines
		.map(
			(line) =>
				`<tr><td style="padding:6px 12px 6px 0;">${line.quantity}x ${line.title}<br><span style="color:#5a6b7b;font-size:13px;">${line.variantLabel}</span></td><td style="padding:6px 0;font-weight:700;text-align:right;white-space:nowrap;">${czk(line.unitMinor * line.quantity)}</td></tr>`,
		)
		.join("");
}

function itemRowsText(lines: ShopMailLine[]): string {
	return lines
		.map(
			(line) =>
				`${line.quantity}x ${line.title} (${line.variantLabel}): ${czk(line.unitMinor * line.quantity)}`,
		)
		.join("\n");
}

function deliveryLine(order: ShopMailOrder): string {
	if (order.shipping_point_name) return order.shipping_point_name;
	const parts = [
		order.address_street,
		[order.address_zip, order.address_city].filter(Boolean).join(" "),
	].filter(Boolean);
	return parts.join(", ");
}

/**
 * Sent the moment the order exists, before the money has moved. A bank transfer
 * needs the payment details here; a card payment is already on its way, so this
 * is only the receipt.
 */
export async function sendShopOrderEmail(
	order: ShopMailOrder,
	lines: ShopMailLine[],
	options: { paymentPending?: boolean } = {},
) {
	// Defaults to the payment method, but /admin marking a transfer as received
	// sends the same receipt without repeating instructions already paid.
	const byTransfer =
		options.paymentPending ?? order.payment_method === "bank_transfer";
	const itemsMinor = order.amount_minor - order.shipping_minor;
	const delivery = deliveryLine(order);

	const payment = byTransfer
		? `<p style="margin:18px 0 8px;font-weight:700;">Platební údaje</p>
			 <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="font-size:16px;margin:0 0 16px;">
			 <tr><td style="padding:4px 12px 4px 0;color:#5a6b7b;">Částka</td><td style="padding:4px 0;font-weight:700;">${czk(order.amount_minor)}</td></tr>
			 <tr><td style="padding:4px 12px 4px 0;color:#5a6b7b;">Variabilní symbol</td><td style="padding:4px 0;font-weight:700;">${order.variable_symbol}</td></tr>
			 ${SHOP.bankAccount ? `<tr><td style="padding:4px 12px 4px 0;color:#5a6b7b;">Číslo účtu</td><td style="padding:4px 0;font-weight:700;">${SHOP.bankAccountDisplay}</td></tr>` : ""}
			 ${SHOP.bankIban ? `<tr><td style="padding:4px 12px 4px 0;color:#5a6b7b;">IBAN</td><td style="padding:4px 0;font-weight:700;">${SHOP.bankIban}</td></tr>` : ""}
			 </table>
			 <p style="margin:0;">Zásilku odešleme, jakmile platba dorazí. Nezapomeň prosím uvést variabilní symbol, ať ji poznáme.</p>`
		: `<p style="margin:18px 0 0;">Jakmile zásilku předáme dopravci, dáme ti vědět dalším e-mailem.</p>`;

	return send(
		order.email,
		byTransfer
			? `Objednávka ${order.variable_symbol}: platební údaje`
			: `Objednávka ${order.variable_symbol}: potvrzení`,
		layout(
			"Máme tvou objednávku",
			`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:16px;margin:0 0 14px;">
			 ${itemRowsHtml(lines)}
			 <tr><td style="padding:10px 12px 4px 0;border-top:1px solid #dde5ec;color:#5a6b7b;">Zboží</td><td style="padding:10px 0 4px;text-align:right;border-top:1px solid #dde5ec;">${czk(itemsMinor)}</td></tr>
			 <tr><td style="padding:4px 12px 4px 0;color:#5a6b7b;">Doprava</td><td style="padding:4px 0;text-align:right;">${order.shipping_minor === 0 ? "zdarma" : czk(order.shipping_minor)}</td></tr>
			 <tr><td style="padding:8px 12px 0 0;font-weight:700;font-size:18px;">Celkem</td><td style="padding:8px 0 0;font-weight:700;font-size:18px;text-align:right;">${czk(order.amount_minor)}</td></tr>
			 </table>
			 ${delivery ? `<p style="margin:0 0 4px;font-weight:700;">Doručení</p><p style="margin:0 0 8px;">${delivery}</p>` : ""}
			 ${payment}`,
		),
		`Máme tvou objednávku ${order.variable_symbol}\n\n${itemRowsText(lines)}\n\nZboží: ${czk(itemsMinor)}\nDoprava: ${order.shipping_minor === 0 ? "zdarma" : czk(order.shipping_minor)}\nCelkem: ${czk(order.amount_minor)}\n${delivery ? `\nDoručení: ${delivery}\n` : ""}${
			byTransfer
				? `\nPlatební údaje\nČástka: ${czk(order.amount_minor)}\nVariabilní symbol: ${order.variable_symbol}\n${SHOP.bankAccount ? `Účet: ${SHOP.bankAccountDisplay}\n` : ""}${SHOP.bankIban ? `IBAN: ${SHOP.bankIban}\n` : ""}\nZásilku odešleme, jakmile platba dorazí.`
				: "\nJakmile zásilku předáme dopravci, dáme ti vědět."
		}\n\n${SHOP.sellerName}, IČO ${SHOP.sellerIco}`,
	);
}

/** Sent from /admin when the parcel is handed over. */
export async function sendShopShippedEmail(
	order: ShopMailOrder,
	trackingNumber: string | null,
) {
	const delivery = deliveryLine(order);
	const tracking = trackingNumber?.trim();

	return send(
		order.email,
		`Objednávka ${order.variable_symbol} je na cestě`,
		layout(
			"Zásilka je na cestě",
			`<p style="margin:0 0 12px;">Objednávku <strong>${order.variable_symbol}</strong> jsme právě předali dopravci.</p>
			 ${delivery ? `<p style="margin:0 0 12px;">Doručení: <strong>${delivery}</strong></p>` : ""}
			 ${tracking ? `<p style="margin:0;">Číslo zásilky: <strong>${tracking}</strong></p>` : ""}
			 <p style="margin:14px 0 0;font-size:13px;color:#5a6b7b;">Kdyby cokoli nesedělo, stačí odpovědět na tenhle e-mail.</p>`,
		),
		`Zásilka je na cestě\n\nObjednávku ${order.variable_symbol} jsme předali dopravci.\n${delivery ? `Doručení: ${delivery}\n` : ""}${tracking ? `Číslo zásilky: ${tracking}\n` : ""}\nKdyby cokoli nesedělo, odpověz na tenhle e-mail.\n\n${SHOP.sellerName}, IČO ${SHOP.sellerIco}`,
	);
}
