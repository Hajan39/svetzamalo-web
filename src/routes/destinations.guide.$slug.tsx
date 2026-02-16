import { createFileRoute, Link } from "@tanstack/react-router";
import { ArticleHtmlContent } from "@/components/article";
import { Breadcrumbs } from "@/components/seo";
import { NewsletterCta } from "@/components/monetization";
import {
	useDestinationBySlug,
	fetchDestinationBySlug,
	strapiQueryKeys,
} from "@/integrations/strapi";

const SITE_URL = "https://lowcosttraveling.com";

export const Route = createFileRoute("/destinations/guide/$slug")({
	loader: async ({ params, context }) => {
		const { queryClient } = context;
		const destination = await fetchDestinationBySlug(params.slug);
		if (destination) {
			await queryClient.prefetchQuery({
				queryKey: strapiQueryKeys.destinations.bySlug(params.slug),
				queryFn: () => fetchDestinationBySlug(params.slug),
			});
		}
		return { destination };
	},
	head: ({ loaderData, params }) => {
		const dest = loaderData?.destination;
		if (!dest) {
			return { meta: [{ title: "Destination Not Found | Lowcost Traveling" }] };
		}
		const canonicalUrl = `${SITE_URL}/destinations/guide/${params.slug}`;
		return {
			meta: [
				{ title: dest.seo.metaTitle },
				{ name: "description", content: dest.seo.metaDescription },
				{ name: "keywords", content: dest.seo.keywords.join(", ") },
				{ property: "og:title", content: dest.seo.metaTitle },
				{ property: "og:description", content: dest.seo.metaDescription },
				{ property: "og:type", content: "website" },
				{ property: "og:url", content: canonicalUrl },
			],
			links: [{ rel: "canonical", href: canonicalUrl }],
		};
	},
	component: DestinationGuidePage,
});

function DestinationGuidePage() {
	const { slug } = Route.useParams();
	const { destination: loaderDest } = Route.useLoaderData();
	const { data: destination, isLoading, error } = useDestinationBySlug(slug, {
		initialData: loaderDest || undefined,
	});

	if (isLoading) {
		return (
			<div className="container-narrow py-16 text-center">
				<p className="text-foreground-secondary">Loading...</p>
			</div>
		);
	}

	if (error || !destination) {
		return (
			<div className="container-narrow py-16">
				<h1 className="text-2xl font-semibold text-foreground">
					Destination not found
				</h1>
				<p className="text-foreground-secondary mt-2">
					The destination "{slug}" does not exist.
				</p>
				<Link
					to="/destinations"
					className="mt-4 inline-block text-primary hover:underline"
				>
					← Back to Destinations
				</Link>
			</div>
		);
	}

	const coverImage =
		destination.heroImage?.url ||
		"https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop";

	return (
		<article className="container-narrow py-8 md:py-12">
			<Breadcrumbs
				items={[
					{ label: "Destinations", href: "/destinations" },
					{ label: destination.name },
				]}
			/>

			<div className="mb-8">
				<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
					{destination.name}
				</h1>
				<div className="aspect-16/10 sm:aspect-video md:aspect-21/9 rounded-lg overflow-hidden bg-background-secondary">
					<img
						src={coverImage}
						alt={destination.name}
						className="w-full h-full object-cover"
						loading="lazy"
					/>
				</div>
			</div>

			{destination.introHtml && (
				<div className="space-y-8">
					<ArticleHtmlContent html={destination.introHtml} />
				</div>
			)}

			<div className="mt-16">
				<NewsletterCta />
			</div>
		</article>
	);
}
