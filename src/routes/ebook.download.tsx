import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { downloadEbook } from "@/integrations/ebookApi";
import { SITE_CONFIG } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n";

const SITE_URL = SITE_CONFIG.url;

export const Route = createFileRoute("/ebook/download")({
	head: () => ({
		meta: [
			{ title: "Stáhnout e‑book | Svět za málo" },
			{ name: "robots", content: "noindex" },
		],
		links: [{ rel: "canonical", href: `${SITE_URL}/ebook/download` }],
	}),
	component: EbookDownloadPage,
});

type Status = "loading" | "success" | "invalid" | "expired" | "error";

function EbookDownloadPage() {
	const { t } = useTranslation();
	const [status, setStatus] = useState<Status>("loading");
	const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const token = params.get("token");

		if (!token) {
			setStatus("invalid");
			return;
		}

		downloadEbook(token)
			.then(({ url }) => {
				setDownloadUrl(url);
				setStatus("success");
			})
			.catch((err: Error) => {
				if (err.message === "invalid_token") {
					setStatus("expired");
				} else {
					setStatus("error");
				}
			});
	}, []);

	return (
		<section className="container-narrow py-12 md:py-20">
			<div className="brand-card max-w-2xl mx-auto px-6 py-10 md:px-10 md:py-12 text-center">
				{status === "loading" && (
					<>
						<div
							className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-background-secondary animate-pulse"
							aria-hidden
						/>
						<p className="text-foreground-secondary">{t("common.loading")}</p>
					</>
				)}

				{status === "success" && downloadUrl && (
					<>
						<div
							className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary shadow-sm"
							aria-hidden
						>
							<span className="text-3xl">📖</span>
						</div>
						<h1 className="mb-4 text-foreground">{t("ebook.downloadTitle")}</h1>
						<p className="mx-auto mb-6 max-w-xl text-foreground-secondary">
							{t("ebook.downloadReady")}
						</p>
						<Button
							asChild
							size="lg"
							className="bg-primary hover:bg-primary-hover text-primary-foreground"
						>
							<a href={downloadUrl} download rel="noopener noreferrer">
								{t("ebook.downloadBtn")}
							</a>
						</Button>
						<p className="mt-4 text-xs text-foreground-muted">
							{t("ebook.downloadExpiry")}
						</p>
					</>
				)}

				{(status === "expired" || status === "invalid") && (
					<>
						<div
							className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-error/10 text-error"
							aria-hidden
						>
							<span className="text-3xl">⚠️</span>
						</div>
						<h1 className="mb-4 text-foreground">
							{t("ebook.tokenInvalidTitle")}
						</h1>
						<p className="mx-auto mb-6 max-w-xl text-foreground-secondary">
							{t("ebook.tokenInvalidDesc")}
						</p>
						<Link
							to="/book"
							className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-primary px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground hover:no-underline"
						>
							{t("ebook.tokenInvalidCta")}
						</Link>
					</>
				)}

				{status === "error" && (
					<>
						<div
							className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-error/10 text-error"
							aria-hidden
						>
							<span className="text-3xl">⚠️</span>
						</div>
						<h1 className="mb-4 text-foreground">{t("errors.generic")}</h1>
						<p className="mx-auto mb-6 max-w-xl text-foreground-secondary">
							{t("ebook.downloadError")}
						</p>
						<Link
							to="/book"
							className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-primary px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground hover:no-underline"
						>
							{t("ebook.tokenInvalidCta")}
						</Link>
					</>
				)}
			</div>
		</section>
	);
}
