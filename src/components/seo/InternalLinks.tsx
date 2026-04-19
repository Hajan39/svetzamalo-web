import { Link } from "@tanstack/react-router";
import { useTranslation } from "@/lib/i18n";
import type { Article, Destination } from "@/types";

/**
 * Internal Linking Strategy for SEO
 *
 * Benefits:
 * - Distributes link equity across site
 * - Improves crawlability and indexation
 * - Creates topic clusters and content relationships
 * - Boosts user engagement and time on site
 *
 * Strategy:
 * - Articles link to their destination country
 * - Countries link to related articles
 * - Strategic cross-linking between related content
 * - Breadcrumbs for navigation and SEO
 * - Related content sections
 */

interface ArticleToCountryLinkProps {
	destination: Pick<Destination, "slug" | "name">;
	className?: string;
}

/**
 * Article → Country Link
 * Used in article headers, bylines, or intro sections
 */
export function ArticleToCountryLink({
	destination,
	className = "text-primary hover:text-primary-hover font-medium",
}: ArticleToCountryLinkProps) {
	return (
		<Link
			to="/destinations/guide/$slug"
			params={{ slug: destination.slug }}
			className={className}
		>
			{destination.name}
		</Link>
	);
}

interface CountryToArticleLinkProps {
	article: Pick<Article, "id" | "slug" | "title" | "articleType">;
	variant?: "card" | "inline" | "featured";
	showType?: boolean;
}

/**
 * Country → Article Link
 * Used in destination pages to link to related articles
 */
export function CountryToArticleLink({
	article,
	variant = "card",
	showType = true,
}: CountryToArticleLinkProps) {
	const { locale, t } = useTranslation();
	const baseClasses = "group block transition-all duration-200";

	// Build localized article path
	const articlePath =
		locale === "en"
			? `/articles/${article.slug}`
			: `/${locale}/articles/${article.slug}`;

	if (variant === "inline") {
		return (
			<Link
				to={articlePath}
				className={`${baseClasses} text-primary hover:text-primary-hover font-medium hover:underline`}
			>
				{article.title}
			</Link>
		);
	}

	if (variant === "featured") {
		return (
			<Link
				to={articlePath}
				className={`${baseClasses} border border-border rounded-xl p-6 bg-background hover:border-primary hover:shadow-lg md:col-span-2`}
			>
				<div className="flex items-center justify-between mb-3">
					{showType && (
						<span className="inline-block text-xs font-medium text-primary bg-primary-light px-2 py-1 rounded">
							{t(
								`articleTypes.${article.articleType}`,
								article.articleType.replace("-", " "),
							)}
						</span>
					)}
				</div>
				<h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
					{article.title}
				</h3>
				<div className="flex items-center text-primary font-medium text-sm">
					<span>{t("common.readFullGuide")}</span>
					<span aria-hidden="true" className="ml-1">
						→
					</span>
				</div>
			</Link>
		);
	}

	// Default card variant
	return (
		<Link
			to={articlePath}
			className={`${baseClasses} border border-border rounded-lg p-4 bg-background hover:border-primary hover:shadow-md`}
		>
			<div className="flex items-center justify-between mb-2">
				{showType && (
					<span className="inline-block text-xs font-medium text-primary bg-primary-light px-2 py-1 rounded">
						{t(
							`articleTypes.${article.articleType}`,
							article.articleType.replace("-", " "),
						)}
					</span>
				)}
			</div>
			<h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
				{article.title}
			</h4>
			<div className="flex items-center text-primary font-medium text-xs">
				<span>{t("common.readArticle")}</span>
				<span aria-hidden="true" className="ml-1">
					→
				</span>
			</div>
		</Link>
	);
}

interface RelatedContentLinkProps {
	destination: Pick<Destination, "id" | "slug" | "name" | "flagEmoji" | "type">;
	variant?: "card" | "inline";
}

/**
 * Related Destination Link
 * Used for cross-linking between destinations
 */
