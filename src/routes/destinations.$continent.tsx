import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo } from "react";
import { DestinationCard } from "@/components/destination";
import { useDestinations } from "@/integrations/strapi";
import { useTranslation } from "@/lib/i18n";

const SITE_URL = "https://lowcosttraveling.com";

type ContinentKey =
	| "europe"
	| "asia"
	| "africa"
	| "caribbean"
	| "northAmerica"
	| "southAmerica"
	| "oceania";

const VALID_CONTINENTS: ContinentKey[] = [
	"europe",
	"asia",
	"caribbean",
	"africa",
	"northAmerica",
	"southAmerica",
	"oceania",
];

export const Route = createFileRoute("/destinations/$continent")({
	loader: ({ params }) => {
		if (!VALID_CONTINENTS.includes(params.continent as ContinentKey)) {
			throw notFound();
		}
		return { continent: params.continent as ContinentKey };
	},
	head: ({ params }) => ({
		meta: [
			{ title: `${params.continent} Destinations | Lowcost Traveling` },
			{
				name: "description",
				content: `Explore budget travel guides for ${params.continent}. Find tips, costs, and practical info.`,
			},
		],
		links: [
			{
				rel: "canonical",
				href: `${SITE_URL}/destinations/${params.continent}`,
			},
		],
	}),
	component: ContinentDestinationsPage,
});

function ContinentDestinationsPage() {
	const { t } = useTranslation();
	const { continent } = Route.useLoaderData();
	const { data: destinations = [] } = useDestinations();

	const filteredDestinations = useMemo(() => {
		return destinations.filter((d) => d.continent === continent);
	}, [destinations, continent]);

	const continentLabel = t(`destinationsPage.continents.${continent}`);
	const continentDescription = t(
		`destinationsPage.continentDescriptions.${continent}`,
	);

	return (
		<div className="container-wide py-16">
			<header className="mb-12">
				<nav className="mb-4">
					<Link
						to="/destinations"
						className="text-sm text-foreground-secondary hover:text-primary transition-colors"
					>
						← {t("destinationsPage.title")}
					</Link>
				</nav>
				<h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
					{continentLabel}
				</h1>
				<p className="text-lg text-foreground-secondary max-w-2xl">
					{continentDescription}
				</p>
			</header>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredDestinations.map((destination) => (
					<DestinationCard key={destination.id} destination={destination} />
				))}
			</div>
		</div>
	);
}
