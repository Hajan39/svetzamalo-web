interface TipBoxProps {
	variant: "tip" | "warning" | "info" | "budget";
	title?: string;
	children: React.ReactNode;
}

const variantStyles = {
	tip: {
		bg: "bg-accent-light",
		icon: "💡",
		defaultTitle: "Tip",
	},
	warning: {
		bg: "bg-warning-light",
		icon: "⚠️",
		defaultTitle: "Warning",
	},
	info: {
		bg: "bg-info-light",
		icon: "ℹ️",
		defaultTitle: "Info",
	},
	budget: {
		bg: "bg-success-light",
		icon: "💰",
		defaultTitle: "Budget Tip",
	},
};

export function TipBox({ variant, title, children }: TipBoxProps) {
	const styles = variantStyles[variant];

	return (
		<aside className={`${styles.bg} rounded-lg p-6 my-8`}>
			<div className="flex items-start gap-3">
				<span className="text-xl" role="img" aria-hidden="true">
					{styles.icon}
				</span>
				<div>
					<p className="font-heading text-sm font-bold uppercase tracking-wider text-foreground mb-2">
						{title || styles.defaultTitle}
					</p>
					<div className="text-foreground-secondary">{children}</div>
				</div>
			</div>
		</aside>
	);
}

export default TipBox;
