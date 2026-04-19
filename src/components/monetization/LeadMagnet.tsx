interface LeadMagnetProps {
	title: string;
	description: string;
	benefits?: string[];
	ctaText: string;
}

export function LeadMagnet({
	title,
	description,
	benefits,
	ctaText,
}: LeadMagnetProps) {
	return (
		<aside className="border-2 border-primary rounded-xl bg-primary-light p-5 sm:p-6 md:p-8 my-8 md:my-12">
			<div className="text-center max-w-lg mx-auto">
				<span
					className="text-2xl sm:text-3xl mb-3 md:mb-4 block"
					role="img"
					aria-hidden="true"
				>
					📋
				</span>
				<h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 md:mb-3">
					{title}
				</h3>
				<p className="text-sm sm:text-base text-foreground-secondary mb-4">
					{description}
				</p>

				{benefits && benefits.length > 0 && (
					<ul className="text-left text-foreground-secondary mb-6 space-y-2">
						{benefits.map((benefit) => (
							<li key={benefit} className="flex items-center gap-2">
								<span className="text-primary">✓</span>
								{benefit}
							</li>
						))}
					</ul>
				)}

				<div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
					<input
						type="email"
						placeholder="Your email"
						className="w-full sm:w-auto px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
					/>
					<button
						type="button"
						className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-primary-foreground font-medium px-6 py-3 rounded-lg transition-colors"
					>
						{ctaText}
					</button>
				</div>

				<p className="text-xs text-foreground-muted mt-4">
					No spam, unsubscribe anytime.
				</p>
			</div>
		</aside>
	);
}

export default LeadMagnet;
