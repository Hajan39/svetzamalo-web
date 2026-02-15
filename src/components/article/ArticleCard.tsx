import { Link } from "@tanstack/react-router";
import type { Article } from "@/types";

interface ArticleCardProps {
	article: Article;
	variant?: "default" | "featured" | "compact";
	className?: string;
}

export function ArticleCard({
	article,
	variant = "default",
	className = "",
}: ArticleCardProps) {
	const formattedDate = new Date(article.publishedAt).toLocaleDateString(
		"en-US",
		{
			month: "short",
			day: "numeric",
			year: "numeric",
		},
	);

	if (variant === "featured") {
		return (
			<Link
				to="/articles/$slug"
				params={{ slug: article.slug }}
				className={`group block border border-border rounded-lg p-8 bg-background hover:border-foreground transition-colors ${className}`}
			>
		<span className="text-xs font-medium text-foreground-muted uppercase tracking-wide">
			{(article.articleType || "destination-guide").replace("-", " ")}
		</span>
				<h3 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors mt-2 mb-3">
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
