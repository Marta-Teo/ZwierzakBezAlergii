import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    // Środowisko jsdom dla testów komponentów React
    environment: "jsdom",

    // Globalne pliki setup
    setupFiles: ["./test/setup.ts"],

    // Ścieżki do plików testowych
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", "dist", ".astro", "e2e"],

    // Coverage - tylko gdy explicite poproszony
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "test/", "**/*.d.ts", "**/*.config.{js,ts}", "**/types.ts", "dist/"],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },

    // Globalne ustawienia testów
    globals: true,

    // Domyślny timeout
    testTimeout: 10000,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
