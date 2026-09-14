import type { APIRoute } from "astro";
import { db, isDbConfigured, type LeadRow } from "@/lib/db";
import {
	daysUntilFollowing,
	nextStepFor,
	unsubscribeFooter,
} from "@/lib/leadSequence";
import { isMailConfigured, sendSequenceEmail } from "@/lib/mail";

// ponytail: 50 per run keeps a daily cron well inside Resend's free tier and
// the function's timeout; raise or run hourly if the list outgrows it.
const BATCH = 50;

/**
 * Runs once a day from Vercel Cron (vercel.json). Sends the next mail of the
 * free-ebook sequence to every lead whose time has come, skips people who
 * already bought the book, and never touches anyone who unsubscribed.
 */
export const GET: APIRoute = async ({ request }) => {
	const secret = import.meta.env.CRON_SECRET;
	if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
		return new Response("Unauthorized", { status: 401 });
	}
	if (!isDbConfigured()) return Response.json({ error: "no_database" }, { status: 503 });
	if (!isMailConfigured()) return Response.json({ error: "no_mail" }, { status: 503 });

	const sql = db();
	const due = (await sql`
		SELECT l.* FROM shop_leads l
		WHERE l.lead_type IN ('ebook', 'sample')
		  AND l.unsubscribed_at IS NULL
		  AND l.next_send_at IS NOT NULL
		  AND l.next_send_at <= now()
		  AND NOT EXISTS (
		    SELECT 1 FROM shop_orders o
		    WHERE lower(o.email) = lower(l.email) AND o.status = 'paid'
		  )
		ORDER BY l.next_send_at
		LIMIT ${BATCH}
	`) as unknown as LeadRow[];

	let sent = 0;
	let finished = 0;
	let failed = 0;

	for (const lead of due) {
		const step = nextStepFor(lead);
		if (!step) {
			// Nothing left to send: clear the schedule so the row stops matching.
			await sql`UPDATE shop_leads SET next_send_at = NULL WHERE id = ${lead.id}`;
			finished++;
			continue;
		}
		const footer = unsubscribeFooter(lead);
		const ok = await sendSequenceEmail(
			lead.email,
			step.subject,
			step.heading,
			step.html(lead) + footer.html,
			`${step.text(lead)}${footer.text}`,
			footer.url,
		);
		if (!ok) {
			failed++;
			continue; // stays due; the next run retries
		}
		const days = daysUntilFollowing(lead.sequence_step);
		await sql`
			UPDATE shop_leads
			SET sequence_step = sequence_step + 1,
			    next_send_at = CASE WHEN ${days}::int IS NULL THEN NULL ELSE now() + make_interval(days => ${days}::int) END
			WHERE id = ${lead.id}
		`;
		sent++;
	}

	console.log(`[lead-sequence] due=${due.length} sent=${sent} finished=${finished} failed=${failed}`);
	return Response.json({ due: due.length, sent, finished, failed });
};
