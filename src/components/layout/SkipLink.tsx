/**
 * Skip to main content link for keyboard navigation
 * Appears on focus for screen reader and keyboard users
 */
export function SkipLink({ targetId }: { targetId: string }) {
	return (
		<a href={`#${targetId}`} style={{ position: "absolute", left: "-9999px" }}>
			Skip to main content
		</a>
	);
}

export default SkipLink;
