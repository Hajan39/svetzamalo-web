import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SmartImageProps {
	src?: string | null;
	alt: string;
	className?: string;
	/** true = fetchpriority="high" + loading="eager" (hero obrázky nad foldem) */
	priority?: boolean;
	loading?: "eager" | "lazy";
	sizes?: string;
	width?: number;
	height?: number;
	fallbackClassName?: string;
	fallbackLabel?: string;
}

/**
 * Sestaví srcSet z Strapi upload URL.
 * Strapi generuje varianty prefixem: thumbnail_, small_, medium_, large_, xlarge_
 * Příklad: /uploads/hero.jpg → /uploads/small_hero.jpg 500w, ...
 */
function buildStrapiSrcSet(src: string): string | undefined {
	const match = src.match(/^(.*\/uploads\/)([^/]+)$/);
	if (!match) return undefined;
	const [, base, filename] = match;
	const breakpoints: [string, number][] = [
		["thumbnail_", 156],
		["small_", 500],
		["medium_", 750],
		["large_", 1000],
		["xlarge_", 1920],
	];
	const entries = breakpoints
		.map(([prefix, w]) => `${base}${prefix}${filename} ${w}w`)
		.concat([`${src} 1920w`]);
	return entries.join(", ");
}

export function SmartImage({
	src,
	alt,
	className,
	priority = false,
	loading,
	sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw",
	width,
	height,
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

	const resolvedLoading = loading ?? (priority ? "eager" : "lazy");
	const srcSet = buildStrapiSrcSet(src);

	return (
		<img
			src={src}
			srcSet={srcSet}
			sizes={srcSet ? sizes : undefined}
			alt={alt}
			className={className}
			loading={resolvedLoading}
			// biome-ignore lint/a11y/noInteractiveElementToNoninteractiveRole: fetchpriority is valid HTML
			{...(priority ? { fetchPriority: "high" as const } : {})}
			decoding={priority ? "sync" : "async"}
			width={width}
			height={height}
			onError={() => setHasError(true)}
		/>
	);
}