import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { useEffect, useId } from "react";
import { Footer, Header, SkipLink } from "@/components/layout";
import { CurrencyProvider } from "@/lib/currency";
import { getLocaleForIntl, i18n, useTranslation } from "@/lib/i18n";
import { Analytics } from "@vercel/analytics/react";
import appCss from "../styles.css?url";

/**
 * Router Context
 * Available to all routes via useRouteContext()
 */
interface MyRouterContext {
	queryClient: QueryClient;
}

/**
 * Root Route Configuration
 *
 * This is the entry point for the entire application.
 * It defines:
 * - Default head tags (meta, links)
 * - Root layout component
 * - HTML shell component
 * - 404 not found page
 */
export const Route = createRootRouteWithContext<MyRouterContext>()({
	// Default <head> content for all pages
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Svět za málo – Průvodce levným cestováním" },
			{
				name: "description",
				content:
					"Praktické průvodce a tipy pro levné cestování. Objevte destinace a prozkoumejte svět za málo.",
			},
			{
				name: "robots",
				content:
					"index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
			},
			{
				name: "googlebot",
				content:
					"index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
			},
			{ name: "theme-color", content: "#0F6CBD" },
			// Open Graph defaults
			{ property: "og:type", content: "website" },
			{ property: "og:site_name", content: "Svět za málo" },
			{ property: "og:locale", content: "cs_CZ" },
			// Twitter Card defaults
			{ name: "twitter:card", content: "summary_large_image" },
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			// Favicons
			{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
			{ rel: "icon", href: "/favicon.ico", sizes: "32x32" },
			{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
			{ rel: "manifest", href: "/manifest.json" },
			// Google Fonts: Poppins headings, Inter body, Playpen Sans brand wordmark
			{ rel: "preconnect", href: "https://fonts.googleapis.com" },
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playpen+Sans:wght@400;600;700&family=Poppins:wght@600;700&display=swap",
			},
		],
	}),

	component: RootLayout,
	shellComponent: RootDocument,
	notFoundComponent: NotFoundPage,
});

/**
 * HTML Document Shell
 *
 * The outer HTML structure. This is rendered on the server
 * and hydrated on the client.
 */
function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="cs" className="scroll-smooth">
			<head>
				<HeadContent />
			</head>
			<body className="min-h-screen flex flex-col antialiased">
				{children}
				<Analytics />
			</body>
		</html>
	);
}

/**
 * Root Layout
 *
 * The main application layout structure:
 * - SkipLink: Accessibility (keyboard users can skip to content)
 * - Header: Site branding + navigation
 * - Main: Page content via <Outlet />
 * - Footer: Legal links + site info
 *
 * This layout wraps ALL pages in the application.
 */
function RootLayout() {
	const mainContentId = useId();

	// Load locale from localStorage on mount and update HTML lang attribute
	useEffect(() => {
		if (typeof window === "undefined") return;

		// Load locale from localStorage (i18n manager already does this in constructor,
		// but we ensure it's synced and update HTML lang attribute)
		const currentLocale = i18n.getCurrentLocale();
		const htmlLang = getLocaleForIntl(currentLocale);
		document.documentElement.lang = htmlLang;

		// Subscribe to locale changes to update HTML lang attribute
		const unsubscribe = i18n.subscribe((locale) => {
			const htmlLang = getLocaleForIntl(locale);
			document.documentElement.lang = htmlLang;
		});

		return unsubscribe;
	}, []);

	return (
		<CurrencyProvider>
			{/* Accessibility: Skip to main content link */}
			<SkipLink targetId={mainContentId} />

			{/* Site Header */}
			<Header />

			{/* Main Content Area */}
			<main id={mainContentId} className="flex-1">
				<Outlet />
			</main>

			{/* Site Footer */}
			<Footer />

			{/* Client-side scripts (hydration) */}
			<Scripts />
		</CurrencyProvider>
	);
}

/**
 * 404 Not Found Page
 *
 * Displayed when no route matches the current URL.
 * Provides helpful navigation back to valid pages.
 */
function NotFoundPage() {
	const { t } = useTranslation();

	return (
		<div className="container-narrow py-24 text-center">
			{/* Visual indicator */}
			<div className="text-8xl mb-6" role="img" aria-label="Lost compass">
				🧭
			</div>

			{/* Error message */}
			<h1 className="text-4xl font-bold text-foreground mb-4">
				{t("notFound.title")}
			</h1>
			<p className="text-xl text-foreground-secondary mb-8 max-w-md mx-auto">
				{t("notFound.description")}
			</p>

			{/* Navigation options */}
			<div className="flex flex-col sm:flex-row gap-4 justify-center">
				<Link
					to="/"
					className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground font-medium px-6 py-3 rounded-lg transition-colors"
				>
					← {t("notFound.backToHome")}
				</Link>
				<Link
					to="/articles"
					className="inline-flex items-center justify-center gap-2 border border-border hover:border-primary text-foreground font-medium px-6 py-3 rounded-lg transition-colors"
				>
					{t("nav.articles")}
				</Link>
				<Link
					to="/destinations"
					className="inline-flex items-center justify-center gap-2 border border-border hover:border-primary text-foreground font-medium px-6 py-3 rounded-lg transition-colors"
				>
					{t("notFound.exploreDestinations")}
				</Link>
			</div>
		</div>
	);
}
