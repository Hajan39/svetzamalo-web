import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	return {
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},
		plugins: [
			devtools(),
			nitro(),
			// this is the plugin that enables path aliases
			viteTsConfigPaths({
				projects: ["./tsconfig.json"],
			}),
			tailwindcss(),
			tanstackStart(),
			viteReact(),
		],
		build: {
			chunkSizeWarningLimit: 1000,
			rollupOptions: {
				output: {
					manualChunks: {
						"vendor-react": ["react", "react-dom"],
						"vendor-tanstack": [
							"@tanstack/react-router",
							"@tanstack/react-query",
							"@tanstack/react-start",
						],
						"vendor-ui": [
							"lucide-react",
							"class-variance-authority",
							"clsx",
							"tailwind-merge",
						],
						"strapi-integration": [
							"./src/integrations/strapi/client.ts",
							"./src/integrations/strapi/api.ts",
							"./src/integrations/strapi/types.ts",
						],
					},
				},
			},
		},
		define: {
			"import.meta.env.VITE_STRAPI_URL": JSON.stringify(
				env.VITE_STRAPI_URL || "",
			),
			"import.meta.env.VITE_STRAPI_API_TOKEN": JSON.stringify(
				env.VITE_STRAPI_API_TOKEN || "",
			),
			"import.meta.env.VITE_USE_STATIC_CONTENT": JSON.stringify(
				env.VITE_USE_STATIC_CONTENT || "",
			),
		},
	};
});
