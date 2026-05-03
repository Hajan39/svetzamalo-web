type CopyVariables = Record<string, string | number | undefined | null>;

export function interpolateCopy(value: string | undefined, variables: CopyVariables): string | undefined {
	if (!value) return value;
	return value.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_match, name: string) => {
		const replacement = variables[name];
		return replacement == null ? "" : String(replacement);
	});
}

export function copyValue(
	value: string | undefined,
	fallback: string,
	variables: CopyVariables = {},
): string {
	return interpolateCopy(value, variables) || fallback;
}
