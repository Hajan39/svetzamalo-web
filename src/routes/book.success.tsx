import { SITE_CONFIG } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n";
import { createFileRoute, Link } from "@tanstack/react-router";

const SITE_URL = SITE_CONFIG.url;

export const Route = createFileRoute("/book/success")({
	head: () => ({
		meta: [
			{ title: "Děkujeme za nákup | Kniha o levném cestování" },
			{
				name: "description",
				content: "Platba proběhla úspěšně. Odkaz ke stažení knihy byl odeslán na váš e-mail.",
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
		<div className="container-narrow py-12 md:py-20 text-center">
			<div className="max-w-lg mx-auto space-y-6">
				<div className="text-5xl" aria-hidden>
					✓
				</div>
				<h1 className="text-2xl md:text-3xl font-bold text-foreground">
					{t("book.successTitle")}
				</h1>
				<p className="text-foreground-secondary">
					{t("book.successMessage")}
				</p>
				<p className="text-sm text-foreground-muted">
					{t("book.successCheckSpam")}
				</p>
				<div className="pt-4">
					<Link
						to="/book"
						className="text-primary font-medium hover:underline"
					>
						{t("book.successBackToBook")}
					</Link>
				</div>
			</div>
		</div>
	);
}
