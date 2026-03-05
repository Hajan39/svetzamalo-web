import { Link } from "@tanstack/react-router";
import type { Destination } from "@/types";

interface DestinationCardProps {
	destination: Destination;
	className?: string;
	/** Compact: image on top, title + excerpt below, no rounded corners */
	variant?: "default" | "compact";
}

// Month abbreviations for compact display
const MONTH_ABBREV: Record<string, string> = {
	January: "Jan", February: "Feb", March: "Mar", April: "Apr",
	May: "May", June: "Jun", July: "Jul", August: "Aug",
	September: "Sep", October: "Oct", November: "Nov", December: "Dec",
};

function formatBestTime(bestTime: string): string {
	return bestTime
		.split(", ")
		.map((range) => {
			const parts = range.split(" to ");
			if (parts.length === 2) {
				const start = MONTH_ABBREV[parts[0]] || parts[0];
				const end = MONTH_ABBREV[parts[1]] || parts[1];
				return `${start}–${end}`;
			}
			return range;
		})
		.join(", ");
}

/** Generic travel placeholder when no cover image exists */
const FALLBACK_COVER =
	"https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop";

/** Get first paragraph as plain text from intro HTML; fallback to metaDescription */
function getFirstParagraphIntro(html: string | undefined, fallback: string): string {
	if (!html || !html.trim()) return fallback;
	const firstP = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
	const raw = firstP ? firstP[1] : html;
	const text = raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
	return text || fallback;
}

export function DestinationCard({
	destination,
	className = "",
	variant = "default",
}: DestinationCardProps) {
	const coverImage =
		(destination.heroImage && "url" in destination.heroImage
			? destination.heroImage.url
			: destination.heroImage?.src) || FALLBACK_COVER;
	const fallbackExcerpt = destination.seo?.metaDescription ?? "";
	const introText = getFirstParagraphIntro(destination.introHtml, fallbackExcerpt);

	if (variant === "compact") {
		return (
			<Link
				to="/destinations/guide/$slug"
				params={{ slug: destination.slug }}
				className={`group block ${className}`}
			>
				<div className="aspect-4/3 overflow-hidden">
					<img
						src={coverImage}
						alt={destination.name}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
						loading="lazy"
					/>
				</div>
				<div className="pt-3 sm:pt-4">
					<h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">
						{destination.name}
					</h3>
					<p className="text-foreground-secondary text-sm sm:text-base leading-relaxed">
						{introText}
					</p>
				</div>
			</Link>
		);
	}

	return (
		<Link
			to="/destinations/guide/$slug"
			params={{ slug: destination.slug }}
			className={`group block relative rounded-lg overflow-hidden bg-background ${className}`}
		>
			{/* Cover Image */}
			<div className="aspect-4/3 relative overflow-hidden">
				<img
					src={coverImage}
					alt={destination.name}
					className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
					loading="lazy"
				/>

				{/* Gradient overlay */}
				<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

				{/* Content overlay */}
				<div className="absolute inset-0 p-2.5 sm:p-4 md:p-5 flex flex-col justify-end">
					<div>
						<div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
							{destination.flagEmoji && (
								<span className="text-base sm:text-xl md:text-2xl">{destination.flagEmoji}</span>
							)}
							<h3 className="text-sm sm:text-lg md:text-xl font-semibold text-white line-clamp-1">
								{destination.name}
							</h3>
						</div>

						<p className="text-white/70 text-[10px] sm:text-xs md:text-sm capitalize mb-1 sm:mb-2 md:mb-3">
							{destination.continent.replace("-", " ")}
						</p>

						<div className="flex items-center justify-between text-[10px] sm:text-xs md:text-sm">
							{destination.languages?.length ? (
								<span className="text-white/90">{destination.languages[0]}</span>
							) : null}
							{destination.bestTimeToVisit ? (
								<span className="text-white/70 hidden sm:inline">
									{formatBestTime(destination.bestTimeToVisit)}
								</span>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}
