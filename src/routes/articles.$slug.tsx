import { createFileRoute } from "@tanstack/react-router";
import {
	ArticleCard,
	ArticleHero,
	ArticleHtmlContent,
	ArticlePlaces,
	ArticleSection,
} from "@/components/article";
import { EmptyState } from "@/components/common";
import {
	AffiliateBox,
	LeadMagnet,
	NewsletterCta,
} from "@/components/monetization";
import { Breadcrumbs } from "@/components/seo";
import { ArticleStructuredData } from "@/components/seo/StructuredData";
import {
	fetchArticleBySlug,
	fetchDestinationById,
} from "@/integrations/strapi/api";
import {
	strapiQueryKeys,
	useArticles,
	useArticleBySlug,
	useArticlesByDestination,
	useDestinationById,
} from "@/integrations/strapi/hooks";
import { SITE_CONFIG } from "@/lib/constants";
import { getPathWithoutLocale, useTranslation } from "@/lib/i18n";

const SITE_URL = SITE_CONFIG.url;

export const Route = createFileRoute("/articles/$slug")({
	loader: async ({ params, context, location }) => {
		const { queryClient } = context;
		const { locale } = getPathWithoutLocale(location.pathname);

		const article = await fetchArticleBySlug(params.slug, locale);
		if (article) {
			// Prefetch destination if needed
			if (article.destinationId) {
				await queryClient.prefetchQuery({
					queryKey: strapiQueryKeys.destinations.detail(
						article.destinationId,
						locale,
					),
					// biome-ignore lint/style/noNonNullAssertion: destinationId checked above
					queryFn: () => fetchDestinationById(article.destinationId!, locale),
				});
			}
		}

		return { article };
	},
	head: ({ loaderData, params }) => {
		const article = loaderData?.article;
		if (!article) {
			return {
				meta: [
					{ title: "Article Not Found | Svět za málo" },
					{ name: "robots", content: "noindex,follow" },
				],
			};
		}
		const canonicalUrl = `${SITE_URL}/articles/${params.slug}`;
		return {
			meta: [
				{ title: article.seo.metaTitle },
				{ name: "description", content: article.seo.metaDescription },
				{ name: "keywords", content: article.seo.keywords.join(", ") },
				{
					property: "og:title",
					content: article.seo.ogTitle || article.seo.metaTitle,
				},
				{
					property: "og:description",
					content: article.seo.ogDescription || article.seo.metaDescription,
				},
				{ property: "og:type", content: "article" },
				{ property: "og:url", content: canonicalUrl },
				...(article.seo.ogImage
					? [{ property: "og:image", content: article.seo.ogImage.src }]
					: []),
			],
			links: [{ rel: "canonical", href: canonicalUrl }],
		};
	},
	component: ArticlePage,
});

