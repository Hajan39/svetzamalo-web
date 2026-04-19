import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArticleCard } from "@/components/article/ArticleCard";
import { EmptyState } from "@/components/common";
import { submitBookInterest } from "@/integrations/strapi/api";
import { useLatestArticles } from "@/integrations/strapi/hooks";
import { EXTERNAL_SERVICES, SITE_CONFIG } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const SITE_URL = SITE_CONFIG.url;

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

const BOOK_IMAGE_PLACEHOLDER =
	"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&fit=crop";
const BOOK_URL = "#"; // Replace with real product/landing URL

function HomePage() {
	const { t } = useTranslation();
	const { book } = useSiteSettings();
	const { data: articles = [], isLoading: articlesLoading } =
		useLatestArticles(6);

	// Ebook signup form state
	const [ebookEmail, setEbookEmail] = useState("");
	const [ebookStatus, setEbookStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");

	const HERO_IMAGE =
		"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop";

	return (
		<div className="min-h-screen bg-background">
			{/* 1. Hero – main text on image background */}
			<section
				className="relative flex min-h-80 items-center justify-center overflow-hidden px-4 py-14 sm:min-h-95 sm:py-20 md:min-h-110 md:py-24"
				style={{
					backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.58) 42%, rgba(79,143,58,0.14) 100%), url(${HERO_IMAGE})`,
					backgroundPosition: "center",
					backgroundSize: "cover",
				}}
			>
				<div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent" />
				<div className="container-wide max-w-2xl mx-auto text-center relative z-10">
					<span className="mb-4 inline-flex rounded-full border border-primary/15 bg-white/85 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm backdrop-blur">
						{t("homePage.heroBadge")}
					</span>
					<h1 className="hero-headline mb-4 text-foreground drop-shadow-sm">
						{t("homePage.mainHeadline")}
					</h1>
					<p className="mx-auto max-w-xl text-base text-foreground-secondary drop-shadow-sm sm:text-lg">
						{t("homePage.mainIntro")}
					</p>
				</div>
			</section>

			<div className="container-wide max-w-2xl mx-auto px-4 sm:px-6">
				{/* 2. What the web brings */}
				<section className="py-10 md:py-14">
					<div className="brand-card px-6 py-7 sm:px-8 sm:py-8">
						<h2 className="mb-5 text-foreground">
							{t("homePage.whatWeBringTitle")}
						</h2>
						<ul className="space-y-4 text-base leading-relaxed text-foreground-secondary sm:text-lg">
							<li className="flex gap-4 items-start">
								<span
									className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary"
									aria-hidden
								>
									<svg
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<title>Check</title>
										<polyline points="20 6 9 17 4 12" />
									</svg>
								</span>
								<span>{t("homePage.whatWeBring1")}</span>
							</li>
							<li className="flex gap-4 items-start">
								<span
									className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary"
									aria-hidden
								>
									<svg
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<title>Check</title>
										<polyline points="20 6 9 17 4 12" />
									</svg>
								</span>
								<span>{t("homePage.whatWeBring2")}</span>
							</li>
							<li className="flex gap-4 items-start">
								<span
									className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary"
									aria-hidden
								>
									<svg
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<title>Check</title>
										<polyline points="20 6 9 17 4 12" />
									</svg>
								</span>
								<span>{t("homePage.whatWeBring3")}</span>
							</li>
						</ul>
					</div>
				</section>

				{/* 3. Free ebook – email signup */}
				<section className="pb-10 md:pb-14">
					<div className="brand-card px-6 py-7 sm:px-8 sm:py-8">
						<h2 className="mb-2 text-foreground">{t("homePage.ebookTitle")}</h2>
						<p className="mb-5 text-sm text-foreground-secondary sm:text-base">
							{t("homePage.ebookDescription")}
						</p>
						{ebookStatus === "success" ? (
							<p className="font-medium text-success">
								{t("homePage.ebookSuccess")}
							</p>
						) : (
							<form
								className="flex flex-col gap-3 sm:max-w-xl sm:flex-row"
								onSubmit={async (e) => {
									e.preventDefault();
									if (!ebookEmail.trim()) return;
									setEbookStatus("loading");
									try {
										await submitBookInterest(ebookEmail.trim(), "ebook");
										setEbookStatus("success");
										setEbookEmail("");
									} catch {
										setEbookStatus("error");
									}
								}}
							>
								<input
									type="email"
									required
									value={ebookEmail}
									onChange={(e) => setEbookEmail(e.target.value)}
									placeholder={t("homePage.ebookPlaceholder")}
									className="w-full min-h-12 rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-foreground-muted shadow-xs transition-[border-color,box-shadow] focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
								/>
								<button
									type="submit"
									disabled={ebookStatus === "loading"}
									className="w-full min-h-12 whitespace-nowrap rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover sm:w-auto disabled:opacity-60"
								>
									{ebookStatus === "loading"
										? t("common.loading")
										: t("homePage.ebookCta")}
								</button>
								{ebookStatus === "error" && (
									<p className="w-full text-sm text-error">
										{t("common.errorLoading")}
									</p>
								)}
							</form>
						)}
					</div>
				</section>

				{/* 4. Book for sale – only when we have something to offer */}
				{book.available && (
					<section className="pb-10 md:pb-14">
						<div className="brand-card flex flex-col items-start gap-5 px-6 py-7 sm:flex-row sm:gap-6 sm:px-8 sm:py-8">
							<div className="aspect-3/4 w-full shrink-0 overflow-hidden rounded-2xl bg-background-secondary sm:w-36">
								<img
									src={BOOK_IMAGE_PLACEHOLDER}
									alt=""
									className="w-full h-full object-cover"
								/>
							</div>
							<div>
								<h2 className="mb-2 text-foreground">
									{t("homePage.bookTitle")}
								</h2>
								<p className="mb-5 text-sm text-foreground-secondary sm:text-base">
									{t("homePage.bookDescription")}
								</p>
								<a
									href={BOOK_URL}
									className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover hover:no-underline"
								>
									{t("homePage.bookCta")}
								</a>
							</div>
						</div>
					</section>
				)}
			</div>

			{/* 5. Articles – full width, 2–3 columns on desktop */}
			<section className="container-wide px-4 py-10 sm:px-6 md:py-14">
				<h2 className="mx-auto mb-6 max-w-2xl text-foreground">
					{t("homePage.articlesTitle")}
				</h2>
				{articlesLoading ? (
					<div className="text-center py-6 text-foreground-secondary text-sm">
						{t("common.loading")}
					</div>
				) : articles.length === 0 ? (
					<EmptyState title={t("homePage.latestArticlesEmpty")} />
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
						{articles.map((article) => (
							<ArticleCard key={article.id} article={article} variant="block" />
						))}
					</div>
				)}
			</section>
		</div>
	);
}
