import { defineConfig } from '@tanstack/react-start/config'

export default defineConfig({
  // Server configuration
  server: {
    // For static export on Hostinger, use static preset
    // Change to 'node-server' for Node.js hosting or 'vercel' for Vercel
    preset: 'static',

    // Pre-render all known routes for static export
    prerender: {
      // Routes to pre-render (add all destination slugs)
      routes: [
        '/',
        '/destinations',
        '/articles',
        '/about',
        '/articles/dominican-republic',
        '/articles/vatican',
        '/articles/thailand',
        '/articles/portugal',
        '/articles/morocco',
        '/articles/bali',
      ],
      // Crawl links from pre-rendered pages
      crawlLinks: true,
    },
  },

  // React options
  react: {
    // Enable React strict mode
    strictMode: true,
  },
})
