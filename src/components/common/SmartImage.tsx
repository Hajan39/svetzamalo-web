import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SmartImageProps {
	src?: string | null;
	alt: string;
	className?: string;
	loading?: "eager" | "lazy";
	fallbackClassName?: string;
	fallbackLabel?: string;
}

export function SmartImage({
	src,
	alt,
	className,
	loading = "lazy",
	fallbackClassName,
	fallbackLabel,
}: SmartImageProps) {
	const [hasError, setHasError] = useState(!src);

	useEffect(() => {
		setHasError(!src);
	}, [src]);

	if (!src || hasError) {
		return (
			<div
				role="img"
				aria-label={alt}
				className={cn(
					"flex h-full w-full items-center justify-center bg-linear-to-br from-primary/15 via-primary-light to-background-secondary p-6 text-center",
					className,
					fallbackClassName,
				)}
			>
				<span className="max-w-[20ch] text-sm font-medium text-foreground-secondary sm:text-base">
					{fallbackLabel || alt}
				</span>
			</div>
		);
	}

	return (
		<img
			src={src}
			alt={alt}
			className={className}
			loading={loading}
			onError={() => setHasError(true)}
		/>
	);
}