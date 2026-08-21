// Ecomail (ecomail.cz) — primary destination for collected e-mails. The
// delivery of the free ebook happens in Ecomail itself: an automation
// triggered by the list subscription sends the e-mail with the PDF link,
// so the web only needs to register the subscriber.
//
// Configured via two Vercel env vars; until both are set, callers fall back
// to the previous lead storage (see /api/leads).

const ECOMAIL_API_KEY = import.meta.env.ECOMAIL_API_KEY;
const ECOMAIL_LIST_ID = import.meta.env.ECOMAIL_LIST_ID;

export function isEcomailConfigured(): boolean {
	return Boolean(ECOMAIL_API_KEY && ECOMAIL_LIST_ID);
}

export interface EcomailLead {
	email: string;
	leadType: string;
	source?: string;
}

export async function subscribeToEcomail(lead: EcomailLead): Promise<void> {
	if (!isEcomailConfigured()) {
		throw new Error("Ecomail is not configured");
	}

	const response = await fetch(
		`https://api2.ecomailapp.cz/lists/${ECOMAIL_LIST_ID}/subscribe`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				key: ECOMAIL_API_KEY,
			},
			body: JSON.stringify({
				subscriber_data: {
					email: lead.email,
					// Tags let automations branch (send the ebook only to tag
					// "ebook") and keep the source attribution for segmentation.
					tags: [lead.leadType, lead.source].filter(Boolean),
				},
				trigger_autoresponders: true,
				update_existing: true,
				resubscribe: false,
			}),
			signal: AbortSignal.timeout(5000),
		},
	);

	if (!response.ok) {
		const message = await response.text().catch(() => response.statusText);
		throw new Error(`Ecomail subscribe failed: ${response.status} ${message}`);
	}
}
