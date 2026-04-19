import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DestinationCard } from "@/components/destination";
import { useDestinations } from "@/integrations/strapi/hooks";
import { SITE_CONFIG } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const SITE_URL = SITE_CONFIG.url;

type ContinentKey =
	| "europe"
	| "asia"
	| "africa"
	| "caribbean"
	| "northAmerica"
	| "southAmerica"
	| "oceania";

const CONTINENT_ORDER: ContinentKey[] = [
	"europe",
	"asia",
	"caribbean",
	"africa",
	"northAmerica",
	"southAmerica",
	"oceania",
];

export const Route = createFileRoute("/destinations/")({
	head: () => ({
		meta: [
			{ title: "Travel Destinations | Lowcost Traveling" },
			{
				name: "description",
				content:
					"Explore our budget travel guides for destinations around the world. Find tips, costs, and practical info for your next adventure.",
			},
			{
				property: "og:title",
				content: "Travel Destinations | Lowcost Traveling",
			},
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: `${SITE_URL}/destinations` },
		],
		links: [{ rel: "canonical", href: `${SITE_URL}/destinations` }],
	}),
	component: DestinationsPage,
});

function DestinationsPage() {
	const { t } = useTranslation();
	const { data: destinations = [], isLoading } = useDestinations();
	const [viewMode, setViewMode] = useState<"all" | "byContinent">(
		"byContinent",
	);

	// Group destinations by continent (minimal Strapi schema defaults to 'europe')
	const destinationsByContinent = useMemo(() => {
		const grouped: Record<string, typeof destinations> = {};
		for (const destination of destinations) {
			const continent = destination.continent;
			if (!grouped[continent]) {
				grouped[continent] = [];
			}
			grouped[continent].push(destination);
		}
		return grouped;
	}, [destinations]);

	// Get continents that have destinations, in order
	const continentsWithDestinations = useMemo(() => {
		return CONTINENT_ORDER.filter(
			(c) => destinationsByContinent[c]?.length > 0,
		);
	}, [destinationsByContinent]);

	const getContinentLabel = (continent: ContinentKey): string => {
		return t(`destinationsPage.continents.${continent}`);
	};

	return (
		<div className="container-wide py-8 md:py-16">
			{isLoading && (
				<div className="text-center py-12 text-foreground-secondary">
					Loading destinations...
				</div>
			)}
			{!isLoading && (
				<>
					<header className="mb-8 md:mb-12">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
							<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
								{t("destinationsPage.title")}
							</h1>
							<div className="flex items-center gap-1 bg-background-secondary rounded-lg p-1">
								<button
									type="button"
									onClick={() => setViewMode("all")}
									className={cn(
										"px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
										viewMode === "all"
											? "bg-background text-foreground shadow-sm"
											: "text-foreground-secondary hover:text-foreground",
									)}
								>
									{t("destinationsPage.viewAll")}
								</button>
								<button
									type="button"
									onClick={() => setViewMode("byContinent")}
									className={cn(
										"px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
										viewMode === "byContinent"
											? "bg-background text-foreground shadow-sm"
											: "text-foreground-secondary hover:text-foreground",
									)}
								>
									{t("destinationsPage.viewByContinent")}
								</button>
							</div>
						</div>
						<p className="text-base md:text-lg text-foreground-secondary max-w-2xl">
							{t("destinationsPage.description")}
						</p>
					</header>

						{destinations.length === 0 ? (
							<div className="rounded-xl border border-border bg-background-secondary px-6 py-12 text-center">
								<h2 className="text-xl font-semibold text-foreground">
									No destinations available yet
								</h2>
								<p className="mt-2 text-foreground-secondary">
									Strapi is reachable, but there are no published destinations for this view yet.
								</p>
							</div>
						) : viewMode === "all" ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{destinations.map((destination) => (
								<DestinationCard
									key={destination.id}
									destination={destination}
								/>
							))}
						</div>
					) : (
						<div className="space-y-16">
							{continentsWithDestinations.map((continent) => (
								<section key={continent} id={continent}>
									<Link
										to="/destinations/$continent"
										params={{ continent }}
										className="group inline-block mb-6"
									>
										<h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
											{getContinentLabel(continent)}
											<span className="ml-2 text-foreground-secondary group-hover:text-primary transition-colors">
												→
											</span>
										</h2>
									</Link>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										{destinationsByContinent[continent].map((destination) => (
											<DestinationCard
												key={destination.id}
												destination={destination}
											/>
										))}
									</div>
								</section>
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
}
