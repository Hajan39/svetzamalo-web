import { Link } from "@tanstack/react-router";
import type { Article } from "@/types";

const FALLBACK_COVER =
	"https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop";

interface ArticleCardProps {
	article: Article;
	variant?: "default" | "featured" | "compact" | "block";
	className?: string;
}

export function ArticleCard({
	article,
	variant = "default",
	className = "",
}: ArticleCardProps) {
	const formattedDate = article.publishedAt
		? new Date(article.publishedAt).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			})
		: "";
	const coverSrc = article.coverImage?.src || FALLBACK_COVER;
	const coverAlt = article.coverImage?.alt || article.title;

	if (variant === "block") {
		return (
			<Link
				to="/articles/$slug"
				params={{ slug: article.slug }}
				className={`group block ${className}`}
			>
				<div className="aspect-4/3 overflow-hidden">
					<img
						src={coverSrc}
						alt={coverAlt}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
						loading="lazy"
					/>
				</div>
				<div className="pt-3 sm:pt-4">
					<span className="text-xs font-medium text-foreground-muted uppercase tracking-wide">
						{(article.articleType || "destination-guide").replace("-", " ")}
					</span>
					<h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2 mt-0.5">
						{article.title}
					</h3>
					<p className="text-foreground-secondary text-sm sm:text-base leading-relaxed">
						{article.intro}
					</p>
				</div>
			</Link>
		);
	}

	if (variant === "featured") {
		return (
			<Link
				to="/articles/$slug"
				params={{ slug: article.slug }}
				className={`group block border border-border rounded-lg p-5 sm:p-6 md:p-8 bg-background hover:border-foreground transition-colors ${className}`}
			>
		<span className="text-xs font-medium text-foreground-muted uppercase tracking-wide">
			{(article.articleType || "destination-guide").replace("-", " ")}
		</span>
				<h3 className="text-xl sm:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors mt-2 mb-3">
					{article.title}
				</h3>
				<p className="text-foreground-secondary line-clamp-2 mb-4">
					{article.intro}
				</p>
				<span className="text-primary font-medium">Read article →</span>
			</Link>
		);
	}

	if (variant === "compact") {
		return (
			<Link
				to="/articles/$slug"
				params={{ slug: article.slug }}
				className={`group block border border-border rounded-lg p-5 bg-background hover:border-foreground transition-colors ${className}`}
			>
				<h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
					{article.title}
				</h4>
				<span className="text-sm text-foreground-muted" suppressHydrationWarning>
				{formattedDate}
			</span>
			</Link>
		);
	}

	// Default variant
	return (
		<Link
			to="/articles/$slug"
			params={{ slug: article.slug }}
			className={`group block border border-border rounded-lg p-6 bg-background hover:border-foreground transition-colors ${className}`}
		>
			<span className="text-xs font-medium text-foreground-muted uppercase tracking-wide">
				{(article.articleType || "destination-guide").replace("-", " ")}
			</span>
			<h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mt-2 mb-2">
				{article.title}
			</h3>
			<p className="text-foreground-secondary text-sm line-clamp-2 mb-3">
				{article.intro}
			</p>
			<time className="text-xs text-foreground-muted" dateTime={article.publishedAt} suppressHydrationWarning>
				{formattedDate}
			</time>
		</Link>
	);
}
