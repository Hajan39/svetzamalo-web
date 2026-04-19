import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

/**
 * Currency Context
 * Manages selected currency and provides conversion utilities
 */

export interface CurrencyInfo {
	code: string;
	symbol: string;
	name: string;
	flag: string;
	rateFromUsd: number; // How many of this currency equals 1 USD
}

// Supported currencies with approximate exchange rates
export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
	{ code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸", rateFromUsd: 1 },
	{ code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺", rateFromUsd: 0.92 },
	{
		code: "CZK",
		symbol: "Kč",
		name: "Czech Koruna",
		flag: "🇨🇿",
		rateFromUsd: 23.5,
	},
	{
		code: "GBP",
		symbol: "£",
		name: "British Pound",
		flag: "🇬🇧",
		rateFromUsd: 0.79,
	},
	{
		code: "PLN",
		symbol: "zł",
		name: "Polish Zloty",
		flag: "🇵🇱",
		rateFromUsd: 4.05,
	},
	{
		code: "CHF",
		symbol: "Fr",
		name: "Swiss Franc",
		flag: "🇨🇭",
		rateFromUsd: 0.88,
	},
];

interface CurrencyContextValue {
	currency: CurrencyInfo;
	setCurrency: (code: string) => void;
	convert: (amountInUsd: number) => number;
	format: (amountInUsd: number, showSymbol?: boolean) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const STORAGE_KEY = "preferred-currency";
const DEFAULT_CURRENCY = SUPPORTED_CURRENCIES[0]; // USD

export function CurrencyProvider({ children }: { children: ReactNode }) {
	// Use fixed default for initial render so server and client match (avoid hydration mismatch).
	// After mount, useEffect syncs from localStorage.
	const [currency, setCurrencyState] = useState<CurrencyInfo>(
		() => DEFAULT_CURRENCY,
	);

	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const found = SUPPORTED_CURRENCIES.find((c) => c.code === stored);
			if (found) setCurrencyState(found);
		}
	}, []);

	const setCurrency = useCallback((code: string) => {
		const found = SUPPORTED_CURRENCIES.find((c) => c.code === code);
		if (found) {
			setCurrencyState(found);
			if (typeof window !== "undefined") {
				localStorage.setItem(STORAGE_KEY, code);
			}
		}
	}, []);

	const convert = useCallback(
		(amountInUsd: number): number => {
			return amountInUsd * currency.rateFromUsd;
		},
		[currency],
	);

	const format = useCallback(
		(amountInUsd: number, showSymbol = true): string => {
			const converted = amountInUsd * currency.rateFromUsd;
			const rounded = Math.round(converted);

			if (showSymbol) {
				// Symbol position varies by currency
				if (["USD", "GBP"].includes(currency.code)) {
					return `${currency.symbol}${rounded}`;
				}
				return `${rounded} ${currency.symbol}`;
			}
			return `${rounded}`;
		},
		[currency],
	);

	return (
		<CurrencyContext.Provider
			value={{ currency, setCurrency, convert, format }}
		>
			{children}
		</CurrencyContext.Provider>
	);
}

export function useCurrency() {
	const context = useContext(CurrencyContext);
	if (!context) {
		throw new Error("useCurrency must be used within CurrencyProvider");
	}
	return context;
}
