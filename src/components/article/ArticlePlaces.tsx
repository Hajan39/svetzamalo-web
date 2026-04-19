import type { Place } from "@/types";

interface ArticlePlacesProps {
	places: Place[];
}

export function ArticlePlaces({ places }: ArticlePlacesProps) {
	if (places.length === 0) return null;

	return (
		<section className="mt-16">
			<h2 className="text-2xl font-semibold text-foreground mb-6">
				Places to Visit
			</h2>
			<div className="space-y-4">
				{places.map((place) => (
					<article
						key={place.id}
						className="border border-border rounded-lg p-6 bg-background-secondary"
					>
						<h3 className="text-lg font-medium text-foreground mb-2">
							{place.name}
						</h3>
						<p className="text-foreground-secondary">{place.description}</p>
						{place.type && (
							<span className="inline-block mt-3 text-xs font-medium text-primary bg-primary-light px-2 py-1 rounded">
								{place.type}
							</span>
						)}
					</article>
				))}
			</div>
		</section>
	);
}

export default ArticlePlaces;
