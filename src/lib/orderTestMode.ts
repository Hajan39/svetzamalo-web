function configuredTestEmails() {
	return (import.meta.env.BOOK_ORDER_TEST_EMAILS || "")
		.split(",")
		.map((email: string) => email.trim().toLowerCase())
		.filter(Boolean);
}

export function isOrderTestModeEnabled() {
	return configuredTestEmails().length > 0;
}

export function isBookTestModeRequested(searchParams: URLSearchParams) {
	const value = searchParams.get("testMode") || searchParams.get("test");
	return ["1", "true", "book"].includes((value || "").toLowerCase());
}

export function isOrderTestEmail(email: string) {
	return configuredTestEmails().includes(email.trim().toLowerCase());
}

export function getTestVariableSymbol() {
	return import.meta.env.BOOK_ORDER_TEST_VARIABLE_SYMBOL || "9999999999";
}
