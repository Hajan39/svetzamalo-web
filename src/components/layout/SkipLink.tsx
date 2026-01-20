/**
 * Skip to main content link for keyboard navigation
 * Appears on focus for screen reader and keyboard users
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only
        focus:fixed focus:top-4 focus:left-4 focus:z-50
        focus:bg-accent focus:text-accent-foreground
        focus:px-4 focus:py-2 focus:rounded-lg
        focus:font-medium focus:outline-none focus:ring-2 focus:ring-ring
      "
    >
      Skip to main content
    </a>
  )
}

export default SkipLink
