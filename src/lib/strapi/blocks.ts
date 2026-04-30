const STRAPI_BASE_URL = (
	import.meta.env.STRAPI_URL ||
	import.meta.env.PUBLIC_STRAPI_URL ||
	"http://localhost:1337"
).replace(/\/$/, "");

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

function toAbsoluteUrl(url: string): string {
	if (url.startsWith("http")) return url;
	return `${STRAPI_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function escapeAttr(value: string): string {
	return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function renderChildren(children: StrapiBlockChild[] | undefined): string {
	if (!children?.length) return "";
	return children
		.map((child) => {
			if (child.type !== "text" || !child.text) return "";
			const internalLinkMatch = child.text.match(
				/\[INTERNAL_LINK:\s*([a-z0-9-]+)\s*\]/i,
			);
			let html = escapeHtml(child.text);

			if (!child.url && internalLinkMatch) {
				const slug = internalLinkMatch[1];
				const linkText =
					child.text.replace(internalLinkMatch[0], "").trim() || slug;
				html = `<a href="/articles/${escapeAttr(slug)}">${escapeHtml(linkText)}</a>`;
			}

			if (child.bold) html = `<strong>${html}</strong>`;
			if (child.italic) html = `<em>${html}</em>`;
			if (child.url) html = `<a href="${escapeAttr(child.url)}">${html}</a>`;
			return html;
		})
		.join("");
}

export function strapiBlocksToHtml(blocks: unknown): string {
	if (!Array.isArray(blocks) || blocks.length === 0) return "";

	return blocks
		.map((block) => {
			const item = block as StrapiBlock;
			const children = item.children as StrapiBlockChild[] | undefined;
			const text = renderChildren(children);

			switch (item.type) {
				case "paragraph":
					return `<p>${text || "&nbsp;"}</p>`;
				case "heading": {
					const level = Math.min(6, Math.max(1, item.level ?? 2));
					return `<h${level}>${text}</h${level}>`;
				}
				case "quote":
					return `<blockquote>${text}</blockquote>`;
				case "list": {
					const tag = item.format === "ordered" ? "ol" : "ul";
					const listItems = (item.children ?? []) as {
						type: string;
						children?: StrapiBlockChild[];
					}[];
					const items = listItems
						.filter((listItem) => listItem.type === "list-item")
						.map((listItem) => `<li>${renderChildren(listItem.children)}</li>`)
						.join("");
					return `<${tag}>${items}</${tag}>`;
				}
				case "image": {
					if (!item.image?.url) return "";
					const src = escapeAttr(toAbsoluteUrl(item.image.url));
					const alt = escapeAttr(item.image.alternativeText ?? "");
					const widthAttr = item.image.width
						? ` width="${item.image.width}"`
						: "";
					const heightAttr = item.image.height
						? ` height="${item.image.height}"`
						: "";
					const caption = item.caption?.trim();
					return `<figure class="article-figure"><img src="${src}" alt="${alt}"${widthAttr}${heightAttr} loading="lazy" style="max-width:100%;height:auto" />${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}</figure>`;
				}
				case "code":
					return `<pre><code>${text}</code></pre>`;
				default:
					return `<p>${text || "&nbsp;"}</p>`;
			}
		})
		.filter(Boolean)
		.join("\n");
}
