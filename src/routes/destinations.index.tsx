import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EmptyState, PageHeader } from "@/components/common";
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

const VIEW_MODES = [
	{ key: "all", labelKey: "destinationsPage.viewAll" },
	{ key: "byContinent", labelKey: "destinationsPage.viewByContinent" },
] as const;

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
					{t("common.loadingDestinations")}
				</div>
			)}
			{!isLoading && (
				<>
					<PageHeader
						title={t("destinationsPage.title")}
						description={t("destinationsPage.description")}
						actions={
							<div className="flex items-center gap-1 rounded-lg bg-background-secondary p-1">
								{VIEW_MODES.map((mode) => (
									<button
										key={mode.key}
										type="button"
										onClick={() => setViewMode(mode.key)}
										className={cn(
											"rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
											viewMode === mode.key
												? "bg-background text-foreground shadow-sm"
												: "text-foreground-secondary hover:text-foreground",
										)}
									>
										{t(mode.labelKey)}
									</button>
								))}
							</div>
						}
					/>

					{destinations.length === 0 ? (
						<EmptyState
							title={t("destinationsPage.emptyTitle")}
							description={t("destinationsPage.emptyDescription")}
						/>
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
