import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Destination } from "@/types";

interface DestinationCardProps {
	destination: Destination;
	className?: string;
}

// Timezone offset mapping (simplified)
const TIMEZONE_OFFSETS: Record<string, number> = {
	"AST (UTC-4)": -4,
	"CET (UTC+1)": 1,
	"ICT (UTC+7)": 7,
	"WET (UTC+0)": 0,
	"WEST (UTC+1)": 1,
	"WIB (UTC+7)": 7,
	"WITA (UTC+8)": 8,
	"WIT (UTC+9)": 9,
	"EET (UTC+2)": 2,
	"WAT (UTC+1)": 1,
};

// Month abbreviations
const MONTH_ABBREV: Record<string, string> = {
	January: "Jan",
	February: "Feb",
	March: "Mar",
	April: "Apr",
	May: "May",
	June: "Jun",
	July: "Jul",
	August: "Aug",
	September: "Sep",
	October: "Oct",
	November: "Nov",
	December: "Dec",
};

function formatBestTime(bestTime: string): string {
	// Handle multiple ranges like "April to June, September to October"
	const ranges = bestTime.split(", ");

	return ranges
		.map((range) => {
			const parts = range.split(" to ");
			if (parts.length === 2) {
				// It's a range - use abbreviations
				const start = MONTH_ABBREV[parts[0]] || parts[0];
				const end = MONTH_ABBREV[parts[1]] || parts[1];
				return `${start}–${end}`;
			}
			// Single month - keep full name
			return range;
		})
		.join(", ");
}

function getTimeInTimezone(timezoneStr?: string): string {
	if (!timezoneStr) return "--:--";

	// Extract offset from timezone string
	const match = timezoneStr.match(/UTC([+-]\d+)/);
	if (!match) return "--:--";

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

export function DestinationCard({
	destination,
	className = "",
}: DestinationCardProps) {
	// Avoid hydration mismatch: server and client can have different time. Show placeholder until mounted.
	const [currentTime, setCurrentTime] = useState("--:--");

	useEffect(() => {
		setCurrentTime(getTimeInTimezone(destination.timezone));
		const interval = setInterval(() => {
			setCurrentTime(getTimeInTimezone(destination.timezone));
		}, 60000);
		return () => clearInterval(interval);
	}, [destination.timezone]);

	// Default cover images based on destination
	const coverImages: Record<string, string> = {
		"dominican-republic":
			"https://images.unsplash.com/photo-1569700981190-68489c5c4866?w=600&h=400&fit=crop",
		vatican:
			"https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600&h=400&fit=crop",
		thailand:
			"https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&h=400&fit=crop",
		portugal:
			"https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&h=400&fit=crop",
		morocco:
			"https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&h=400&fit=crop",
		bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop",
	};

	const coverImage =
		destination.heroImage?.url ||
		coverImages[destination.slug] ||
		"https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop";

	return (
		<Link
			to="/destinations/guide/$slug"
			params={{ slug: destination.slug }}
			className={`group block relative rounded-lg overflow-hidden bg-background ${className}`}
		>
			{/* Cover Image */}
			<div className="aspect-[4/3] relative overflow-hidden">
				<img
					src={coverImage}
					alt={destination.name}
					className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
				/>

				{/* Gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

				{/* Content overlay */}
				<div className="absolute inset-0 p-5 flex flex-col justify-end">
					{/* Top right - Current time */}
					<div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full" suppressHydrationWarning>
						<span className="text-sm font-medium text-foreground tabular-nums">
							{currentTime}
						</span>
					</div>

					{/* Bottom content */}
					<div>
						{/* Flag + Name */}
						<div className="flex items-center gap-2 mb-1">
							<span className="text-2xl">{destination.flagEmoji}</span>
							<h3 className="text-xl font-semibold text-white">
								{destination.name}
							</h3>
						</div>

						{/* Continent */}
						<p className="text-white/70 text-sm capitalize mb-3">
							{destination.continent.replace("-", " ")}
						</p>

						{/* Language + Best time to visit */}
						<div className="flex items-center justify-between text-sm">
							<span className="text-white/90">{destination.languages?.[0] ?? destination.name}</span>
							{destination.bestTimeToVisit ? (
								<span className="text-white/70">
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
