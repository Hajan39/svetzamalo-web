import type { ReactNode } from "react";

interface EmptyStateProps {
	title: string;
	description?: string;
	action?: ReactNode;
	className?: string;
}

export function EmptyState({
	title,
	description,
	action,
	className = "",
}: EmptyStateProps) {
	return (
		<div
			className={`rounded-xl border border-border bg-background-secondary px-6 py-12 text-center ${className}`}
		>
			<h2 className="text-xl font-semibold text-foreground">{title}</h2>
			{description ? (
				<p className="mt-2 text-foreground-secondary">{description}</p>
			) : null}
			{action ? <div className="mt-4">{action}</div> : null}
		</div>
	);
}