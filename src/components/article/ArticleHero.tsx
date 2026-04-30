import { SmartImage } from "@/components/common";
import { formatLocalizedDate, useTranslation } from "@/lib/i18n";

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
	const { locale, t } = useTranslation();
	const formatDate = (dateString: string) => {
		return formatLocalizedDate(new Date(dateString), locale);
	};

	return (
		<header className="mb-8 md:mb-12">
			{/* Cover Image with Title */}
			{coverImage ? (
				<div className="relative mb-6 h-56 w-full overflow-hidden rounded-xl sm:h-72 md:mb-8 md:h-112">
					<SmartImage
						src={coverImage.src}
						alt={coverImage.alt}
						className="h-full w-full object-cover"
						priority
						sizes="100vw"
						fallbackLabel={title}
					/>
					<div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
					<div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-10">
						<h1 className="mb-2 text-2xl font-bold leading-tight text-white drop-shadow-lg sm:text-3xl md:mb-3 md:text-5xl">
							{title}
						</h1>
						{publishedAt || updatedAt ? (
							<div
								className="flex flex-wrap items-center gap-2 text-xs text-white/80 sm:gap-4 sm:text-sm"
								suppressHydrationWarning
							>
								{publishedAt ? (
									<time dateTime={publishedAt}>
										{t("common.publishedLabel")}: {formatDate(publishedAt)}
									</time>
								) : null}
								{updatedAt ? (
									<time dateTime={updatedAt}>
										{t("common.updatedLabel")}: {formatDate(updatedAt)}
									</time>
								) : null}
							</div>
						) : null}
					</div>
				</div>
			) : (
				<>
					<h1 className="mb-4 text-2xl font-bold leading-tight text-foreground sm:text-3xl md:mb-6 md:text-5xl">
						{title}
					</h1>
					{publishedAt || updatedAt ? (
						<div
							className="mb-4 flex flex-wrap items-center gap-2 text-xs text-foreground-muted sm:gap-4 sm:text-sm md:mb-6"
							suppressHydrationWarning
						>
							{publishedAt ? (
								<time dateTime={publishedAt}>
									{t("common.publishedLabel")}: {formatDate(publishedAt)}
								</time>
							) : null}
							{updatedAt ? (
								<time dateTime={updatedAt}>
									{t("common.updatedLabel")}: {formatDate(updatedAt)}
								</time>
							) : null}
						</div>
					) : null}
				</>
			)}

			<p className="text-base leading-relaxed text-foreground-secondary sm:text-lg md:text-xl">
				{intro}
			</p>
		</header>
	);
}

export default ArticleHero;
