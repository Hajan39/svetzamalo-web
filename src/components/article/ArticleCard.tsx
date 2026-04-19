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
				className={`group brand-card brand-card-hover block overflow-hidden ${className}`}
			>
				<div className="aspect-4/3 overflow-hidden rounded-t-[16px] bg-background-secondary">
					<img
						src={coverSrc}
						alt={coverAlt}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
						loading="lazy"
					/>
				</div>
				<div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
					<span className="inline-flex rounded-full bg-primary-light px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
						{(article.articleType || "destination-guide").replace("-", " ")}
					</span>
					<h3 className="mt-3 text-base font-semibold text-foreground sm:text-lg">
						{article.title}
					</h3>
					<p className="mt-2 text-sm leading-relaxed text-foreground-secondary sm:text-base">
						{article.intro}
					</p>
					<span className="mt-4 inline-flex text-sm font-semibold text-primary">
						Read article
					</span>
				</div>
			</Link>
		);
	}

	if (variant === "featured") {
		return (
			<Link
				to="/articles/$slug"
				params={{ slug: article.slug }}
				className={`group brand-card brand-card-hover block p-5 sm:p-6 md:p-8 ${className}`}
			>
				<span className="inline-flex rounded-full bg-primary-light px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
					{(article.articleType || "destination-guide").replace("-", " ")}
				</span>
				<h3 className="mt-4 text-xl font-semibold text-foreground transition-colors group-hover:text-primary sm:text-2xl">
					{article.title}
				</h3>
				<p className="mb-5 mt-3 line-clamp-2 text-foreground-secondary">
					{article.intro}
				</p>
				<span className="text-sm font-semibold text-primary">Read article</span>
			</Link>
		);
	}

	if (variant === "compact") {
		return (
			<Link
				to="/articles/$slug"
				params={{ slug: article.slug }}
				className={`group brand-card brand-card-hover block p-5 ${className}`}
			>
				<h4 className="mb-1 font-semibold text-foreground transition-colors group-hover:text-primary">
					{article.title}
				</h4>
				<span
					className="text-sm text-foreground-muted"
					suppressHydrationWarning
				>
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
			className={`group brand-card brand-card-hover block p-6 ${className}`}
		>
			<span className="inline-flex rounded-full bg-primary-light px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
				{(article.articleType || "destination-guide").replace("-", " ")}
			</span>
			<h3 className="mt-4 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
				{article.title}
			</h3>
			<p className="mb-4 mt-2 text-sm line-clamp-2 text-foreground-secondary">
				{article.intro}
			</p>
			<time
				className="text-xs text-foreground-muted"
				dateTime={article.publishedAt}
				suppressHydrationWarning
			>
				{formattedDate}
			</time>
		</Link>
	);
}
