import { createFileRoute } from "@tanstack/react-router";
import { ArticleCard } from "@/components/article/ArticleCard";
import { useLatestArticles } from "@/integrations/strapi";
import { EXTERNAL_SERVICES } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n";
import type { Article } from "@/types";

const SITE_URL = "https://lowcosttraveling.com";

/** Placeholder articles when Strapi is empty – for layout preview */
const MOCK_ARTICLES: Article[] = [
	{
		id: "mock-1",
		slug: "top-10-andorra",
		destinationId: "andorra",
		articleType: "list",
		title: "Top 10 things to do in Andorra",
		intro: "From skiing in Grandvalira to duty-free shopping in Andorra la Vella, here are the best experiences for budget travellers in this tiny Pyrenean country.",
		sections: [],
		places: [],
		seo: { metaTitle: "Top 10 Andorra", metaDescription: "Best things to do in Andorra.", keywords: [] },
		coverImage: { src: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&fit=crop", alt: "Andorra mountains" },
	},
	{
		id: "mock-2",
		slug: "best-beaches-thailand",
		destinationId: "thailand",
		articleType: "list",
		title: "Best beaches in Thailand on a budget",
		intro: "Skip the crowded resorts and discover quieter shores where you can still find cheap bungalows, local food, and clear water without breaking the bank.",
		sections: [],
		places: [],
		seo: { metaTitle: "Best beaches Thailand", metaDescription: "Budget beaches in Thailand.", keywords: [] },
		coverImage: { src: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&fit=crop", alt: "Thai beach" },
	},
	{
		id: "mock-3",
		slug: "andorra-on-a-budget",
		destinationId: "andorra",
		articleType: "practical-info",
		title: "Andorra on a budget: tips and costs",
		intro: "How much does a day in Andorra cost? Where to sleep and eat cheaply, and how to get there from Barcelona or Toulouse without overspending.",
		sections: [],
		places: [],
		seo: { metaTitle: "Andorra budget", metaDescription: "Andorra budget travel tips.", keywords: [] },
		coverImage: { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&fit=crop", alt: "Mountains" },
	},
];

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "Svět za málo – Průvodce levným cestováním" },
			{
				name: "description",
				content:
					"Praktické průvodce a tipy pro levné cestování. Objevte destinace, ušetřete a prozkoumejte svět.",
			},
			{
				property: "og:title",
				content: "Svět za málo – Průvodce levným cestováním",
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

const BOOK_IMAGE_PLACEHOLDER = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&fit=crop";
const BOOK_URL = "#"; // Replace with real product/landing URL

function HomePage() {
	const { t } = useTranslation();
	const { data: articles = [], isLoading: articlesLoading } =
		useLatestArticles(6);

	const HERO_IMAGE =
		"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop";

	return (
		<div className="min-h-screen bg-[#FAF8F5]">
			{/* 1. Hero – main text on image background */}
			<section
				className="relative flex min-h-[280px] sm:min-h-[340px] md:min-h-[400px] items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-14 sm:py-20 md:py-24"
				style={{
					backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,249,245,0.5) 100%), url(${HERO_IMAGE})`,
				}}
			>
				<div className="container-wide max-w-2xl mx-auto text-center relative z-10">
					<h1 className="hero-headline text-3xl text-foreground sm:text-4xl md:text-5xl mb-3 md:mb-4 drop-shadow-sm">
						{t("homePage.mainHeadline")}
					</h1>
					<p className="text-foreground-secondary text-base sm:text-lg max-w-xl mx-auto drop-shadow-sm">
						{t("homePage.mainIntro")}
					</p>
				</div>
			</section>

			<div className="container-wide max-w-2xl mx-auto px-4 sm:px-6">
				{/* 2. What the web brings */}
				<section className="py-8 md:py-12 border-t border-[#E8E4DF]">
					<h2 className="text-lg font-semibold text-foreground mb-5 sm:text-xl">
						{t("homePage.whatWeBringTitle")}
					</h2>
					<ul className="space-y-4 text-foreground-secondary text-base sm:text-lg leading-relaxed">
						<li className="flex gap-4 items-start">
							<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary mt-0.5" aria-hidden>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
							</span>
							<span>{t("homePage.whatWeBring1")}</span>
						</li>
						<li className="flex gap-4 items-start">
							<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary mt-0.5" aria-hidden>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
							</span>
							<span>{t("homePage.whatWeBring2")}</span>
						</li>
						<li className="flex gap-4 items-start">
							<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary mt-0.5" aria-hidden>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
							</span>
							<span>{t("homePage.whatWeBring3")}</span>
						</li>
					</ul>
				</section>

				{/* 3. Free ebook – email signup */}
				<section className="py-8 md:py-12 border-t border-[#E8E4DF] bg-[#F8F6F3] -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 rounded-lg">
					<h2 className="text-lg font-semibold text-foreground mb-2 sm:text-xl">
						{t("homePage.ebookTitle")}
					</h2>
					<p className="text-foreground-secondary text-sm sm:text-base mb-5">
						{t("homePage.ebookDescription")}
					</p>
					<form className="flex flex-col gap-3 sm:flex-row sm:max-w-md">
						<input
							type="email"
							placeholder={t("homePage.ebookPlaceholder")}
							className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-white border border-[#E8E4DF] focus:outline-none focus:ring-2 focus:ring-primary/25 text-foreground placeholder:text-foreground-muted"
						/>
						<button
							type="submit"
							className="w-full min-h-[48px] sm:w-auto bg-primary hover:bg-primary-hover text-primary-foreground font-medium px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
						>
							{t("homePage.ebookCta")}
						</button>
					</form>
				</section>

				{/* 4. Book for sale – only when we have something to offer */}
				{EXTERNAL_SERVICES.book.available && (
					<section className="py-8 md:py-12 border-t border-[#E8E4DF]">
						<div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
							<div className="w-full sm:w-36 shrink-0 aspect-3/4 overflow-hidden bg-[#E8E4DF] rounded">
								<img
									src={BOOK_IMAGE_PLACEHOLDER}
									alt=""
									className="w-full h-full object-cover"
								/>
							</div>
							<div>
								<h2 className="text-lg font-semibold text-foreground mb-2 sm:text-xl">
									{t("homePage.bookTitle")}
								</h2>
								<p className="text-foreground-secondary text-sm sm:text-base mb-4">
									{t("homePage.bookDescription")}
								</p>
								<a
									href={BOOK_URL}
									className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 bg-foreground text-background font-medium rounded-xl hover:bg-foreground/90 transition-colors text-sm"
								>
									{t("homePage.bookCta")}
								</a>
							</div>
						</div>
					</section>
				)}
			</div>

			{/* 5. Articles – full width, 2–3 columns on desktop */}
			<section className="container-wide px-4 sm:px-6 py-8 md:py-12 border-t border-[#E8E4DF]">
				<h2 className="text-lg font-semibold text-foreground mb-5 sm:text-xl md:mb-6 max-w-2xl mx-auto">
					{t("homePage.articlesTitle")}
				</h2>
				{articlesLoading ? (
					<div className="text-center py-6 text-foreground-secondary text-sm">
						Loading...
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
						{(articles.length ? articles : MOCK_ARTICLES).map((article) => (
							<ArticleCard
								key={article.id}
								article={article}
								variant="block"
							/>
						))}
					</div>
				)}
			</section>
		</div>
	);
}
