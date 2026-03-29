import { defineConfig } from "@tanstack/react-start/config";

export default defineConfig({
  // Server configuration
  server: {
    // For static export on Hostinger, use static preset
    // Change to 'node-server' for Node.js hosting or 'vercel' for Vercel
    preset: "static",

    // Pre-render all known routes for static export
    prerender: {
      // Seed routes – crawlLinks will discover the rest from Strapi content
      routes: ["/", "/destinations", "/articles", "/about"],
      // Crawl links from pre-rendered pages to discover article/destination slugs
      crawlLinks: true,
    },
  },

  // React options
  react: {
    // Enable React strict mode
    strictMode: true,
  },
});
