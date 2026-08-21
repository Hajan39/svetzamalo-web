// Best-effort spam protection for the public POST endpoints (orders, leads).
//
// The rate limiter is in-memory, so on serverless it only sees requests that
// hit the same warm instance and it resets on cold start. That is enough to
// blunt naive burst bots without adding a service or latency; a determined
// attacker needs an edge/WAF rule instead. Every blocked request is one fewer
// billed call to the order/lead backend.

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS_PER_WINDOW = 8;
const MAX_TRACKED_KEYS = 2000;

const hitLog = new Map<string, number[]>();

function clientKey(request: Request, bucket: string): string {
	const forwarded = request.headers.get("x-forwarded-for") || "";
	const ip = forwarded.split(",")[0]?.trim() || "unknown";
	return `${bucket}:${ip}`;
}

export function isRateLimited(request: Request, bucket: string): boolean {
	const key = clientKey(request, bucket);
	const now = Date.now();
	const recent = (hitLog.get(key) || []).filter(
		(timestamp) => now - timestamp < WINDOW_MS,
	);
	recent.push(now);

	if (hitLog.size >= MAX_TRACKED_KEYS && !hitLog.has(key)) {
		const oldestKey = hitLog.keys().next().value;
		if (oldestKey) hitLog.delete(oldestKey);
	}
	hitLog.set(key, recent);

	return recent.length > MAX_HITS_PER_WINDOW;
}

// A filled-in "website" field means a bot tripped the honeypot
// (HoneypotField.astro). Callers should answer with a normal-looking success
// so the bot gets no signal to adapt to.
export function isHoneypotTripped(body: unknown): boolean {
	if (!body || typeof body !== "object") return false;
	const value = (body as Record<string, unknown>).website;
	return typeof value === "string" && value.trim().length > 0;
}
