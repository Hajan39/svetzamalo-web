import { useState } from "react";
import { useTranslation } from "@/lib/i18n";

interface NewsletterCtaProps {
	title?: string;
	description?: string;
	buttonText?: string;
	placeholder?: string;
	disclaimer?: string;
	className?: string;
}

export function NewsletterCta({
	title,
	description,
	buttonText,
	placeholder,
	disclaimer,
	className = "",
}: NewsletterCtaProps) {
	const { t } = useTranslation();

	const resolvedTitle = title ?? t("monetization.newsletterTitle");
	const resolvedDescription =
		description ?? t("monetization.newsletterDescription");
	const resolvedButtonText = buttonText ?? t("monetization.newsletterButton");
	const resolvedPlaceholder =
		placeholder ?? t("monetization.newsletterPlaceholder");
	const resolvedDisclaimer = disclaimer ?? t("homePage.noSpam");

	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		setIsSubmitted(true);
		setIsSubmitting(false);
		setEmail("");
	};

	if (isSubmitted) {
		return (
			<div
				className={`text-center p-6 bg-success-light border border-success rounded-lg ${className}`}
			>
				<div className="text-2xl mb-2">✅</div>
				<h3 className="text-lg font-semibold text-success mb-2">
					{t("monetization.newsletterSuccessTitle")}
				</h3>
				<p className="text-success text-sm">
					{t("monetization.newsletterSuccessDescription")}
				</p>
			</div>
		);
	}

	return (
		<div
			className={`bg-primary-light rounded-xl p-5 sm:p-6 md:p-8 text-center ${className}`}
		>
			<h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 md:mb-4">
				{resolvedTitle}
			</h3>
			<p className="text-sm sm:text-base text-foreground-secondary mb-6 md:mb-8 max-w-md mx-auto">
				{resolvedDescription}
			</p>

			<form onSubmit={handleSubmit} className="max-w-md mx-auto">
				<div className="flex flex-col sm:flex-row gap-3">
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder={resolvedPlaceholder}
						required
						disabled={isSubmitting}
						className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
					/>
					<button
						type="submit"
						disabled={isSubmitting || !email.trim()}
						className="px-6 py-3 bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
					>
						{isSubmitting
							? t("monetization.newsletterSubmitting")
							: resolvedButtonText}
					</button>
				</div>
				{resolvedDisclaimer && (
					<p className="text-xs text-foreground-muted mt-4">
						{resolvedDisclaimer}
					</p>
				)}
			</form>
		</div>
	);
}
