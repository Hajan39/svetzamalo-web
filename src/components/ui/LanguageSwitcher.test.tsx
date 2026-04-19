import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageSwitcher } from "./LanguageSwitcher";

describe("LanguageSwitcher", () => {
	it("renders language options", () => {
		render(<LanguageSwitcher />);

		// Default locale is "cs" — flag shown in toggle button area
		const button = screen.getByRole("button", { name: /switch language/i });
		expect(button).toBeInTheDocument();
	});

	it("shows dropdown when clicked", () => {
		render(<LanguageSwitcher />);

		const button = screen.getByRole("button", { name: /switch language/i });
		fireEvent.click(button);

		// Only cs and en are supported locales
		expect(screen.getByText("Čeština")).toBeInTheDocument();
		expect(screen.getByText("English")).toBeInTheDocument();
	});

	it("changes language when option is selected", () => {
		render(<LanguageSwitcher />);

		const button = screen.getByRole("button", { name: /switch language/i });
		fireEvent.click(button);

		const englishOption = screen.getByText("English");
		fireEvent.click(englishOption);

		// i18n.setLocale saves to localStorage (no window.replace)
		expect(localStorage.getItem("locale")).toBe("en");
	});

	it("closes dropdown when clicking outside", () => {
		render(<LanguageSwitcher />);

		const button = screen.getByRole("button", { name: /switch language/i });
		fireEvent.click(button);

		expect(screen.getByText("English")).toBeInTheDocument();

		// Click the backdrop button to close
		const backdrop = screen.getByRole("button", {
			name: /close language selector/i,
		});
		fireEvent.click(backdrop);

		expect(screen.queryByText("English")).not.toBeInTheDocument();
	});
});
