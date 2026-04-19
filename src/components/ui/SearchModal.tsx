import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useArticles, useDestinations } from "@/integrations/strapi/hooks";
import type { Article, Destination } from "@/types";

interface SearchResult {
	type: "article" | "destination";
	item: Article | Destination;
	title: string;
	description: string;
	url: string;
}

interface SearchModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const searchInputRef = useRef<HTMLInputElement | null>(null);

	// Load data from Strapi
	const { data: articles = [] } = useArticles();
	const { data: destinations = [] } = useDestinations();

	useEffect(() => {
		if (!isOpen) {
			setQuery("");
			setResults([]);
			return;
		}

		// Focus the modal input when opened so search is one-step interaction.
		requestAnimationFrame(() => {
			searchInputRef.current?.focus();
		});
	}, [isOpen]);

	useEffect(() => {
		if (query.trim().length < 2) {
			setResults([]);
			return;
		}

		const searchTerm = query.toLowerCase();
		const searchResults: SearchResult[] = [];

		// Search articles
		articles.forEach((article) => {
			if (
				article.title.toLowerCase().includes(searchTerm) ||
				article.intro.toLowerCase().includes(searchTerm) ||
				article.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
			) {
				searchResults.push({
					type: "article",
					item: article,
					title: article.title,
					description: article.intro,
					url: `/articles/${article.slug}`,
				});
			}
		});

		// Search destinations
		destinations.forEach((destination) => {
			if (
				destination.name.toLowerCase().includes(searchTerm) ||
				destination.continent.toLowerCase().includes(searchTerm)
			) {
				searchResults.push({
					type: "destination",
					item: destination,
					title: destination.name,
					description: `${destination.type} in ${destination.continent}`,
					url: `/destinations/guide/${destination.slug}`,
				});
			}
		});

		setResults(searchResults.slice(0, 10)); // Limit to 10 results
	}, [query, articles, destinations]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
			{/* Backdrop */}
			<button
				type="button"
				className="fixed inset-0 bg-black/50 cursor-default"
				aria-label="Close search"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="relative w-full max-w-2xl mx-4 bg-background rounded-lg shadow-xl border border-border">
				{/* Search Input */}
				<div className="p-4 border-b border-border">
					<div className="flex items-center gap-3">
						<svg
							className="w-5 h-5 text-foreground-muted"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Search</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
						<input
							ref={searchInputRef}
							type="text"
							placeholder="Search articles, destinations..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className="flex-1 bg-transparent border-0 outline-none text-lg placeholder:text-foreground-muted"
						/>
						{query && (
							<button
								type="button"
								onClick={() => setQuery("")}
								className="p-1 text-foreground-muted hover:text-foreground"
							>
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Clear search</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						)}
					</div>
				</div>

				{/* Results */}
				{results.length > 0 && (
					<div className="max-h-96 overflow-y-auto">
						{results.map((result, index) => (
							<Link
								key={`${result.type}-${index}`}
								to={result.url}
								onClick={onClose}
								className="block p-4 border-b border-border last:border-b-0 hover:bg-background-secondary transition-colors"
							>
								<div className="flex items-start gap-3">
									<div className="shrink-0 mt-1">
										{result.type === "article" ? (
											<svg
												className="w-5 h-5 text-primary"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<title>Article</title>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
												/>
											</svg>
										) : (
											<svg
												className="w-5 h-5 text-primary"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<title>Destination</title>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
												/>
											</svg>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="font-medium text-foreground truncate">
											{result.title}
										</h3>
										<p className="text-sm text-foreground-secondary truncate">
											{result.description}
										</p>
										<span className="text-xs text-primary capitalize">
											{result.type}
										</span>
									</div>
								</div>
							</Link>
						))}
					</div>
				)}

				{query.trim().length >= 2 && results.length === 0 && (
					<div className="p-8 text-center">
						<p className="text-foreground-secondary">
							No results found for "{query}"
						</p>
					</div>
				)}

				{/* Footer */}
				<div className="p-4 border-t border-border">
					<div className="flex items-center justify-between text-sm text-foreground-muted">
						<div className="flex items-center gap-4">
							<span>↑↓ to navigate</span>
							<span>↵ to select</span>
							<span>esc to close</span>
						</div>
						<button
							type="button"
							onClick={onClose}
							className="text-primary hover:text-primary-hover"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
