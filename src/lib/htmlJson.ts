/**
 * JSON that is safe to put inside a <script> element.
 *
 * JSON.stringify leaves "<" alone, so a value containing the characters
 * "</script>" closes the element early and everything after it is parsed as
 * markup. Any CMS string that reaches a <script type="application/json"> or a
 * JSON-LD block is enough: a product title, an article headline, a destination
 * name.
 *
 * Escaping these keeps the output valid JSON, because a JSON parser decodes
 * the escapes back to the original characters, while leaving nothing an HTML
 * parser will act on. U+2028 and U+2029 are escaped too: they are legal in
 * JSON but terminate a line inside a JavaScript string literal.
 */
const UNSAFE_IN_SCRIPT = /[<>&\u2028\u2029]/g;

export function jsonForScript(value: unknown): string {
	return JSON.stringify(value).replace(
		UNSAFE_IN_SCRIPT,
		(character) =>
			`\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`,
	);
}
