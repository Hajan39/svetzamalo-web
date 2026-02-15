/**
 * Renders raw HTML article content (e.g. from WordPress export).
 * Applies article-appropriate typography via CSS in the container.
 */
interface ArticleHtmlContentProps {
	html: string;
	className?: string;
}

export function ArticleHtmlContent({ html, className = '' }: ArticleHtmlContentProps) {
	return (
		<div
			className={`article-content max-w-none [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-24 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-foreground [&_h4]:mt-6 [&_h4]:mb-2 [&_p]:text-lg [&_p]:text-foreground-secondary [&_p]:leading-loose [&_p]:mb-6 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_figure]:my-8 [&_img]:rounded-lg [&_img]:w-full [&_img]:h-auto [&_img]:object-cover [&_figcaption]:text-sm [&_figcaption]:text-foreground-muted [&_figcaption]:italic [&_figcaption]:text-center [&_figcaption]:mt-2 ${className}`}
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}
