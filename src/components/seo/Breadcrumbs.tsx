import { Link } from "@tanstack/react-router";
import { BreadcrumbStructuredData } from "./StructuredData";

interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface BreadcrumbsProps {
	items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
	// Prepare structured data items
	const structuredDataItems = [
		{ name: "Home", url: "/" },
		...items.map((item) => ({
			name: item.label,
			url: item.href || "",
		})),
	];

	return (
		<>
			{/* Structured Data for SEO */}
			<BreadcrumbStructuredData items={structuredDataItems} />

			{/* Semantic Breadcrumb Navigation */}
			<nav aria-label="Breadcrumb navigation" className="mb-8">
				<ol
					className="flex items-center gap-2 text-sm text-foreground-muted"
					itemScope
					itemType="https://schema.org/BreadcrumbList"
				>
					<li
						itemProp="itemListElement"
						itemScope
						itemType="https://schema.org/ListItem"
					>
						<Link
							to="/"
							className="hover:text-primary transition-colors"
							itemProp="item"
						>
							<span itemProp="name">Home</span>
						</Link>
						<meta itemProp="position" content="1" />
					</li>
					{items.map((item, index) => (
						<li
							key={item.label}
							className="flex items-center gap-2"
							itemProp="itemListElement"
							itemScope
							itemType="https://schema.org/ListItem"
						>
							<span aria-hidden="true">/</span>
							{item.href ? (
								<Link
									to={item.href}
									className="hover:text-primary transition-colors"
									itemProp="item"
								>
									<span itemProp="name">{item.label}</span>
								</Link>
							) : (
								<span className="text-foreground-secondary" itemProp="name">
									{item.label}
								</span>
							)}
							<meta itemProp="position" content={(index + 2).toString()} />
						</li>
					))}
				</ol>
			</nav>
		</>
	);
}

export default Breadcrumbs;
