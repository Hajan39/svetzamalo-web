import type { ArticleSection as ArticleSectionType } from "@/types";

interface ArticleSectionProps {
	section: ArticleSectionType;
}

export function ArticleSection({ section }: ArticleSectionProps) {
	return (
		<section id={section.id} className="scroll-mt-24">
			<h2 className="text-2xl font-semibold text-foreground mb-4">
				{section.title}
			</h2>
			<div className="text-foreground-secondary leading-relaxed">
				<p>{section.content}</p>
			</div>
		</section>
	);
}

export default ArticleSection;
