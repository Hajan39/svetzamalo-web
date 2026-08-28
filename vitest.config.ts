import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Deliberately does not extend astro.config.mjs: that config loads the Astro,
// React and Tailwind plugins, none of which these unit tests need, and the
// Sanity integration there demands credentials at load time.
export default defineConfig({
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	test: {
		include: ["src/**/*.test.ts"],
		environment: "node",
	},
});
