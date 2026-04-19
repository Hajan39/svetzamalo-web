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
		<header className="mb-8 md:mb-12">
			{/* Cover Image with Title */}
			{coverImage ? (
				<div className="relative w-full h-56 sm:h-72 md:h-112 mb-6 md:mb-8 rounded-xl overflow-hidden">
					<img
						src={coverImage.src}
						alt={coverImage.alt}
						className="w-full h-full object-cover"
						loading="lazy"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
					<div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-10">
						<h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 md:mb-3 leading-tight drop-shadow-lg">
							{title}
						</h1>
						{(publishedAt || updatedAt) && (
							<div
								className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/80"
								suppressHydrationWarning
							>
								{publishedAt && (
									<time dateTime={publishedAt}>
										Published: {formatDate(publishedAt)}
									</time>
								)}
								{updatedAt && (
									<time dateTime={updatedAt}>
										Updated: {formatDate(updatedAt)}
									</time>
								)}
							</div>
						)}
					</div>
				</div>
			) : (
				<>
					<h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-4 md:mb-6 leading-tight">
						{title}
					</h1>
					{(publishedAt || updatedAt) && (
						<div
							className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-foreground-muted mb-4 md:mb-6"
							suppressHydrationWarning
						>
							{publishedAt && (
								<time dateTime={publishedAt}>
									Published: {formatDate(publishedAt)}
								</time>
							)}
							{updatedAt && (
								<time dateTime={updatedAt}>
									Updated: {formatDate(updatedAt)}
								</time>
							)}
						</div>
					)}
				</>
			)}

			<p className="text-base sm:text-lg md:text-xl text-foreground-secondary leading-relaxed">
				{intro}
			</p>
		</header>
	);
}

export default ArticleHero;
