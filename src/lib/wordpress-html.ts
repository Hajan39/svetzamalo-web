/**
 * Strip WordPress Gutenberg block comments from exported HTML.
 * Keeps only the actual HTML content (paragraphs, headings, images, etc.)
 */
export function stripWordPressBlockComments(html: string): string {
	return html
		.split('\n')
		.filter((line) => !line.trim().match(/^<!-- \/?wp:/))
		.join('\n')
		.trim();
}
