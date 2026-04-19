import { createFileRoute } from "@tanstack/react-router";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	createComgateBookPayment,
	submitBookInterest,
} from "@/integrations/strapi/api";
import { resendEbookEmail } from "@/integrations/ebookApi";
import { EXTERNAL_SERVICES, SITE_CONFIG } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const SITE_URL = SITE_CONFIG.url;

export const Route = createFileRoute("/book/")({
	head: () => ({
		meta: [
			{ title: "Kniha o levném cestování | Svět za málo" },
			{
				name: "description",
				content:
					"Kniha o levném cestování – praktické tipy, rozpočty a inspirace. Informace o vydání, registrace a nákup.",
			},
			{
				property: "og:title",
				content: "Kniha o levném cestování | Svět za málo",
			},
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: `${SITE_URL}/book` },
		],
		links: [{ rel: "canonical", href: `${SITE_URL}/book` }],
	}),
	component: BookPage,
});

function BookPage() {
	const { t } = useTranslation();
	const { book } = useSiteSettings();
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [emailEbook, setEmailEbook] = useState("");
	const [statusEbook, setStatusEbook] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim()) return;
		setStatus("loading");
		try {
			await submitBookInterest(email.trim(), "book_notify");
			setStatus("success");
			setEmail("");
		} catch {
			setStatus("error");
		}
	};

	const handleEbookSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!emailEbook.trim()) return;
		setStatusEbook("loading");
		try {
			await submitBookInterest(emailEbook.trim(), "ebook");
			setStatusEbook("success");
			setEmailEbook("");
		} catch {
			setStatusEbook("error");
		}
	};

	const bookAvailable = book.available;
	const buyUrl = book.buyUrl || (t("book.buyUrl") as string) || "#";
	const uid = useId();
	const ebookPdfUrl = book.ebookPdfUrl || "";
	const bookPrice = book.price || "";

	const [buyEmail, setBuyEmail] = useState("");
	const [buyFullName, setBuyFullName] = useState("");
	const [buyStatus, setBuyStatus] = useState<"idle" | "loading" | "error">(
		"idle",
	);
	const [buyErrorMessage, setBuyErrorMessage] = useState("");

	const handleBuySubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!buyEmail.trim()) return;
		setBuyStatus("loading");
		setBuyErrorMessage("");
		try {
			const redirectUrl = await createComgateBookPayment(
				buyEmail.trim(),
				buyFullName.trim(),
			);
			window.location.href = redirectUrl;
		} catch (err) {
			setBuyStatus("error");
			setBuyErrorMessage(
				err instanceof Error ? err.message : (t("book.buyError") as string),
			);
		}
	};

	// When book is not available yet, show minimal "coming soon" page
	if (!bookAvailable) {
		return (
			<div className="container-narrow py-8 md:py-16">
				<header className="text-center mb-12 md:mb-16">
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
						{t("book.title")}
					</h1>
					<p className="text-lg md:text-xl text-foreground-secondary max-w-2xl mx-auto">
						{t("book.subtitle")}
					</p>
				</header>
				<div className="text-center py-12">
					<p className="text-foreground-secondary text-lg max-w-xl mx-auto">
						{t("book.comingSoon")}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container-narrow py-8 md:py-16">
			{/* Hero */}
			<header className="text-center mb-12 md:mb-16">
				<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
					{t("book.title")}
				</h1>
				<p className="text-lg md:text-xl text-foreground-secondary max-w-2xl mx-auto">
					{t("book.subtitle")}
				</p>
			</header>

			{/* Book info + CTA grid */}
			<div className="grid md:grid-cols-5 gap-10 md:gap-12 items-start">
				{/* Cover placeholder + short desc */}
				<div className="md:col-span-2">
					<div
						className="aspect-3/4 rounded-lg bg-background-tertiary border border-border-strong flex items-center justify-center text-foreground-muted"
						aria-hidden
					>
						<span className="text-4xl">📖</span>
					</div>
					<p className="mt-4 text-sm text-foreground-muted">
						{t("book.coverNote")}
					</p>
				</div>

				<div className="md:col-span-3 space-y-8">
					<section>
						<h2 className="text-xl font-semibold text-foreground mb-3">
							{t("book.descriptionTitle")}
						</h2>
						<p className="text-foreground-secondary leading-relaxed">
							{t("book.description")}
						</p>
					</section>

					<ul className="space-y-2">
						{(t("book.features") as string).split("|").map((feature) => (
							<li
								key={feature}
								className="flex items-start gap-3 text-foreground-secondary"
							>
								<span className="text-primary mt-0.5">✓</span>
								<span>{feature.trim()}</span>
							</li>
						))}
					</ul>

					{/* Free ebook lead + download */}
					<section className="p-6 rounded-lg bg-primary/10 border-2 border-primary/30">
						<h2 className="text-lg font-semibold text-foreground mb-2">
							{t("book.ebookTitle")}
						</h2>
						<p className="text-sm text-foreground-secondary mb-4">
							{t("book.ebookDesc")}
						</p>
						{statusEbook === "success" ? (
							<div className="space-y-3">
								<p className="text-success font-medium">
									{t("book.ebookSuccess")}
								</p>
								{ebookPdfUrl ? (
									<Button
										asChild
										size="lg"
										className="bg-primary hover:bg-primary-hover text-primary-foreground"
									>
										<a
											href={ebookPdfUrl}
											target="_blank"
											rel="noopener noreferrer"
											download
										>
											{t("book.ebookDownloadBtn")}
										</a>
									</Button>
								) : (
									<p className="text-sm text-foreground-muted">
										{t("book.ebookSuccessNoUrl")}
									</p>
								)}
							</div>
						) : (
							<form
								onSubmit={handleEbookSubmit}
								className="flex flex-col sm:flex-row gap-3"
							>
								<div className="flex-1">
									<Label htmlFor={`${uid}-ebook-email`} className="sr-only">
										{t("book.ebookPlaceholder")}
									</Label>
									<Input
										id={`${uid}-ebook-email`}
										type="email"
										placeholder={t("book.ebookPlaceholder")}
										value={emailEbook}
										onChange={(e) => setEmailEbook(e.target.value)}
										disabled={statusEbook === "loading"}
										className="w-full"
										required
									/>
								</div>
								<Button type="submit" disabled={statusEbook === "loading"}>
									{statusEbook === "loading"
										? t("common.loading")
										: t("book.ebookButton")}
								</Button>
							</form>
						)}
						{statusEbook === "error" && (
							<p className="mt-2 text-sm text-error">
								{t("book.registerError")}
							</p>
						)}
					</section>

					{/* Registration (notify when available) */}
					<section className="p-6 rounded-lg bg-primary-light/30 border border-border-strong">
						<h2 className="text-lg font-semibold text-foreground mb-2">
							{t("book.registerTitle")}
						</h2>
						<p className="text-sm text-foreground-secondary mb-4">
							{t("book.registerDesc")}
						</p>
						{status === "success" ? (
							<p className="text-success font-medium">
								{t("book.registerSuccess")}
							</p>
						) : (
							<form
								onSubmit={handleRegister}
								className="flex flex-col sm:flex-row gap-3"
							>
								<div className="flex-1">
									<Label htmlFor={`${uid}-book-email`} className="sr-only">
										{t("book.registerPlaceholder")}
									</Label>
									<Input
										id={`${uid}-book-email`}
										type="email"
										placeholder={t("book.registerPlaceholder")}
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										disabled={status === "loading"}
										className="w-full"
										required
									/>
								</div>
								<Button type="submit" disabled={status === "loading"}>
									{status === "loading"
										? t("common.loading")
										: t("book.registerButton")}
								</Button>
							</form>
						)}
						{status === "error" && (
							<p className="mt-2 text-sm text-error">
								{t("book.registerError")}
							</p>
						)}
					</section>

					{/* Purchase – Comgate (create payment via Strapi, redirect to gateway) */}
					<section className="p-6 rounded-lg bg-secondary-light/30 border-2 border-secondary/40">
						<h2 className="text-lg font-semibold text-foreground mb-2">
							{t("book.buyTitle")}
						</h2>
						<p className="text-sm text-foreground-secondary mb-2">
							{t("book.buyNote")}
						</p>
						{bookPrice && (
							<p className="text-lg font-semibold text-foreground mb-4">
								{t("book.buyPrice")}: {bookPrice}
							</p>
						)}
						<form onSubmit={handleBuySubmit} className="flex flex-col gap-3">
							<div>
								<Label htmlFor={`${uid}-buy-email`} className="sr-only">
									{t("book.buyEmailPlaceholder")}
								</Label>
								<Input
									id={`${uid}-buy-email`}
									type="email"
									placeholder={t("book.buyEmailPlaceholder")}
									value={buyEmail}
									onChange={(e) => setBuyEmail(e.target.value)}
									disabled={buyStatus === "loading"}
									className="w-full"
									required
								/>
							</div>
							<div>
								<Label htmlFor={`${uid}-buy-fullname`} className="sr-only">
									{t("book.buyFullNamePlaceholder")}
								</Label>
								<Input
									id={`${uid}-buy-fullname`}
									type="text"
									placeholder={t("book.buyFullNamePlaceholder")}
									value={buyFullName}
									onChange={(e) => setBuyFullName(e.target.value)}
									disabled={buyStatus === "loading"}
									className="w-full"
								/>
							</div>
							<Button
								type="submit"
								size="lg"
								disabled={buyStatus === "loading"}
								className="bg-secondary hover:bg-secondary-hover text-secondary-foreground"
							>
								{buyStatus === "loading"
									? t("common.loading")
									: t("book.buySubmitButton")}
							</Button>
						</form>
						{buyStatus === "error" && (
							<p className="mt-3 text-sm text-error">
								{buyErrorMessage || t("book.buyError")}
							</p>
						)}
						{buyStatus === "error" && buyUrl && buyUrl !== "#" && (
							<p className="mt-2 text-sm text-foreground-muted">
								<a
									href={buyUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="underline"
								>
									{t("book.buyButton")} ({t("book.buyAlternativeLink")})
								</a>
							</p>
						)}
					</section>
				</div>
			</div>

			<ResendEbookSection />
		</div>
	);
}

function ResendEbookSection() {
	const { t } = useTranslation();
	const uid = useId();
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim()) return;
		setStatus("loading");
		try {
			await resendEbookEmail({ email: email.trim() });
			setStatus("success");
			setEmail("");
		} catch {
			setStatus("error");
		}
	};

	return (
		<section className="mt-12 border-t border-border-strong pt-10">
			<div className="max-w-xl mx-auto text-center">
				<h2 className="text-lg font-semibold text-foreground mb-2">
					{t("ebook.resendTitle")}
				</h2>
				<p className="text-sm text-foreground-secondary mb-5">
					{t("ebook.resendDesc")}
				</p>
				{status === "success" ? (
					<p className="text-success font-medium">{t("ebook.resendSuccess")}</p>
				) : (
					<form
						onSubmit={handleSubmit}
						className="flex flex-col sm:flex-row gap-3 justify-center"
					>
						<div className="flex-1 max-w-sm">
							<Label htmlFor={`${uid}-resend-email`} className="sr-only">
								{t("book.ebookPlaceholder")}
							</Label>
							<Input
								id={`${uid}-resend-email`}
								type="email"
								placeholder={t("book.ebookPlaceholder")}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={status === "loading"}
								className="w-full"
								required
							/>
						</div>
						<Button
							type="submit"
							disabled={status === "loading"}
							variant="outline"
						>
							{status === "loading"
								? t("common.loading")
								: t("ebook.resendBtn")}
						</Button>
					</form>
				)}
				{status === "error" && (
					<p className="mt-2 text-sm text-error">{t("book.registerError")}</p>
				)}
			</div>
		</section>
	);
}
