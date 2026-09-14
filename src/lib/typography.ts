/**
 * Copy hygiene for text coming out of the CMS.
 *
 * Articles and destination guides are edited in Sanity, so their punctuation
 * cannot be fixed at the source the way the hardcoded strings in src/i18n can.
 * These helpers run on the way out instead: they drop decorative emoji and turn
 * the long dash into the comma Czech typography actually uses.
 *
 * Sanity's visual editing encodes its metadata as Unicode tag characters
 * (U+E0000 and up), which sit outside every range below and pass through
 * untouched.
 */

// Pictographs, dingbats, geometric icons, flags, and the variation selectors
// and zero-width joiners that glue them together. Plain arrows (U+2190-U+21FF)
// are left alone: "Praha → Vídeň" is legitimate in body text.
const GLYPH =
	"[\\u{1F000}-\\u{1FAFF}\\u{2600}-\\u{27BF}\\u{2B00}-\\u{2BFF}\\u{FE0E}\\u{FE0F}\\u{20E3}\\u{200D}]";
const HSPACE = "[ \\t\\u00A0]";

// An emoji closing a text run, one opening a text run, and one sitting between
// two words. Only the run's own spacing is touched, so indentation elsewhere in
// the HTML (a code block, say) is never disturbed.
const TRAILING = new RegExp(`${HSPACE}*(?:${GLYPH})+${HSPACE}*(?=</|\\n|$)`, "gu");
const LEADING = new RegExp(`(^|>|\\n)${HSPACE}*(?:${GLYPH})+${HSPACE}*`, "gu");
const INLINE = new RegExp(`${HSPACE}*(?:${GLYPH})+${HSPACE}*`, "gu");

/** Removes emoji and other decorative glyphs, closing the gap they leave. */
export function stripDecorativeGlyphs(value: string): string {
	if (!value) return value;
	return value
		.replace(TRAILING, "")
		.replace(LEADING, "$1")
		.replace(INLINE, " ");
}

/**
 * Replaces the em dash with the punctuation a Czech sentence would use: a dash
 * between spaces becomes a comma, and one following a clause that already ends
 * in punctuation simply disappears. Unspaced dashes, such as the range in
 * "10—12", are left alone.
 */
export function normalizeDashes(value: string): string {
	if (!value) return value;
	return value
		.replace(new RegExp(`([,;:.!?])${HSPACE}+[—―]${HSPACE}+`, "g"), "$1 ")
		.replace(new RegExp(`${HSPACE}+[—―]${HSPACE}+`, "g"), ", ");
}

/** Both passes, in the order CMS text should go through them. */
export function cleanCmsCopy(value: string): string {
	return normalizeDashes(stripDecorativeGlyphs(value));
}
