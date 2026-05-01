import type { APIRoute } from "astro";
import { z } from "zod";
import {
	buildBankTransferDetails,
	createVariableSymbol,
	normalizePaymentAmount,
} from "@/lib/bankTransfer";
import { getBookPaymentMessage } from "@/lib/bookConfig";
import { createOrder, fetchSiteConfig } from "@/lib/content/api";

export const prerender = false;

const orderSchema = z.object({
	email: z.email(),
	fullName: z.string().min(2).max(120),
	productCode: z.string().min(2).max(80).default("ebook-paid-v1"),
});

async function parseBody(request: Request) {
	const contentType = request.headers.get("content-type") || "";
	if (contentType.includes("application/json")) return request.json();
	const form = await request.formData();
	return Object.fromEntries(form.entries());
}

export const POST: APIRoute = async ({ request, redirect }) => {
	const result = orderSchema.safeParse(await parseBody(request));
	if (!result.success) {
		return new Response(JSON.stringify({ error: "invalid_order" }), {
			status: 400,
		});
	}

	const siteConfig = await fetchSiteConfig("cs");
	const normalizedAmount = normalizePaymentAmount(
		siteConfig?.bookBankAmount || siteConfig?.bookPrice || "490",
	);
	const variableSymbol = createVariableSymbol(
		`${result.data.email}:${Date.now()}`,
	);
	const bankTransfer = buildBankTransferDetails(
		{
			accountNumber: siteConfig?.bookBankAccountNumber,
			bankCode: siteConfig?.bookBankCode,
			iban: siteConfig?.bookBankIban,
			bic: siteConfig?.bookBankBic,
			accountName: siteConfig?.bookBankAccountName,
			amount: siteConfig?.bookBankAmount || siteConfig?.bookPrice,
			currency: siteConfig?.bookBankCurrency || "CZK",
			message: getBookPaymentMessage(siteConfig),
			contactEmail: siteConfig?.bookBankContactEmail || siteConfig?.siteEmail,
		},
		variableSymbol,
	);

	if (!siteConfig?.bookBankTransferEnabled || !bankTransfer || !normalizedAmount) {
		return new Response(
			JSON.stringify({ error: "bank_transfer_not_configured" }),
			{
				status: 503,
			},
		);
	}

	try {
		await createOrder({
			data: {
				email: result.data.email,
				fullName: result.data.fullName,
				productCode: result.data.productCode,
				amount: bankTransfer.amount || normalizedAmount,
				currency:
					bankTransfer.currency || siteConfig?.bookBankCurrency || "CZK",
				variableSymbol,
				paymentMethod: "bank_transfer",
				paymentStatus: "pending_bank_transfer",
				locale: "cs",
			},
		});
	} catch (error) {
		console.warn(
			"Order persistence failed. Check Strapi order endpoint.",
			error,
		);
		return new Response(JSON.stringify({ error: "order_persistence_failed" }), {
			status: 502,
		});
	}

	if (
		(request.headers.get("content-type") || "").includes("application/json")
	) {
		return Response.json({
			status: "pending_bank_transfer",
			variableSymbol,
			bankTransfer,
		});
	}

	return redirect(
		`/book/success?vs=${encodeURIComponent(variableSymbol)}&email=${encodeURIComponent(result.data.email)}`,
		303,
	);
};
