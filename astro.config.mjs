// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
	site: process.env.SITE_URL || "https://svetzamalo.cz",
	adapter: vercel(),
	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [mdx(), react(), sitemap()],
});
