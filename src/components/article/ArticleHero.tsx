interface ArticleHeroProps {
	title: string;
	intro: string;
	coverImage?: {
		src: string;
		alt: string;
	};
	publishedAt?: string;
	updatedAt?: string;
}

export function ArticleHero({
	title,
	intro,
	coverImage,
	publishedAt,
	updatedAt,
}: ArticleHeroProps) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<header className="mb-12">
			{/* Cover Image */}
			{coverImage && (
				<div className="relative w-full h-64 md:h-96 mb-8 rounded-xl overflow-hidden">
					<img
						src={coverImage.src}
						alt={coverImage.alt}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
				</div>
			)}

			<h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
				{title}
			</h1>

			{(publishedAt || updatedAt) && (
				<div className="flex items-center gap-4 text-sm text-foreground-muted mb-6">
					{publishedAt && (
						<time dateTime={publishedAt}>
							Published: {formatDate(publishedAt)}
						</time>
					)}
					{updatedAt && (
						<time dateTime={updatedAt}>Updated: {formatDate(updatedAt)}</time>
					)}
				</div>
			)}

			<p className="text-xl text-foreground-secondary leading-relaxed">
				{intro}
			</p>
		</header>
	);
}

export default ArticleHero;
