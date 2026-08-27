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

async function send(to: string, subject: string, html: string, text: string) {
	if (!isMailConfigured()) {
		console.warn(`[mail] RESEND_API_KEY not set — skipped "${subject}" to ${to}`);
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
	const url = SHOP.freeEbookUrl;
	return send(
		to,
		"Tvůj e-book od Světa za málo",
		layout(
			"Díky! Tady je tvůj e-book",
			`<p style="margin:0 0 12px;">Jak jsme slíbili, posíláme e-book <strong>${SHOP.freeEbookTitle}</strong>.</p>
			 <p style="margin:0;">Najdeš v něm chyby, které zdražují každou cestu — letenky, ubytování, dopravu, jídlo i směnu peněz — a u každé i to, jak se jí vyhnout.</p>
			 ${button(url, "Stáhnout e-book (PDF)")}
			 <p style="margin:0;font-size:13px;color:#5a6b7b;">Odkaz nevyprší, stáhnout si ho můžeš kdykoli.</p>`,
		),
		`Díky! Tady je tvůj e-book: ${SHOP.freeEbookTitle}\n\nStáhnout: ${url}\n\n${SHOP.sellerName}, IČO ${SHOP.sellerIco}\n${SHOP.siteUrl}`,
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
		`Objednávka ${SHOP.paidBookTitle} — platební údaje`,
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
		`${SHOP.paidBookTitle} je tvůj — odkaz ke stažení`,
		layout(
			"Platba přijata, děkujeme!",
			`<p style="margin:0 0 12px;">Tady je <strong>${SHOP.paidBookTitle}</strong> ke stažení.</p>
			 ${button(url, "Stáhnout knihu")}
			 <p style="margin:0;font-size:13px;color:#5a6b7b;">Odkaz je osobní — ulož si soubor k sobě, ať ho máš po ruce i offline.</p>`,
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
			 <p style="margin:0;font-size:13px;color:#5a6b7b;">Pokud jsi o přihlášení nežádal, tento e-mail ignoruj — bez kliknutí se nic nestane.</p>`,
		),
		`Přihlášení do administrace Svět za málo\n\nOdkaz (platí 15 minut, jen jedno použití):\n${loginUrl}\n\nPokud jsi o přihlášení nežádal, e-mail ignoruj.`,
	);
}

