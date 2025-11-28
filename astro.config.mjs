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
    // Konfiguracja dla Cloudflare Workers - wymuszamy użycie serwerowej wersji react-dom
    ssr: {
      // Nie bundluj react-dom/server - użyj wersji z workerd
      external: ["react-dom/server"],
    },
    resolve: {
      // Mapowanie na serwerową wersję react-dom
      alias: import.meta.env.PROD
        ? {
            "react-dom/server": "react-dom/server.edge",
          }
        : {},
    },
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
