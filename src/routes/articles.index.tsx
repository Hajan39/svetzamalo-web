import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArticleCard } from "@/components/article";
import { EmptyState, PageHeader } from "@/components/common";
import { fetchArticles } from "@/integrations/strapi/api";
import { strapiQueryKeys, useInfiniteArticles } from "@/integrations/strapi/hooks";
import { SITE_CONFIG } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n";

const SITE_URL = SITE_CONFIG.url;

export const Route = createFileRoute("/articles/")({
	loader: async ({ context }) => {
		const { queryClient } = context;

		const articles = await fetchArticles();
		queryClient.setQueryData(strapiQueryKeys.articles.lists(), articles);

		return {};
	},
	head: () => ({
		meta: [
			{ title: "Travel Articles & Guides | Svět za málo" },
			{
				name: "description",
				content:
					"Browse our collection of budget travel guides, destination articles, and insider tips to help you explore the world affordably.",
			},
			{
				property: "og:title",
				content: "Travel Articles & Guides | Svět za málo",
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
	const {
		data,
		isLoading,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteArticles();

	const sentinelRef = useRef<HTMLDivElement>(null);
	const [query, setQuery] = useState("");

	useEffect(() => {
		const el = sentinelRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ rootMargin: "200px" },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	const articles = data?.pages.flatMap((p) => p.articles) ?? [];

	const normalizedQuery = query.trim().toLowerCase();
	const filteredArticles = normalizedQuery
		? articles.filter(
				(a) =>
					a.title.toLowerCase().includes(normalizedQuery) ||
					(a.intro ?? "").toLowerCase().includes(normalizedQuery),
			)
		: articles;

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

			<div className="mb-8 max-w-md">
				<input
					type="search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder={t("articlesPage.searchPlaceholder")}
					className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
				/>
			</div>

			{filteredArticles.length === 0 && !isLoading ? (
				normalizedQuery ? (
					<div className="text-center py-16">
						<p className="text-foreground-secondary">{t("articlesPage.noSearchResults")}</p>
					</div>
				) : (
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
				)
			) : (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredArticles.map((article) => (
							<ArticleCard key={article.id} article={article} variant="block" />
						))}
					</div>
					{!normalizedQuery && (
						<div ref={sentinelRef} className="py-8 text-center">
							{isFetchingNextPage && (
								<p className="text-foreground-secondary">{t("common.loading")}</p>
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
}
