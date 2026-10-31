import type { Product, ProductVariant, SupportedLocale } from "@/types";
import { stegaClean } from "@sanity/client/stega";
import { cleanCmsCopy } from "@/lib/typography";
import { loadQuery } from "./loadQuery";
import { sanityPortableTextToHtml } from "./portableText";

interface SanityProductImage {
	asset?: {
		url?: string;
		metadata?: { dimensions?: { width?: number; height?: number } };
	};
	alt?: string;
}

interface SanityProduct {
	_id: string;
	slug?: string;
	title: string;
	locale?: string;
	productType?: string;
	available?: boolean;
	summary?: string;
	description?: unknown[];
	sortOrder?: number;
	images?: SanityProductImage[];
	variants?: {
		label?: string;
		sku?: string;
		priceCzk?: number;
		available?: boolean;
	}[];
	seoTitle?: string;
	seoDescription?: string;
}

const productProjection = `
  _id,
  "slug": slug.current,
  title,
  locale,
  productType,
  available,
  summary,
  description,
  sortOrder,
  images[]{asset->{url, metadata{dimensions}}, alt},
  variants[]{label, sku, priceCzk, available},
  seoTitle,
  seoDescription
`;

function clean(value?: string): string | undefined {
	return value ? cleanCmsCopy(stegaClean(value)) : undefined;
}

const PRODUCT_TYPES = new Set(["print", "merch", "book"]);

function transformProduct(product: SanityProduct): Product {
	const title = cleanCmsCopy(product.title);
	const slug = stegaClean(product.slug || "");
	const summary = clean(product.summary);
	const rawType = stegaClean(product.productType || "print");
	const descriptionHtml = sanityPortableTextToHtml(product.description);

	const variants: ProductVariant[] = (product.variants ?? [])
		.map((variant) => ({
			label: cleanCmsCopy(stegaClean(variant.label || "")),
			sku: stegaClean(variant.sku || ""),
			priceCzk: Number(variant.priceCzk) || 0,
			available: variant.available,
		}))
		.filter((variant) => variant.sku && variant.label && variant.priceCzk > 0);

	return {
		id: product._id,
		slug,
		title,
		locale: (stegaClean(product.locale || "cs") as SupportedLocale) || "cs",
		productType: (PRODUCT_TYPES.has(rawType)
			? rawType
			: "print") as Product["productType"],
		available: product.available,
		summary,
		descriptionHtml: descriptionHtml || undefined,
		sortOrder: product.sortOrder,
		images: (product.images ?? [])
			.map((image) => ({
				src: image.asset?.url || "",
				alt: clean(image.alt) || title,
				width: image.asset?.metadata?.dimensions?.width,
				height: image.asset?.metadata?.dimensions?.height,
			}))
			.filter((image) => image.src),
		variants,
		seo: {
			metaTitle: clean(product.seoTitle) || `${title} | Svět za málo`,
			metaDescription: clean(product.seoDescription) || summary || "",
		},
	};
}

/** A product is only sellable once it is on sale and something in it is in stock. */
export function isProductBuyable(product: Product): boolean {
	if (product.available === false) return false;
	return product.variants.some((variant) => variant.available !== false);
}

export async function fetchProducts(
	locale: SupportedLocale = "cs",
	options: { perspectiveCookie?: string } = {},
): Promise<Product[]> {
	try {
		const { data } = await loadQuery<SanityProduct[]>({
			query: `*[_type == "product" && available != false && locale == $locale]{
        ${productProjection}
      } | order(coalesce(sortOrder, 100) asc, title asc)`,
			params: { locale },
			...options,
		});
		return (data ?? []).map(transformProduct).filter((p) => p.slug);
	} catch (error) {
		console.warn("Sanity fetch products failed:", error);
		return [];
	}
}

export async function fetchProductBySlug(
	slug: string,
	locale: SupportedLocale = "cs",
	options: { perspectiveCookie?: string } = {},
): Promise<Product | null> {
	try {
		const { data } = await loadQuery<SanityProduct | null>({
			query: `*[_type == "product" && slug.current == $slug && locale == $locale][0]{
        ${productProjection}
      }`,
			params: { slug, locale },
			...options,
		});
		return data ? transformProduct(data) : null;
	} catch (error) {
		console.warn("Sanity fetch product failed:", error);
		return null;
	}
}

export interface CatalogueVariant {
	product: Product;
	variant: ProductVariant;
}

/**
 * The checkout's source of truth for price and availability.
 *
 * The browser sends SKUs and quantities and nothing else that costs money: the
 * price it displayed is never carried into the order, because a hand-edited
 * request would otherwise set its own total. Every SKU is looked up here and
 * priced from the catalogue.
 */
export async function fetchVariantsBySku(
	skus: string[],
	locale: SupportedLocale = "cs",
): Promise<Map<string, CatalogueVariant>> {
	const unique = [...new Set(skus.filter(Boolean))];
	if (unique.length === 0) return new Map();

	const found = new Map<string, CatalogueVariant>();
	try {
		const { data } = await loadQuery<SanityProduct[]>({
			query: `*[_type == "product" && available != false && locale == $locale
        && count(variants[sku in $skus]) > 0]{${productProjection}}`,
			params: { skus: unique, locale },
		});

		for (const raw of data ?? []) {
			const product = transformProduct(raw);
			for (const variant of product.variants) {
				if (unique.includes(variant.sku) && !found.has(variant.sku)) {
					found.set(variant.sku, { product, variant });
				}
			}
		}
	} catch (error) {
		console.warn("Sanity fetch variants failed:", error);
		return new Map();
	}

	return found;
}