export function RelatedDestinationLink({
	destination,
	variant = "card",
}: RelatedContentLinkProps) {
	if (variant === "inline") {
		return (
			<Link
				to="/destinations/guide/$slug"
				params={{ slug: destination.slug }}
				className="text-primary hover:text-primary-hover font-medium hover:underline"
			>
				{destination.name}
			</Link>
		);
	}

	return (
		<Link
			to="/destinations/guide/$slug"
			params={{ slug: destination.slug }}
			className="group block text-center p-4 border border-border rounded-lg hover:border-primary transition-colors"
		>
			<div className="text-3xl mb-2">{destination.flagEmoji}</div>
			<div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
				{destination.name}
			</div>
		</Link>
	);
}

interface ContentNavigationProps {
	previous?: {
		slug: string;
		title: string;
		type: "article" | "destination";
	};
	next?: {
		slug: string;
		title: string;
		type: "article" | "destination";
	};
}

/**
 * Content Navigation
 * Previous/Next navigation for articles and destinations
 */
export function ContentNavigation({ previous, next }: ContentNavigationProps) {
	const { t } = useTranslation();

	if (!previous && !next) return null;

	return (
		<nav
			aria-label={t("common.contentNavigation")}
			className="flex justify-between items-center py-8 border-t border-border mt-12"
		>
			<div className="flex-1">
				{previous && (
					<Link
						to={
							previous.type === "article"
								? "/articles/$slug"
								: "/destinations/guide/$slug"
						}
						params={{ slug: previous.slug }}
						className="group flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary transition-colors"
					>
						<span aria-hidden="true" className="text-xl">
							←
						</span>
						<div>
							<div className="text-sm text-foreground-muted uppercase tracking-wide">
								{t("common.previous")}
							</div>
							<div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
								{previous.title}
							</div>
						</div>
					</Link>
				)}
			</div>

			<div className="flex-1 text-right">
				{next && (
					<Link
						to={
							next.type === "article"
								? "/articles/$slug"
								: "/destinations/guide/$slug"
						}
						params={{ slug: next.slug }}
						className="group flex items-center justify-end gap-3 p-4 border border-border rounded-lg hover:border-primary transition-colors"
					>
						<div className="text-right">
							<div className="text-sm text-foreground-muted uppercase tracking-wide">
								{t("common.next")}
							</div>
							<div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
								{next.title}
							</div>
						</div>
						<span aria-hidden="true" className="text-xl">
							→
						</span>
					</Link>
				)}
			</div>
		</nav>
	);
}

/**
 * Strategic Internal Linking Helpers
 * These functions help determine when and where to add internal links
 */

export function shouldLinkToDestination(
	content: string,
	destinationName: string,
): boolean {
	// Don't overlink - only link first mention in intro/content
	const mentions =
		content.toLowerCase().split(destinationName.toLowerCase()).length - 1;
	return mentions <= 1;
}

export function createInternalLinkAnchors(_content: string): Array<{
	text: string;
	href: string;
	type: "destination" | "article";
}> {
	// This could be enhanced to automatically detect and create links
	// For now, return empty array - links are manually placed
	return [];
}

/**
 * SEO Impact of Internal Linking Strategy:
 *
 * 1. Link Equity Distribution:
 *    - Primary content (destination guides) gets most internal links
 *    - Supporting content (tips, lists) links back to main guides
 *    - Creates hierarchical link structure
 *
 * 2. Topic Clustering:
 *    - All articles about a destination link to the country page
 *    - Country pages link to related destinations
 *    - Creates topical authority clusters
 *
 * 3. Crawlability:
 *    - Clear navigation paths for search engines
 *    - Breadcrumbs provide URL structure hints
 *    - Internal links help discover new content
 *
 * 4. User Experience:
 *    - Strategic links provide context and additional value
 *    - Reduces bounce rate by offering related content
 *    - Improves time on site and page views
 *
 * 5. Overlinking Prevention:
 *    - Limited cross-linking between related destinations
 *    - Strategic placement of links in content
 *    - Focus on quality over quantity
 */
