import { createFileRoute, Link } from "@tanstack/react-router";
import { ArticleCard } from "@/components/article";
import { fetchArticleBySlug, fetchArticles } from "@/integrations/strapi/api";
import { strapiQueryKeys, useArticles } from "@/integrations/strapi/hooks";
import { SITE_CONFIG } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n";
import type { Article } from "@/types";

const SITE_URL = SITE_CONFIG.url;

export const Route = createFileRoute("/articles/")({
	loader: async ({ context }) => {
		const { queryClient } = context;

		const articles = await fetchArticles();
		queryClient.setQueryData(strapiQueryKeys.articles.lists(), articles);

		// Prefetch each article so client-side navigation has data in cache
		await Promise.all(
			articles.map((a) =>
				queryClient.prefetchQuery({
					queryKey: strapiQueryKeys.articles.bySlug(a.slug),
					queryFn: () => fetchArticleBySlug(a.slug),
				}),
			),
		);

		return {};
	},
	head: () => ({
		meta: [
			{ title: "Travel Articles & Guides | Lowcost Traveling" },
			{
				name: "description",
				content:
					"Browse our collection of budget travel guides, destination articles, and insider tips to help you explore the world affordably.",
			},
			{
				property: "og:title",
				content: "Travel Articles & Guides | Lowcost Traveling",
			},
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: `${SITE_URL}/articles` },
		],
		links: [{ rel: "canonical", href: `${SITE_URL}/articles` }],
	}),
	component: ArticlesPage,
});

function ArticlesPage() {
	const { t } = useTranslation();
	const { data: articles = [], isLoading, error } = useArticles();

	// Group articles by type
	const _articlesByType = articles.reduce<Record<string, Article[]>>(
		(acc, article) => {
			const type = article.articleType || "other";
			if (!acc[type]) {
				acc[type] = [];
			}
			acc[type].push(article);
			return acc;
		},
		{},
	);

	const _typeLabels: Record<string, string> = {
		"destination-guide": t("articles.typeDestinationGuide"),
		"place-guide": t("articles.typePlaceGuide"),
		"practical-info": t("articles.typePracticalInfo"),
		itinerary: t("articles.typeItinerary"),
		list: t("articles.typeList"),
		other: t("articles.typeOther"),
	};

	if (isLoading) {
		return (
			<div className="container-wide py-12">
				<div className="text-center py-16">
					<p className="text-foreground-secondary">{t("common.loading")}</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container-wide py-12">
				<div className="text-center py-16">
					<p className="text-error">{t("common.errorLoading")}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container-wide py-8 md:py-16">
			<header className="mb-8 md:mb-12">
				<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
					{t("articlesPage.title")}
				</h1>
				<p className="text-base md:text-lg text-foreground-secondary max-w-2xl">
					{t("articlesPage.description")}
				</p>
			</header>

			{articles.length === 0 ? (
				<div className="text-center py-16">
					<p className="text-foreground-secondary mb-4">
						{t("articlesPage.noArticles")}
					</p>
					<Link
						to="/destinations"
						className="text-primary hover:text-primary-hover font-medium"
					>
						{t("articlesPage.exploreDestinations")} →
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{articles.map((article) => (
						<ArticleCard key={article.id} article={article} />
					))}
				</div>
			)}
		</div>
	);
}
