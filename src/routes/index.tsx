import { createFileRoute, Link } from "@tanstack/react-router";
import { DestinationCard } from "@/components/destination";
import { useDestinations, useLatestArticles } from "@/integrations/strapi";
import { useTranslation } from "@/lib/i18n";

const SITE_URL = "https://lowcosttraveling.com";

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "Lowcost Traveling – Budget Travel Guides & Tips" },
			{
				name: "description",
				content:
					"Discover budget-friendly travel guides, insider tips, and destination insights. Plan your next adventure without breaking the bank.",
			},
			{
				property: "og:title",
				content: "Lowcost Traveling – Budget Travel Guides & Tips",
			},
			{
				property: "og:description",
				content: "Discover budget-friendly travel guides and tips.",
			},
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: SITE_URL },
		],
		links: [{ rel: "canonical", href: SITE_URL }],
	}),
	component: HomePage,
});

function HomePage() {
	const { t } = useTranslation();
	const { data: articles = [], isLoading: articlesLoading } =
		useLatestArticles(4);
	const { data: destinations = [], isLoading: destinationsLoading } =
		useDestinations();

	return (
		<div>
			{/* Hero Section */}
			<section className="py-20 md:py-28">
				<div className="container-wide text-center">
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
						{t("homePage.heroTitle")}
					</h1>
					<p className="text-lg md:text-xl text-foreground-secondary max-w-2xl mx-auto mb-10">
						{t("homePage.heroDescription")}
					</p>
					<Link
						to="/destinations"
						className="inline-flex items-center gap-2 bg-foreground hover:bg-foreground/90 text-background font-medium px-8 py-4 rounded-lg transition-colors"
					>
						{t("homePage.exploreDestinations")}
					</Link>
				</div>
			</section>

			{/* Featured Destinations */}
			<section className="py-16 border-t border-border">
				<div className="container-wide">
					<h2 className="text-2xl font-semibold text-foreground mb-8">
						{t("homePage.featuredDestinations")}
					</h2>
					{destinationsLoading ? (
						<div className="text-center py-8 text-foreground-secondary">
							Loading...
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{destinations.slice(0, 6).map((destination) => (
								<DestinationCard
									key={destination.id}
									destination={destination}
								/>
							))}
						</div>
					)}
				</div>
			</section>

			{/* Latest Articles */}
			<section className="py-16 bg-background-secondary">
				<div className="container-wide">
					<h2 className="text-2xl font-semibold text-foreground mb-8">
						{t("homePage.latestTravelGuides")}
					</h2>
					{articlesLoading ? (
						<div className="text-center py-8 text-foreground-secondary">
							Loading...
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{articles.map((article) => (
								<Link
									key={article.id}
									to="/articles/$slug"
									params={{ slug: article.slug }}
									className="group block border border-border rounded-lg p-6 bg-background hover:border-foreground transition-colors"
								>
									<span className="inline-block text-xs font-medium text-foreground-muted uppercase tracking-wide mb-3">
										{article.articleType.replace("-", " ")}
									</span>
									<h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
										{article.title}
									</h3>
									<p className="text-foreground-secondary text-sm line-clamp-2">
										{article.intro}
									</p>
								</Link>
							))}
						</div>
					)}
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20">
				<div className="container-narrow text-center">
					<h2 className="text-2xl font-semibold text-foreground mb-3">
						{t("homePage.readyToStart")}
					</h2>
					<p className="text-foreground-secondary mb-8">
						{t("homePage.newsletterDescription")}
					</p>
					<form className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
						<input
							type="email"
							placeholder={t("homePage.newsletterPlaceholder")}
							className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
						/>
						<button
							type="submit"
							className="w-full sm:w-auto bg-foreground hover:bg-foreground/90 text-background font-medium px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
						>
							{t("homePage.subscribe")}
						</button>
					</form>
				</div>
			</section>
		</div>
	);
}
