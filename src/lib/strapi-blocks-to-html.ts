/**
 * Convert Strapi Blocks (from WordPress migration) to HTML.
 * Strapi blocks format: { type, children?, level?, format?, image?, caption? }
 * Children: { type: 'text', text, bold?, italic?, url? }
 */

const STRAPI_BASE_URL =
	(typeof import.meta !== "undefined" &&
		(import.meta as { env?: { VITE_STRAPI_URL?: string } }).env
			?.VITE_STRAPI_URL) ||
	"";

/** Make sure image URL is absolute (prepend Strapi base if relative) */
function toAbsoluteUrl(url: string): string {
	if (url.startsWith("http")) return url;
	const base = STRAPI_BASE_URL.replace(/\/$/, "");
	return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
}

interface StrapiBlockChild {
	type: string;
	text?: string;
	bold?: boolean;
	italic?: boolean;
	url?: string;
}

interface StrapiBlockImage {
	url?: string;
	alternativeText?: string;
	width?: number;
	height?: number;
}

interface StrapiBlock {
	type: string;
	children?:
		| StrapiBlockChild[]
		| { type: string; children?: StrapiBlockChild[] }[];
	level?: number;
	format?: string;
	image?: StrapiBlockImage;
	caption?: string;
}

function renderChildren(children: StrapiBlockChild[] | undefined): string {
	if (!children || children.length === 0) return "";
	return children
		.map((c) => {
			if (c.type !== "text" || !c.text) return "";
			const internalLinkMatch = c.text.match(
				/\[INTERNAL_LINK:\s*([a-z0-9-]+)\s*\]/i,
			);

			let html = escapeHtml(c.text);
			if (!c.url && internalLinkMatch) {
				const slug = internalLinkMatch[1];
				const href = `/articles/${slug}`;
				const linkText = c.text.replace(internalLinkMatch[0], "").trim() || slug;
				html = `<a href="${escapeAttr(href)}">${escapeHtml(linkText)}</a>`;
			}
			if (c.bold) html = `<strong>${html}</strong>`;
			if (c.italic) html = `<em>${html}</em>`;
			if (c.url) html = `<a href="${escapeAttr(c.url)}">${html}</a>`;
			return html;
		})
		.join("");
}

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function escapeAttr(s: string): string {
	return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function parseImageCaptionLayout(caption?: string): {
	layoutClass: string;
	cleanCaption?: string;
} {
	if (!caption) {
		return { layoutClass: "" };
	}

	const trimmed = caption.trim();
	if (/^\[half\]/i.test(trimmed)) {
		return {
			layoutClass: " image-half",
			cleanCaption: trimmed.replace(/^\[half\]\s*/i, ""),
		};
	}

	return { layoutClass: "", cleanCaption: caption };
}

export function strapiBlocksToHtml(blocks: StrapiBlock[] | unknown): string {
	if (!Array.isArray(blocks) || blocks.length === 0) return "";

	const parts: string[] = [];
	for (const block of blocks) {
		const b = block as StrapiBlock;
		const children = b.children as StrapiBlockChild[] | undefined;
		const text = renderChildren(children);

		switch (b.type) {
			case "paragraph":
				parts.push(`<p>${text || "&nbsp;"}</p>`);
				break;
			case "heading": {
				const level = Math.min(6, Math.max(1, b.level ?? 2));
				parts.push(`<h${level}>${text}</h${level}>`);
				break;
			}
			case "quote":
				parts.push(`<blockquote>${text}</blockquote>`);
				break;
			case "list": {
				const tag = b.format === "ordered" ? "ol" : "ul";
				const listItems = (b.children ?? []) as {
					type: string;
					children?: StrapiBlockChild[];
				}[];
				const items = listItems
					.filter((item) => item.type === "list-item")
					.map((item) => `<li>${renderChildren(item.children)}</li>`)
					.join("");
				parts.push(`<${tag}>${items}</${tag}>`);
				break;
			}
			case "image": {
				const img = b.image;
				if (img?.url) {
					const src = escapeAttr(toAbsoluteUrl(img.url));
					const alt = escapeAttr(img.alternativeText ?? "");
					const widthAttr = img.width ? ` width="${img.width}"` : "";
					const heightAttr = img.height ? ` height="${img.height}"` : "";
					const { layoutClass, cleanCaption } = parseImageCaptionLayout(b.caption);
					let html = `<figure class="article-figure${layoutClass}"><img src="${src}" alt="${alt}"${widthAttr}${heightAttr} loading="lazy" style="max-width:100%;height:auto" />`;
					if (cleanCaption && cleanCaption.trim()) {
						html += `<figcaption>${escapeHtml(cleanCaption)}</figcaption>`;
					}
					html += "</figure>";
					parts.push(html);
				}
				break;
			}
			case "code":
				parts.push(`<pre><code>${text}</code></pre>`);
				break;
			default:
				parts.push(`<p>${text || "&nbsp;"}</p>`);
		}
	}
	return parts.join("\n");
}
