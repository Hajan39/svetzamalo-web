import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import type { Article } from "@/types";
import { ArticleCard } from "./ArticleCard";

vi.mock("@tanstack/react-router", () => ({
	Link: ({
		to,
		children,
		className,
		params,
	}: {
		to: string;
		children: ReactNode;
		className?: string;
		params?: Record<string, string>;
	}) => {
		let href = to;
		if (params) {
			for (const [key, value] of Object.entries(params)) {
				href = href.replace(`$${key}`, value);
			}
		}
		return (
			<a href={href} className={className}>
				{children}
			</a>
		);
	},
}));

const mockArticle: Article = {
	id: "1",
	title: "Test Article",
	slug: "test-article",
	destinationId: "test-destination",
	intro: "This is a test article introduction",
	articleType: "destination-guide" as const,
	publishedAt: "2024-01-01",
	updatedAt: "2024-01-01",
	sections: [],
	coverImage: {
		src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
		alt: "Test article cover",
	},
	seo: {
		metaTitle: "Test Article",
		metaDescription: "Test description",
		keywords: ["test"],
	},
	places: [],
};

describe("ArticleCard", () => {
	it("renders article title and intro", () => {
		render(<ArticleCard article={mockArticle} />);

		expect(screen.getByText("Test Article")).toBeTruthy();
		expect(screen.getByText("This is a test article introduction")).toBeTruthy();
	});

	it("renders article type badge", () => {
		render(<ArticleCard article={mockArticle} />);

		expect(screen.getByText("destination guide")).toBeTruthy();
	});

	it("renders publish date", () => {
		render(<ArticleCard article={mockArticle} />);

		// en-US locale with month:short → "Jan 1, 2024"
		expect(screen.getByText("Jan 1, 2024")).toBeTruthy();
	});

	it("links to correct article URL", () => {
		render(<ArticleCard article={mockArticle} />);

		const link = screen.getByRole("link");
		expect(link.getAttribute("href")).toBe("/articles/test-article");
	});

	it("renders featured variant with different styling", () => {
		render(<ArticleCard article={mockArticle} variant="featured" />);

		// Featured variant renders localized CTA
		expect(screen.getByText(/Číst článek/i)).toBeTruthy();
	});

	it("renders compact variant", () => {
		render(<ArticleCard article={mockArticle} variant="compact" />);

		// Compact variant shows title without CTA
		expect(screen.getByText("Test Article")).toBeTruthy();
	});
});
