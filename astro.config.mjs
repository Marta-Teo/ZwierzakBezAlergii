// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://www.zwierzakbezalergii.pl",
  output: "server",
  integrations: [react(), sitemap()],
  server: { port: 4321 },
  vite: {
    plugins: [tailwindcss()],
  },
  // Wyłączamy automatyczne sesje Astro przez ustawienie custom drivera (noop)
  session: {
    driver: "memory",
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});
