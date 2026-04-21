import { createFileRoute, Link } from "@tanstack/react-router";
import { ArticleCard, ArticleHtmlContent } from "@/components/article";
import { EmptyState, SmartImage } from "@/components/common";
import { NewsletterCta } from "@/components/monetization";
import { Breadcrumbs } from "@/components/seo";
import { fetchDestinationBySlug } from "@/integrations/strapi/api";
import {
	strapiQueryKeys,
	useArticles,
	useArticlesByDestination,
	useDestinationBySlug,
} from "@/integrations/strapi/hooks";
import { SITE_CONFIG } from "@/lib/constants";
import { getPathWithoutLocale, useTranslation } from "@/lib/i18n";

const SITE_URL = SITE_CONFIG.url;

export const Route = createFileRoute("/destinations/guide/$slug")({
	loader: async ({ params, context, location }) => {
		const { queryClient } = context;
		const { locale } = getPathWithoutLocale(location.pathname);
		const destination = await fetchDestinationBySlug(params.slug, locale);
		if (destination) {
			await queryClient.prefetchQuery({
				queryKey: strapiQueryKeys.destinations.bySlug(params.slug, locale),
				queryFn: () => fetchDestinationBySlug(params.slug, locale),
			});
		}
		return { destination };
	},
	head: ({ loaderData, params }) => {
		const dest = loaderData?.destination;
		if (!dest) {
			return {
				meta: [
					{ title: "Destination Not Found | Svět za málo" },
					{ name: "robots", content: "noindex,follow" },
				],
			};
		}
		const canonicalUrl = `${SITE_URL}/destinations/guide/${params.slug}`;
		return {
			meta: [
				{ title: dest.seo.metaTitle },
				{ name: "description", content: dest.seo.metaDescription },
				{ name: "keywords", content: dest.seo.keywords.join(", ") },
				{ property: "og:title", content: dest.seo.metaTitle },
				{ property: "og:description", content: dest.seo.metaDescription },
				{ property: "og:type", content: "website" },
				{ property: "og:url", content: canonicalUrl },
			],
			links: [{ rel: "canonical", href: canonicalUrl }],
		};
	},
	component: DestinationGuidePage,
});

function DestinationGuidePage() {
	const { t } = useTranslation();
	const { slug } = Route.useParams();
	const { destination: loaderDest } = Route.useLoaderData();
	const {
		data: destination,
		isLoading,
		error,
	} = useDestinationBySlug(slug, {
		initialData: loaderDest || undefined,
	});
	const { data: relatedArticles = [] } = useArticlesByDestination(slug);
	const { data: allArticles = [] } = useArticles({
		enabled: relatedArticles.length === 0,
	});

	const normalizeKey = (value: string) =>
		value
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");

	const destinationSlugBase = normalizeKey(slug).replace(/-(cs|en)$/, "");
	const destinationNameBase = normalizeKey(destination?.name || "");
	const matchingKeys = [destinationSlugBase, destinationNameBase].filter(
		(key): key is string => !!key,
	);

	const fallbackDestinationArticles = allArticles.filter((article) => {
		const articleSlug = normalizeKey(article.slug);
		return matchingKeys.some((key) =>
			articleSlug === key ||
			articleSlug.startsWith(`${key}-`) ||
			articleSlug.includes(`-${key}-`),
		);
	});

	const visibleArticles =
		relatedArticles.length > 0 ? relatedArticles : fallbackDestinationArticles;

	if (isLoading) {
		return (
			<div className="container-narrow py-16 text-center">
				<p className="text-foreground-secondary">{t("common.loading")}</p>
			</div>
		);
	}

	if (error || !destination) {
		return (
			<div className="container-narrow py-16">
				<EmptyState
					title={t("errors.destinationNotFound")}
					description={t("destinationsPage.notFoundDescription")}
					action={
						<Link
							to="/destinations"
							className="inline-block text-primary hover:underline"
						>
							← {t("common.backToDestinations")}
						</Link>
					}
				/>
			</div>
		);
	}

	const heroImage = destination.heroImage as
		| { url?: string; src?: string }
		| undefined;
	const coverImage = heroImage?.url ?? heroImage?.src;

	return (
		<article className="container-narrow py-8 md:py-12">
			<Breadcrumbs
				items={[
					{ label: t("nav.destinations"), href: "/destinations" },
					{ label: destination.name },
				]}
			/>

			<div className="mb-8">
				<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
					{destination.name}
				</h1>
				<div className="aspect-16/10 sm:aspect-video md:aspect-21/9 rounded-lg overflow-hidden bg-background-secondary">
					<SmartImage
						src={coverImage}
						alt={destination.name}
						className="w-full h-full object-cover"
						loading="lazy"
						fallbackLabel={destination.name}
					/>
				</div>
			</div>

			{destination.introHtml && (
				<div className="space-y-8">
					<ArticleHtmlContent html={destination.introHtml} />
				</div>
			)}

			{visibleArticles.length > 0 && (
				<section className="mt-12 md:mt-16">
					<h2 className="mb-6 text-2xl font-bold text-foreground">
						{t("header.navArticles")}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
						{visibleArticles.map((article) => (
							<ArticleCard key={article.id} article={article} />
						))}
					</div>
				</section>
			)}

			<div className="mt-16">
				<NewsletterCta />
			</div>
		</article>
	);
}
