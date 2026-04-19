import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
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

const mockArticle = {
	id: "1",
	title: "Test Article",
	slug: "test-article",
	intro: "This is a test article introduction",
	articleType: "destination-guide" as const,
	publishedAt: "2024-01-01",
	updatedAt: "2024-01-01",
	author: "Test Author",
	coverImage: {
		src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
		alt: "Test article cover",
	},
	seo: {
		metaTitle: "Test Article",
		metaDescription: "Test description",
		keywords: ["test"],
		ogImage: null,
	},
	places: [],
};

describe("ArticleCard", () => {
	it("renders article title and intro", () => {
		render(<ArticleCard article={mockArticle} />);

		expect(screen.getByText("Test Article")).toBeInTheDocument();
		expect(
			screen.getByText("This is a test article introduction"),
		).toBeInTheDocument();
	});

	it("renders article type badge", () => {
		render(<ArticleCard article={mockArticle} />);

		expect(screen.getByText("destination guide")).toBeInTheDocument();
	});

	it("renders publish date", () => {
		render(<ArticleCard article={mockArticle} />);

		// en-US locale with month:short → "Jan 1, 2024"
		expect(screen.getByText("Jan 1, 2024")).toBeInTheDocument();
	});

	it("links to correct article URL", () => {
		render(<ArticleCard article={mockArticle} />);

		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("href", "/articles/test-article");
	});

	it("renders featured variant with different styling", () => {
		render(<ArticleCard article={mockArticle} variant="featured" />);

		// Featured variant renders "Read article →" CTA
		expect(screen.getByText(/Read article/i)).toBeInTheDocument();
	});

	it("renders compact variant", () => {
		render(<ArticleCard article={mockArticle} variant="compact" />);

		// Compact variant shows title without CTA
		expect(screen.getByText("Test Article")).toBeInTheDocument();
	});
});
