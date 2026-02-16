import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Destination } from "@/types";

interface DestinationCardProps {
	destination: Destination;
	className?: string;
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

function getTimeInTimezone(timezoneStr?: string): string {
	if (!timezoneStr) return "";

	const match = timezoneStr.match(/UTC([+-]\d+)/);
	if (!match) return "";

	const offset = parseInt(match[1], 10);
	const now = new Date();
	const utc = now.getTime() + now.getTimezoneOffset() * 60000;
	const targetTime = new Date(utc + offset * 3600000);

	return targetTime.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
}

/** Generic travel placeholder when no cover image exists */
const FALLBACK_COVER =
	"https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop";

export function DestinationCard({
	destination,
	className = "",
}: DestinationCardProps) {
	const [currentTime, setCurrentTime] = useState("");

	useEffect(() => {
		setCurrentTime(getTimeInTimezone(destination.timezone));
		const interval = setInterval(() => {
			setCurrentTime(getTimeInTimezone(destination.timezone));
		}, 60000);
		return () => clearInterval(interval);
	}, [destination.timezone]);

	const coverImage = destination.heroImage?.url || FALLBACK_COVER;

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
				<div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end">
					{/* Top right - Current time (only shown if timezone exists) */}
					{currentTime && (
						<div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full" suppressHydrationWarning>
							<span className="text-xs sm:text-sm font-medium text-foreground tabular-nums">
								{currentTime}
							</span>
						</div>
					)}

					{/* Bottom content */}
					<div>
						{/* Flag + Name */}
						<div className="flex items-center gap-2 mb-1">
							{destination.flagEmoji && (
								<span className="text-xl sm:text-2xl">{destination.flagEmoji}</span>
							)}
							<h3 className="text-lg sm:text-xl font-semibold text-white line-clamp-1">
								{destination.name}
							</h3>
						</div>

						{/* Continent */}
						<p className="text-white/70 text-xs sm:text-sm capitalize mb-2 sm:mb-3">
							{destination.continent.replace("-", " ")}
						</p>

						{/* Language + Best time to visit */}
						<div className="flex items-center justify-between text-xs sm:text-sm">
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
