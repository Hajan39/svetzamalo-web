import { Link } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { CurrencySwitcher } from "@/components/ui/CurrencySwitcher";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { SearchModal } from "@/components/ui/SearchModal";
import { EXTERNAL_SERVICES } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n";

/**
 * Modern, responsive site header with logo and main navigation
 *
 * Features:
 * - Modern branding with travel theme
 * - Responsive mobile hamburger menu
 * - Smooth animations and transitions
 * - Search functionality placeholder
 * - Language switcher integration
 */

interface NavItem {
	label: string;
	href: string;
	description?: string;
}

export function Header() {
	const { t } = useTranslation();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	const NAV_ITEMS: NavItem[] = [
		{
			label: t("header.navHome"),
			href: "/",
			description: t("header.navHomeDesc"),
		},
		{
			label: t("header.navDestinations"),
			href: "/destinations",
			description: t("header.navDestinationsDesc"),
		},
		{
			label: t("header.navArticles"),
			href: "/articles",
			description: t("header.navArticlesDesc"),
		},
		...(EXTERNAL_SERVICES.book.available
			? [
					{
						label: t("header.navBook"),
						href: "/book",
						description: t("header.navBookDesc"),
					},
				]
			: []),
		{
			label: t("header.navAbout"),
			href: "/about",
			description: t("header.navAboutDesc"),
		},
	];

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	const openSearch = () => {
		setIsSearchOpen(true);
		setIsMobileMenuOpen(false);
	};

	const closeSearch = () => {
		setIsSearchOpen(false);
	};

	return (
		<header className="sticky top-0 z-50 border-b border-border bg-white/92 backdrop-blur-md">
			<div className="container-wide">
				<div className="flex items-center justify-between h-16 lg:h-20">
					{/* Logo */}
					<Link
						to="/"
						className="inline-flex items-center hover:no-underline"
						onClick={closeMobileMenu}
					>
						<BrandLogo
							markClassName="h-11 w-10 lg:h-12 lg:w-11"
							textClassName="hidden sm:flex"
						/>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden items-center rounded-full border border-border bg-background-secondary/80 p-1 lg:flex">
						{NAV_ITEMS.map((item) => (
							<Link
								key={item.href}
								to={item.href}
								className="rounded-full px-4 py-2 text-sm font-medium text-foreground-secondary transition-colors hover:bg-white hover:text-primary hover:no-underline"
							>
								{item.label}
							</Link>
						))}
					</nav>

					{/* Right side actions */}
					<div className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1 shadow-sm">
						{/* Currency switcher */}
						<div className="hidden sm:block">
							<CurrencySwitcher />
						</div>

						{/* Language switcher */}
						<div className="hidden sm:block">
							<LanguageSwitcher variant="dropdown" showFlags={true} />
						</div>

						{/* Search button */}
						<button
							type="button"
							onClick={openSearch}
							className="rounded-full p-2 text-foreground-secondary transition-colors hover:bg-primary-light/70 hover:text-primary"
							aria-label="Open search"
						>
							<Search className="w-5 h-5" />
						</button>

						{/* Mobile menu button */}
						<button
							type="button"
							onClick={toggleMobileMenu}
							className="rounded-full p-2 text-foreground-secondary transition-colors hover:bg-primary-light/70 hover:text-primary lg:hidden"
							aria-label="Toggle menu"
							aria-expanded={isMobileMenuOpen}
						>
							{isMobileMenuOpen ? (
								<X className="w-5 h-5" />
							) : (
								<Menu className="w-5 h-5" />
							)}
						</button>
					</div>
				</div>

				{/* Mobile Navigation Menu */}
				{isMobileMenuOpen && (
					<div className="border-t border-border bg-white/98 backdrop-blur-sm lg:hidden">
						<nav className="container-narrow py-6 space-y-1">
							{NAV_ITEMS.map((item) => (
								<Link
									key={item.href}
									to={item.href}
									className="block rounded-xl border border-transparent px-4 py-3 text-foreground-secondary transition-colors hover:border-border hover:bg-background-secondary hover:text-primary hover:no-underline"
									onClick={closeMobileMenu}
								>
									<div className="font-medium">{item.label}</div>
									{item.description && (
										<div className="text-sm text-foreground-muted mt-1">
											{item.description}
										</div>
									)}
								</Link>
							))}

							{/* Mobile language switcher */}
							<div className="border-t border-border pt-4 mt-4 space-y-3">
								<div className="px-4 flex items-center justify-between">
									<span className="text-sm text-foreground-muted">
										Currency
									</span>
									<CurrencySwitcher />
								</div>
								<div className="px-4 flex items-center justify-between">
									<span className="text-sm text-foreground-muted">
										Language
									</span>
									<LanguageSwitcher variant="dropdown" showFlags={true} />
								</div>
							</div>
						</nav>
					</div>
				)}

				{/* Search Modal */}
				<SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
			</div>
		</header>
	);
}

export default Header;
