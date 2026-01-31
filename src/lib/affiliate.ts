/**
 * Affiliate link utilities
 * Supports multiple affiliate networks including CJ.com (Commission Junction)
 */

// Environment variables for affiliate IDs
const CJ_PID = import.meta.env.VITE_CJ_PID || "";
const CJ_BOOKING_AID = import.meta.env.VITE_CJ_BOOKING_AID || "";
const SKYSCANNER_AFFILIATE_ID =
	import.meta.env.VITE_SKYSCANNER_AFFILIATE_ID || "";

export type AffiliatePartner =
	| "booking"
	| "skyscanner"
	| "hostelworld"
	| "getyourguide"
	| "viator";

interface AffiliateLinkParams {
	partner: AffiliatePartner;
	destination?: string;
	destinationId?: string;
	checkIn?: string;
	checkOut?: string;
	adults?: number;
}

/**
 * Generate CJ.com affiliate tracking link
 * CJ uses format: https://www.anrdoezrs.net/click-{PID}-{AID}?url={encoded_destination_url}
 */
function generateCJLink(advertiserId: string, destinationUrl: string): string {
	if (!CJ_PID || !advertiserId) {
		// Fallback to direct link if no affiliate IDs configured
		return destinationUrl;
	}

	const encodedUrl = encodeURIComponent(destinationUrl);
	return `https://www.anrdoezrs.net/click-${CJ_PID}-${advertiserId}?url=${encodedUrl}`;
}

/**
 * Generate Booking.com affiliate link via CJ.com
 */
export function getBookingLink(params: {
	destination: string;
	checkIn?: string;
	checkOut?: string;
	adults?: number;
}): string {
	const { destination, checkIn, checkOut, adults = 2 } = params;

	// Build Booking.com destination URL
	let bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}&group_adults=${adults}`;

	if (checkIn) bookingUrl += `&checkin=${checkIn}`;
	if (checkOut) bookingUrl += `&checkout=${checkOut}`;

	// Wrap with CJ tracking if configured
	if (CJ_PID && CJ_BOOKING_AID) {
		return generateCJLink(CJ_BOOKING_AID, bookingUrl);
	}

	return bookingUrl;
}

/**
 * Generate Skyscanner affiliate link
 */
export function getSkyscannerLink(params: {
	destination: string;
	origin?: string;
}): string {
	const { destination, origin } = params;

	let url = `https://www.skyscanner.com/transport/flights`;

	if (origin) {
		url += `/${origin}/${destination}`;
	} else {
		url += `/anywhere/${destination}`;
	}

	if (SKYSCANNER_AFFILIATE_ID) {
		url += `?associateid=${SKYSCANNER_AFFILIATE_ID}`;
	}

	return url;
}

/**
 * Generate affiliate link based on partner
 */
export function getAffiliateLink(params: AffiliateLinkParams): string {
	switch (params.partner) {
		case "booking":
			return getBookingLink({
				destination: params.destination || "",
				checkIn: params.checkIn,
				checkOut: params.checkOut,
				adults: params.adults,
			});

		case "skyscanner":
			return getSkyscannerLink({
				destination: params.destination || "",
			});

		case "hostelworld":
			return `https://www.hostelworld.com/search?search_keywords=${encodeURIComponent(params.destination || "")}`;

		case "getyourguide":
			return `https://www.getyourguide.com/s/?q=${encodeURIComponent(params.destination || "")}`;

		case "viator":
			return `https://www.viator.com/search/${encodeURIComponent(params.destination || "")}`;

		default:
			return "#";
	}
}

/**
 * Check if affiliate tracking is properly configured
 */
export function isAffiliateConfigured(partner: AffiliatePartner): boolean {
	switch (partner) {
		case "booking":
			return Boolean(CJ_PID && CJ_BOOKING_AID);
		case "skyscanner":
			return Boolean(SKYSCANNER_AFFILIATE_ID);
		default:
			return false;
	}
}
