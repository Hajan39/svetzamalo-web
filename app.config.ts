import { defineConfig } from "@tanstack/react-start/config";

export default defineConfig({
  // Server configuration
  server: {
    // Vercel deployment – uses serverless functions
    preset: "vercel",
  },

  // React options
  react: {
    // Enable React strict mode
    strictMode: true,
  },
});
