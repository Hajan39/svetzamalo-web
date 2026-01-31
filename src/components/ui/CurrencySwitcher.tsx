import { useEffect, useRef, useState } from "react";
import { SUPPORTED_CURRENCIES, useCurrency } from "@/lib/currency";

/**
 * Currency Switcher
 * Dropdown to select display currency for prices
 */

interface CurrencySwitcherProps {
	variant?: "dropdown" | "inline";
}

export function CurrencySwitcher({
	variant = "dropdown",
}: CurrencySwitcherProps) {
	const { currency, setCurrency } = useCurrency();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close on outside click
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Close on Escape
	useEffect(() => {
		function handleEscape(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		}
		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, []);

	if (variant === "inline") {
		return (
			<div className="flex gap-1">
				{SUPPORTED_CURRENCIES.slice(0, 4).map((curr) => (
					<button
						key={curr.code}
						onClick={() => setCurrency(curr.code)}
						className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
							currency.code === curr.code
								? "bg-foreground text-background"
								: "text-foreground-secondary hover:text-foreground"
						}`}
					>
						{curr.code}
					</button>
				))}
			</div>
		);
	}

	return (
		<div ref={dropdownRef} className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-1.5 px-3 py-2 text-sm text-foreground-secondary hover:text-foreground rounded-lg hover:bg-background-secondary transition-colors"
				aria-expanded={isOpen}
				aria-haspopup="listbox"
			>
				<span>{currency.symbol}</span>
				<span className="font-medium">{currency.code}</span>
				<svg
					className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-1 z-50">
					{SUPPORTED_CURRENCIES.map((curr) => (
						<button
							key={curr.code}
							onClick={() => {
								setCurrency(curr.code);
								setIsOpen(false);
							}}
							className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
								currency.code === curr.code
									? "bg-primary-light text-primary"
									: "text-foreground-secondary hover:bg-background-secondary hover:text-foreground"
							}`}
						>
							<span className="text-lg">{curr.flag}</span>
							<span className="font-medium">{curr.code}</span>
							<span className="text-foreground-muted ml-auto">
								{curr.symbol}
							</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
