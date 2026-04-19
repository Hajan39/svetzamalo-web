import { createFileRoute, Link } from "@tanstack/react-router";
import { ArticleHtmlContent } from "@/components/article";
import { EmptyState, SmartImage } from "@/components/common";
import { NewsletterCta } from "@/components/monetization";
import { Breadcrumbs } from "@/components/seo";
import { fetchDestinationBySlug } from "@/integrations/strapi/api";
import {
	strapiQueryKeys,
	useDestinationBySlug,
} from "@/integrations/strapi/hooks";
import { SITE_CONFIG } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n";

const SITE_URL = SITE_CONFIG.url;

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
			return {
				meta: [
					{ title: "Destination Not Found | Svět za málo" },
					{ name: "robots", content: "noindex,follow" },
				],
			};
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
	const { t } = useTranslation();
	const { slug } = Route.useParams();
	const { destination: loaderDest } = Route.useLoaderData();
	const {
		data: destination,
		isLoading,
		error,
	} = useDestinationBySlug(slug, {
		initialData: loaderDest || undefined,
	});

	if (isLoading) {
		return (
			<div className="container-narrow py-16 text-center">
				<p className="text-foreground-secondary">{t("common.loading")}</p>
			</div>
		);
	}

	if (error || !destination) {
		return (
			<div className="container-narrow py-16">
				<EmptyState
					title={t("errors.destinationNotFound")}
					description={t("destinationsPage.notFoundDescription")}
					action={
						<Link
							to="/destinations"
							className="inline-block text-primary hover:underline"
						>
							← {t("common.backToDestinations")}
						</Link>
					}
				/>
			</div>
		);
	}

	const coverImage = destination.heroImage?.url;

	return (
		<article className="container-narrow py-8 md:py-12">
			<Breadcrumbs
				items={[
					{ label: t("nav.destinations"), href: "/destinations" },
					{ label: destination.name },
				]}
			/>

			<div className="mb-8">
				<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
					{destination.name}
				</h1>
				<div className="aspect-16/10 sm:aspect-video md:aspect-21/9 rounded-lg overflow-hidden bg-background-secondary">
					<SmartImage
						src={coverImage}
						alt={destination.name}
						className="w-full h-full object-cover"
						loading="lazy"
						fallbackLabel={destination.name}
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
