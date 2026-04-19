import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
	className?: string;
	markClassName?: string;
	textClassName?: string;
	showWordmark?: boolean;
}

function BrandMark({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 180 220"
			className={className}
			aria-hidden="true"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<ellipse cx="90" cy="208" rx="42" ry="10" fill="#5EA83F" opacity="0.95" />
			<path
				d="M90 18C58.5 18 33 43.7 33 75.3C33 118 80 161.9 90 171C100 161.9 147 118 147 75.3C147 43.7 121.5 18 90 18Z"
				fill="white"
				stroke="#1F2937"
				strokeWidth="7.5"
				strokeLinejoin="round"
			/>
			<path
				d="M68 143H112L90 168L68 143Z"
				fill="#8CC63E"
				stroke="#8CC63E"
				strokeWidth="3"
				strokeLinejoin="round"
			/>
			<path
				d="M60 66C60 57.2 67.2 50 76 50H104C112.8 50 120 57.2 120 66V117H60V66Z"
				fill="#4F8F3A"
			/>
			<path
				d="M61 68H49C44.6 68 41 71.6 41 76V110C41 114.4 44.6 118 49 118H61V68Z"
				fill="#8CC63E"
			/>
			<path
				d="M131 68H119V118H131C135.4 118 139 114.4 139 110V76C139 71.6 135.4 68 131 68Z"
				fill="#8CC63E"
			/>
			<rect
				x="65"
				y="45"
				width="50"
				height="76"
				rx="10"
				fill="white"
				stroke="#1F2937"
				strokeWidth="7"
			/>
			<path d="M75 62H105V84H75V62Z" fill="#8CC63E" />
			<path
				d="M80 90H100"
				stroke="#1F2937"
				strokeWidth="7"
				strokeLinecap="round"
			/>
			<path
				d="M90 90V104"
				stroke="#1F2937"
				strokeWidth="7"
				strokeLinecap="round"
			/>
			<path
				d="M82 33C82 27.5 85.6 23 90 23C94.4 23 98 27.5 98 33V45H82V33Z"
				fill="white"
				stroke="#1F2937"
				strokeWidth="7"
			/>
			<path
				d="M59 67V117"
				stroke="#1F2937"
				strokeWidth="7"
				strokeLinecap="round"
			/>
			<path
				d="M121 67V117"
				stroke="#1F2937"
				strokeWidth="7"
				strokeLinecap="round"
			/>
			<path
				d="M60 117H120"
				stroke="#1F2937"
				strokeWidth="7"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export function BrandLogo({
	className,
	markClassName,
	textClassName,
	showWordmark = true,
}: BrandLogoProps) {
	const { t } = useTranslation();

	return (
		<span
			className={cn("inline-flex items-center gap-3", className)}
			role="img"
			aria-label={t("common.siteNameFull")}
		>
			<BrandMark
				className={cn("h-12 w-10 shrink-0 sm:h-14 sm:w-12", markClassName)}
			/>
			{showWordmark ? (
				<span className={cn("flex flex-col leading-none", textClassName)}>
					<span className="font-heading text-[1.7rem] font-bold tracking-[-0.05em] text-foreground sm:text-[2rem]">
						{t("common.siteName").trim()}
					</span>
					<span className="font-heading text-[1.9rem] font-bold tracking-[-0.06em] text-primary sm:text-[2.2rem]">
						{t("common.siteNameHighlight")}
					</span>
				</span>
			) : null}
		</span>
	);
}