function ArticlePage() {
	const { t } = useTranslation();
	const { slug } = Route.useParams();
	const { article: loaderArticle } = Route.useLoaderData();

	// Use React Query hook for reactive updates
	const {
		data: article,
		isLoading,
		error,
	} = useArticleBySlug(slug, {
		initialData: loaderArticle || undefined,
	});

	const { data: destination } = useDestinationById(
		article?.destinationId || "",
		{
			enabled: !!article?.destinationId,
		},
	);

	const { data: sameDestinationArticles = [] } = useArticlesByDestination(
		article?.destinationId || "",
		{
			enabled: !!article?.destinationId,
		},
	);

	const { data: allArticles = [] } = useArticles({ enabled: !!article });

	if (isLoading) {
		return (
			<div className="container-narrow py-16">
				<div className="text-center">
					<p className="text-foreground-secondary">
						{t("common.loadingArticle")}
					</p>
				</div>
			</div>
		);
	}

	if (error || !article) {
		return (
			<div className="container-narrow py-16">
				<EmptyState
					title={t("errors.articleNotFound")}
					description={t("articlesPage.notFoundDescription")}
					action={
						<a
							href="/articles"
							className="inline-block text-primary hover:underline"
						>
							← {t("common.backToArticles")}
						</a>
					}
				/>
				{error ? (
					<p className="mt-3 text-center text-error text-sm">{error.message}</p>
				) : null}
			</div>
		);
	}

	const currentUrl = `${SITE_URL}/articles/${slug}`;
	const destinationCandidates = sameDestinationArticles.filter(
		(candidate) => candidate.slug !== article.slug,
	);
	const fallbackCandidates = allArticles.filter(
		(candidate) =>
			candidate.slug !== article.slug &&
			!destinationCandidates.some((existing) => existing.slug === candidate.slug),
	);
	const recommendedArticles = [...destinationCandidates, ...fallbackCandidates].slice(
		0,
		3,
	);

	return (
		<>
			{/* Structured Data */}
			<ArticleStructuredData article={article} url={currentUrl} />

			<article className="container-narrow py-8 md:py-12">
				{/* Breadcrumbs */}
				<Breadcrumbs
					items={[
						{ label: t("nav.destinations"), href: "/destinations" },
						...(destination
							? [
									{
										label: destination.name,
										href: `/destinations/guide/${destination.slug}`,
									},
								]
							: []),
						{ label: article.title },
					]}
				/>

				{/* Hero */}
				<ArticleHero
					title={article.title}
					intro={article.intro}
					coverImage={article.coverImage}
					publishedAt={article.publishedAt}
					updatedAt={article.updatedAt}
				/>

				{/* Content - HTML (WordPress) or structured sections */}
				{article.htmlContent ? (
					<div className="space-y-12">
						<ArticleHtmlContent html={article.htmlContent} />
					</div>
				) : (
					<div className="space-y-12">
						{article.sections.map((section) => (
							<div key={section.id}>
								<ArticleSection section={section} />

								{/* Contextual affiliate after "Getting There" section */}
								{section.id === "getting-there" && destination && (
									<AffiliateBox
										type="flight"
										headline={`${t("articlePage.bookFlightTo")} ${destination.name}`}
										description={t("articlePage.flightAffiliateDescription")}
										ctaText={t("articlePage.searchFlights")}
										link={`https://www.skyscanner.com/transport/flights/to/${destination.slug}`}
										partner="Skyscanner"
									/>
								)}

								{/* Contextual affiliate after "Where to Stay" section */}
								{section.id === "where-to-stay" && destination && (
									<AffiliateBox
										type="hotel"
										headline={`${t("articlePage.findAccommodationIn")} ${destination.name}`}
										description={`${t("articlePage.hotelAffiliateDescription")} ${t("articlePage.budgetLabel")}: $${destination.currency.budgetPerDay.budget}/${t("articlePage.perNight")}, ${t("articlePage.midRangeLabel")}: $${destination.currency.budgetPerDay.midRange}/${t("articlePage.perNight")}.`}
										ctaText={t("articlePage.checkPrices")}
										link={`https://www.booking.com/destination/${destination.slug}`}
										partner="Booking.com"
									/>
								)}
							</div>
						))}
					</div>
				)}

				{/* Places */}
				<ArticlePlaces places={article.places} />

				{/* Lead Magnet */}
				{destination && (
					<LeadMagnet
						title={`${t("articlePage.freeLabel")}: ${destination.name} ${t("articlePage.budgetPlannerTitle")}`}
						description={t("articlePage.leadMagnetDescription")}
						benefits={[
							t("articlePage.leadMagnetBenefitTracker"),
							t("articlePage.leadMagnetBenefitChecklist"),
							t("articlePage.leadMagnetBenefitContacts"),
							t("articlePage.leadMagnetBenefitPhrases"),
						]}
						ctaText={t("articlePage.getFreeDownload")}
					/>
				)}

				{/* Recommended reading */}
				{recommendedArticles.length > 0 && (
					<section className="mt-14 md:mt-16">
						<div className="mb-6">
							<h2 className="text-2xl font-bold text-foreground sm:text-3xl">
								{t("articlePage.recommendedReadingTitle")}
							</h2>
							<p className="mt-2 text-sm text-foreground-secondary sm:text-base">
								{destination
									? `${t("articlePage.recommendedReadingInCountry")} ${destination.name}`
									: t("articlePage.recommendedReadingFallback")}
							</p>
						</div>
						<div className="grid gap-4 md:grid-cols-3">
							{recommendedArticles.map((recommended) => (
								<ArticleCard
									key={recommended.id}
									article={recommended}
									variant="default"
								/>
							))}
						</div>
					</section>
				)}

				{/* Newsletter CTA at end */}
				<div className="mt-16">
					<NewsletterCta />
				</div>
			</article>
		</>
	);
}
