import { createFileRoute, Link } from "@tanstack/react-router";
import { ArticleCard } from "@/components/article";
import { EmptyState, PageHeader } from "@/components/common";
import { fetchArticleBySlug, fetchArticles } from "@/integrations/strapi/api";
import { strapiQueryKeys, useArticles } from "@/integrations/strapi/hooks";
import { SITE_CONFIG } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n";

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
			<PageHeader
				title={t("articlesPage.title")}
				description={t("articlesPage.description")}
			/>

			{articles.length === 0 ? (
				<EmptyState
					title={t("articlesPage.noArticles")}
					action={
						<Link
							to="/destinations"
							className="font-medium text-primary hover:text-primary-hover"
						>
							{t("articlesPage.exploreDestinations")} →
						</Link>
					}
				/>
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
