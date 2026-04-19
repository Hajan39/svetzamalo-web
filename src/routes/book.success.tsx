import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE_CONFIG } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n";

const SITE_URL = SITE_CONFIG.url;

export const Route = createFileRoute("/book/success")({
	head: () => ({
		meta: [
			{ title: "Děkujeme za nákup | Kniha o levném cestování" },
			{
				name: "description",
				content:
					"Platba proběhla úspěšně. Odkaz ke stažení knihy byl odeslán na váš e-mail.",
			},
			{ property: "og:title", content: "Děkujeme za nákup | Svět za málo" },
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: `${SITE_URL}/book/success` },
		],
		links: [{ rel: "canonical", href: `${SITE_URL}/book/success` }],
	}),
	component: BookSuccessPage,
});

function BookSuccessPage() {
	const { t } = useTranslation();

	return (
		<section className="container-narrow py-12 md:py-20">
			<div className="brand-card max-w-2xl mx-auto px-6 py-10 md:px-10 md:py-12 text-center">
				<div
					className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary shadow-sm"
					aria-hidden
				>
					<span className="text-3xl">✓</span>
				</div>
				<h1 className="mb-4 text-foreground">{t("book.successTitle")}</h1>
				<p className="mx-auto mb-3 max-w-xl text-foreground-secondary">
					{t("book.successMessage")}
				</p>
				<p className="text-sm text-foreground-muted">
					{t("book.successCheckSpam")}
				</p>
				<div className="pt-6">
					<Link
						to="/book"
						className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-primary px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground hover:no-underline"
					>
						{t("book.successBackToBook")}
					</Link>
				</div>
			</div>
		</section>
	);
}
