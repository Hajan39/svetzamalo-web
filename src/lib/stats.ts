import { db } from "./db";

/**
 * Aggregates for /admin. Everything is counted in Postgres rather than by
 * pulling rows into the page, so the numbers stay correct once there are more
 * orders than the listing shows.
 */
export interface ShopStats {
	leads: {
		total: number;
		last7: number;
		last30: number;
		ebook: number;
		newsletter: number;
		topSources: { source: string; count: number }[];
	};
	orders: {
		total: number;
		paid: number;
		pending: number;
		revenueMinor: number;
		paidLast30: number;
		revenueLast30Minor: number;
	};
	downloads: {
		free: number;
		freeLast7: number;
		paid: number;
		paidLast7: number;
	};
}

interface CountRow {
	total: number;
	last7: number;
	last30: number;
	ebook: number;
	newsletter: number;
}

interface OrderRow {
	total: number;
	paid: number;
	pending: number;
	revenue: number;
	paid_last30: number;
	revenue_last30: number;
}

interface DownloadRow {
	free: number;
	free_last7: number;
	paid: number;
	paid_last7: number;
}

export async function loadShopStats(): Promise<ShopStats> {
	const sql = db();

	const [leadRows, sourceRows, orderRows, downloadRows] = await Promise.all([
		sql`
			SELECT
				count(*)::int AS total,
				count(*) FILTER (WHERE created_at > now() - interval '7 days')::int  AS last7,
				count(*) FILTER (WHERE created_at > now() - interval '30 days')::int AS last30,
				count(*) FILTER (WHERE lead_type = 'ebook')::int      AS ebook,
				count(*) FILTER (WHERE lead_type = 'newsletter')::int AS newsletter
			FROM shop_leads
		` as unknown as Promise<CountRow[]>,
		sql`
			SELECT coalesce(source, 'neuvedeno') AS source, count(*)::int AS count
			FROM shop_leads
			GROUP BY 1 ORDER BY count DESC LIMIT 6
		` as unknown as Promise<{ source: string; count: number }[]>,
		sql`
			SELECT
				count(*)::int AS total,
				count(*) FILTER (WHERE status = 'paid')::int    AS paid,
				count(*) FILTER (WHERE status = 'pending')::int AS pending,
				coalesce(sum(amount_minor) FILTER (WHERE status = 'paid'), 0)::int AS revenue,
				count(*) FILTER (WHERE status = 'paid' AND paid_at > now() - interval '30 days')::int AS paid_last30,
				coalesce(sum(amount_minor) FILTER (WHERE status = 'paid' AND paid_at > now() - interval '30 days'), 0)::int AS revenue_last30
			FROM shop_orders
		` as unknown as Promise<OrderRow[]>,
		sql`
			SELECT
				count(*) FILTER (WHERE kind = 'free')::int AS free,
				count(*) FILTER (WHERE kind = 'free' AND created_at > now() - interval '7 days')::int AS free_last7,
				count(*) FILTER (WHERE kind = 'paid')::int AS paid,
				count(*) FILTER (WHERE kind = 'paid' AND created_at > now() - interval '7 days')::int AS paid_last7
			FROM shop_downloads
		` as unknown as Promise<DownloadRow[]>,
	]);

	const lead = leadRows[0];
	const order = orderRows[0];
	const download = downloadRows[0];

	return {
		leads: {
			total: lead?.total ?? 0,
			last7: lead?.last7 ?? 0,
			last30: lead?.last30 ?? 0,
			ebook: lead?.ebook ?? 0,
			newsletter: lead?.newsletter ?? 0,
			topSources: sourceRows ?? [],
		},
		orders: {
			total: order?.total ?? 0,
			paid: order?.paid ?? 0,
			pending: order?.pending ?? 0,
			revenueMinor: order?.revenue ?? 0,
			paidLast30: order?.paid_last30 ?? 0,
			revenueLast30Minor: order?.revenue_last30 ?? 0,
		},
		downloads: {
			free: download?.free ?? 0,
			freeLast7: download?.free_last7 ?? 0,
			paid: download?.paid ?? 0,
			paidLast7: download?.paid_last7 ?? 0,
		},
	};
}

/**
 * Share of people who took the free ebook and went on to buy. Returns null
 * rather than 0 when there is nothing to divide by, so the page can say "not
 * enough data" instead of showing a confident 0 %.
 */
export function conversionRate(stats: ShopStats): number | null {
	if (stats.leads.ebook === 0) return null;
	return (stats.orders.paid / stats.leads.ebook) * 100;
}
