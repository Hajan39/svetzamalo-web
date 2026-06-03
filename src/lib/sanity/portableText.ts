import { toHTML } from "@portabletext/to-html";

interface SanityImageValue {
	asset?: {
		url?: string;
		metadata?: {
			dimensions?: {
				width?: number;
				height?: number;
			};
		};
	};
	alt?: string;
	caption?: string;
}

interface InternalArticleLinkValue {
	slug?: string;
	articleSlug?: string;
}

interface ExternalLinkValue {
	href?: string;
}

interface AffiliateLinkRefValue {
	slug?: string;
	affiliateSlug?: string;
	enabled?: boolean;
	relSponsored?: boolean;
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function escapeAttr(value: string): string {
	return escapeHtml(value).replace(/'/g, "&#39;");
}

export function sanityPortableTextToHtml(value: unknown): string {
	if (!Array.isArray(value) || value.length === 0) return "";

	return toHTML(value, {
		components: {
			types: {
				articleImage: ({ value: imageValue }) => {
					const image = imageValue as SanityImageValue;
					const url = image.asset?.url;
					if (!url) return "";

					const width = image.asset?.metadata?.dimensions?.width;
					const height = image.asset?.metadata?.dimensions?.height;
					const widthAttr = width ? ` width="${width}"` : "";
					const heightAttr = height ? ` height="${height}"` : "";
					const caption = image.caption?.trim();
					const optimizedUrl = `${url}?w=900&auto=format&q=80`;

					return `<figure class="article-figure"><img src="${escapeAttr(optimizedUrl)}" alt="${escapeAttr(image.alt || "")}"${widthAttr}${heightAttr} loading="lazy" style="max-width:100%;height:auto" />${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}</figure>`;
				},
			},
			marks: {
				link: ({ children, value }) => {
					const link = value as ExternalLinkValue;
					if (!link.href) return children;
					return `<a href="${escapeAttr(link.href)}">${children}</a>`;
				},
				internalArticleLink: ({ children, value }) => {
					const link = value as InternalArticleLinkValue;
					const slug = link.articleSlug || link.slug;
					if (!slug) return children;
					return `<a href="/articles/${escapeAttr(slug)}">${children}</a>`;
				},
				affiliateLinkRef: ({ children, value }) => {
					const link = value as AffiliateLinkRefValue;
					const slug = link.affiliateSlug || link.slug;
					if (!slug || link.enabled === false) return children;
					const relAttr =
						link.relSponsored === false ? "" : ' rel="sponsored nofollow"';
					return `<a href="/go/${escapeAttr(slug)}"${relAttr}>${children}</a>`;
				},
			},
		},
	});
}

export interface AffiliateLinkForReplacement {
	slug: string;
	keywords: string[];
	relSponsored: boolean;
}

const VOID_ELEMENTS = new Set([
	"area", "base", "br", "col", "embed", "hr", "img", "input",
	"link", "meta", "param", "source", "track", "wbr",
]);

const NO_REPLACE_TAGS = new Set(["a", "code", "pre", "script", "style"]);

export function replaceAffiliateKeywords(
	html: string,
	links: AffiliateLinkForReplacement[],
): string {
	if (!html) return html;
	const active = links.filter((l) => l.keywords.length > 0);
	if (active.length === 0) return html;

	// Build lowercase keyword → link map; first definition wins on duplicates
	const keywordMap = new Map<string, { slug: string; relSponsored: boolean }>();
	for (const link of active) {
		for (const kw of link.keywords) {
			if (kw && !keywordMap.has(kw.toLowerCase())) {
				keywordMap.set(kw.toLowerCase(), {
					slug: link.slug,
					relSponsored: link.relSponsored,
				});
			}
		}
	}

	// Longest keyword first so "Booking.com" wins over "Booking" in the alternation
	const sorted = [...keywordMap.keys()].sort((a, b) => b.length - a.length);
	const pattern = sorted
		.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
		.join("|");
	const regex = new RegExp(`\\b(${pattern})\\b`, "gi");

	// Walk tag-by-tag; only substitute inside text nodes outside no-replace tags
	const tagStack: string[] = [];
	const parts = html.split(/(<[^>]+>)/);
	let result = "";

	for (const part of parts) {
		if (part.startsWith("<")) {
			const m = part.match(/^<\/?([a-zA-Z][a-zA-Z0-9]*)/);
			const tag = m?.[1]?.toLowerCase() ?? "";
			const isClosing = part.startsWith("</");
			if (
				!isClosing &&
				tag &&
				!VOID_ELEMENTS.has(tag) &&
				!part.endsWith("/>")
			) {
				tagStack.push(tag);
			} else if (isClosing && tag) {
				const idx = tagStack.lastIndexOf(tag);
				if (idx !== -1) tagStack.splice(idx, 1);
			}
			result += part;
		} else if (tagStack.some((t) => NO_REPLACE_TAGS.has(t))) {
			result += part;
		} else {
			result += part.replace(regex, (match) => {
				const info = keywordMap.get(match.toLowerCase());
				if (!info) return match;
				const rel = info.relSponsored ? ' rel="sponsored nofollow"' : "";
				return `<a href="/go/${info.slug}"${rel}>${match}</a>`;
			});
		}
	}

	return result;
}
