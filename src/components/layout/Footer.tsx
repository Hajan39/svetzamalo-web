import { Link } from "@tanstack/react-router";
import { useTranslation } from "@/lib/i18n";

/**
 * Minimal, modern footer with clean design
 */

interface FooterLink {
	label: string;
	href: string;
}

export function Footer() {
	const { t } = useTranslation();
	const currentYear = new Date().getFullYear();

	const MAIN_LINKS: FooterLink[] = [
		{ label: t("footer.destinations"), href: "/destinations" },
		{ label: t("footer.articles"), href: "/articles" },
		{ label: t("footer.aboutUs"), href: "/about" },
	];

	const LEGAL_LINKS: FooterLink[] = [
		{ label: t("footer.privacyPolicy"), href: "/privacy" },
		{ label: t("footer.termsOfUse"), href: "/terms" },
	];

	return (
		<footer className="border-t border-border">
			{/* Main Footer */}
			<div className="container-wide py-12 lg:py-16">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
					{/* Brand */}
					<div className="lg:col-span-5">
						<Link
							to="/"
							className="inline-block text-xl font-bold text-foreground hover:text-primary transition-colors tracking-tight mb-4"
						>
							{t("common.siteName")}<span className="text-primary">{t("common.siteNameHighlight")}</span>
						</Link>
						<p className="text-foreground-secondary text-sm leading-relaxed max-w-sm mb-6">
							{t("footer.description")}
						</p>
						<p className="text-foreground-muted text-sm">{t("footer.email")}</p>
					</div>

					{/* Links */}
					<div className="lg:col-span-3">
						<h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
							{t("footer.explore")}
						</h3>
						<ul className="space-y-3">
							{MAIN_LINKS.map((link) => (
								<li key={link.href}>
									<Link
										to={link.href}
										className="text-foreground-secondary hover:text-primary transition-colors text-sm"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Newsletter */}
					<div className="lg:col-span-4">
						<h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
							{t("footer.newsletterTitle")}
						</h3>
						<form className="flex gap-2 mb-4">
							<input
								type="email"
								placeholder={t("footer.newsletterPlaceholder")}
								className="flex-1 px-4 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
							/>
							<button
								type="submit"
								className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-medium rounded-lg transition-colors"
							>
								{t("footer.newsletterButton")}
							</button>
						</form>
						<p className="text-xs text-foreground-muted">
							{t("homePage.noSpam")}
						</p>
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="border-t border-border">
				<div className="container-wide py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
					<p className="text-xs text-foreground-muted" suppressHydrationWarning>
						© {currentYear} {t("common.siteNameFull")}
					</p>
					<div className="flex gap-6">
						{LEGAL_LINKS.map((link) => (
							<Link
								key={link.href}
								to={link.href}
								className="text-xs text-foreground-muted hover:text-primary transition-colors"
							>
								{link.label}
							</Link>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
