/**
 * Skip to main content link for keyboard navigation
 * Appears on focus for screen reader and keyboard users
 */
export function SkipLink() {
	return (
		<a href="#main-content" style={{ position: "absolute", left: "-9999px" }}>
			Skip to main content
		</a>
	);
}

export default SkipLink;
