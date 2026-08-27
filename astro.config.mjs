// @ts-check
import { defineConfig } from "astro/config";
import sanity from "@sanity/astro";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";
import { loadEnv } from "vite";

const {
	PUBLIC_SANITY_PROJECT_ID,
	PUBLIC_SANITY_DATASET,
	PUBLIC_SANITY_API_VERSION,
	PUBLIC_SANITY_STUDIO_URL,
} = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");

// https://astro.build/config
export default defineConfig({
	site: process.env.SITE_URL || "https://svetzamalo.cz",
	output: "server",
	i18n: {
		locales: ["cs", "en"],
		defaultLocale: "cs",
		fallback: {
			en: "cs",
		},
		routing: {
			prefixDefaultLocale: false,
			fallbackType: "rewrite",
		},
	},
	adapter: vercel(),
	security: {
		// Astro's built-in origin check rejects every form-encoded POST without an
		// Origin header, which is exactly what a server-to-server webhook looks
		// like: Comgate's payment notifications were answered 403 before any
		// handler ran. It is all-or-nothing per site, so the equivalent check now
		// lives in src/middleware.ts, which can exempt the webhook path.
		checkOrigin: false,
	},
	image: {
		domains: ['cdn.sanity.io'],
	},
	vite: {
		plugins: [tailwindcss()],
		optimizeDeps: {
			include: [
				"react/compiler-runtime",
				"lodash/isObject.js",
				"lodash/groupBy.js",
				"lodash/keyBy.js",
				"lodash/partition.js",
				"lodash/sortedIndex.js",
			],
		},
	},

	integrations: [
		sanity({
			projectId: PUBLIC_SANITY_PROJECT_ID,
			dataset: PUBLIC_SANITY_DATASET,
			apiVersion: PUBLIC_SANITY_API_VERSION || "2025-01-01",
			useCdn: false,
			stega: {
				studioUrl: PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333",
			},
		}),
		mdx(),
		react(),
	],
});
