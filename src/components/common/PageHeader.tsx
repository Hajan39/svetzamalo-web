interface PageHeaderProps {
	title: string;
	description?: string;
	className?: string;
	actions?: React.ReactNode;
}

export function PageHeader({
	title,
	description,
	className = "",
	actions,
}: PageHeaderProps) {
	return (
		<header className={`mb-8 md:mb-12 ${className}`}>
			<div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
					{title}
				</h1>
				{actions ? <div>{actions}</div> : null}
			</div>
			{description ? (
				<p className="max-w-2xl text-base text-foreground-secondary md:text-lg">
					{description}
				</p>
			) : null}
		</header>
	);
}