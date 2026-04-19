import { cn } from "@/lib/utils";

interface ContainerProps {
	children: React.ReactNode;
	className?: string;
	size?: "narrow" | "wide" | "full";
}

export function Container({
	children,
	className,
	size = "wide",
}: ContainerProps) {
	const sizeClasses = {
		narrow: "max-w-2xl",
		wide: "max-w-6xl",
		full: "max-w-full",
	};

	return (
		<div
			className={cn(
				"mx-auto px-4 sm:px-6 lg:px-8",
				sizeClasses[size],
				className,
			)}
		>
			{children}
		</div>
	);
}

// Utility containers for common use cases
export function ContainerNarrow({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<Container size="narrow" className={className}>
			{children}
		</Container>
	);
}

export function ContainerWide({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<Container size="wide" className={className}>
			{children}
		</Container>
	);
}

export function ContainerFull({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<Container size="full" className={className}>
			{children}
		</Container>
	);
}
